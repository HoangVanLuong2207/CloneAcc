import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAccountSchema, updateAccountSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all accounts
  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  // Create new account
  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create account" });
      }
    }
  });

  // Update account status
  app.patch("/api/accounts/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = updateAccountSchema.parse(req.body);
      const account = await storage.updateAccountStatus(id, status!);
      
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update account" });
      }
    }
  });

  // Delete account
  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAccount(id);
      
      if (!success) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Import accounts from file
  app.post("/api/accounts/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file được cung cấp" });
      }

      // Check file size (limit to 1MB)
      if (req.file.size > 1024 * 1024) {
        return res.status(400).json({ message: "File quá lớn. Giới hạn 1MB" });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      
      // Parse file content safely - only accept JSON format
      let accounts;
      try {
        // Extract JSON array from the file content
        const arrayMatch = fileContent.match(/\[[\s\S]*\]/);
        if (!arrayMatch) {
          return res.status(400).json({ message: "File phải chứa một mảng JSON. Format: [{\"username\": \"user\", \"password\": \"pass\"}]" });
        }

        // Convert JavaScript object notation to valid JSON
        const jsonContent = arrayMatch[0]
          .replace(/(\w+):/g, '"$1":')  // Add quotes around property names
          .replace(/'/g, '"');          // Convert single quotes to double quotes
        
        accounts = JSON.parse(jsonContent);
        console.log('Successfully parsed accounts:', accounts.length, 'items');
      } catch (parseError) {
        console.log('Parse error:', parseError);
        return res.status(400).json({ message: "Format file không hợp lệ. Sử dụng format JSON: [{\"username\": \"user\", \"password\": \"pass\"}]" });
      }

      if (!Array.isArray(accounts)) {
        return res.status(400).json({ message: "File phải chứa một mảng tài khoản" });
      }

      // Limit array size to prevent abuse
      if (accounts.length > 1000) {
        return res.status(400).json({ message: "Quá nhiều tài khoản. Giới hạn 1000 tài khoản mỗi lần import" });
      }

      const createdAccounts = [];
      const errors = [];
      const seenUsernames = new Set();

      for (const accountData of accounts) {
        try {
          const validatedData = insertAccountSchema.parse(accountData);
          
          // Check for duplicates within the file
          if (seenUsernames.has(validatedData.username)) {
            errors.push({ account: accountData, error: 'Tên tài khoản trùng lặp trong file' });
            continue;
          }
          seenUsernames.add(validatedData.username);

          const account = await storage.createAccount(validatedData);
          createdAccounts.push(account);
        } catch (error) {
          let errorMessage = 'Lỗi không xác định';
          if (error instanceof Error) {
            if (error.message.includes('unique')) {
              errorMessage = 'Tên tài khoản đã tồn tại trong database';
            } else {
              errorMessage = error.message;
            }
          }
          errors.push({ account: accountData, error: errorMessage });
        }
      }

      res.json({ 
        imported: createdAccounts.length,
        errors: errors.length,
        accounts: createdAccounts,
        errorDetails: errors
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to import accounts" });
    }
  });

  // Get account statistics
  app.get("/api/accounts/stats", async (req, res) => {
    try {
      const stats = await storage.getAccountStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
