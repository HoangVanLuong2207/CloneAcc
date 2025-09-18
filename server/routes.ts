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
        return res.status(400).json({ message: "No file provided" });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      
      // Parse JavaScript file content
      let accounts;
      try {
        // Remove any module.exports or const declarations and evaluate the accounts array
        const cleanContent = fileContent
          .replace(/const\s+\w+\s*=\s*/, '')
          .replace(/module\.exports\s*=\s*/, '')
          .replace(/export\s+(default\s+)?/, '');
        
        accounts = eval(`(${cleanContent})`);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid JavaScript file format" });
      }

      if (!Array.isArray(accounts)) {
        return res.status(400).json({ message: "File must contain an array of accounts" });
      }

      const createdAccounts = [];
      const errors = [];

      for (const accountData of accounts) {
        try {
          const validatedData = insertAccountSchema.parse(accountData);
          const account = await storage.createAccount(validatedData);
          createdAccounts.push(account);
        } catch (error) {
          errors.push({ account: accountData, error: error instanceof Error ? error.message : 'Unknown error' });
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
