import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AccountTable from "@/components/account-table";
import ImportSection from "@/components/import-section";
import DeleteModal from "@/components/delete-modal";
import type { Account } from "@shared/schema";

interface AccountStats {
  total: number;
  active: number;
  inactive: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "on" | "off">("all");

  // Fetch accounts
  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ['/api/accounts']
  });

  // Fetch statistics
  const { data: stats } = useQuery<AccountStats>({
    queryKey: ['/api/accounts/stats']
  });

  // Toggle account status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
      await apiRequest('PATCH', `/api/accounts/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/stats'] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái tài khoản",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/stats'] });
      setAccountToDelete(null);
      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa tài khoản",
        variant: "destructive",
      });
    },
  });

  // Import accounts mutation
  const importAccountsMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/accounts/import', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Import failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/stats'] });
      toast({
        title: "Thành công",
        description: `Đã import ${data.imported} tài khoản`,
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Thành công",
        description: `Đã copy ${type} vào clipboard!`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể copy vào clipboard",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = (account: Account) => {
    toggleStatusMutation.mutate({ id: account.id, status: !account.status });
  };

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
  };

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      deleteAccountMutation.mutate(accountToDelete.id);
    }
  };

  const handleImport = (file: File) => {
    importAccountsMutation.mutate(file);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "on" && account.status) ||
      (statusFilter === "off" && !account.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý tài khoản</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi tất cả các tài khoản trong hệ thống</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Import Section */}
        <ImportSection 
          onImport={handleImport}
          isImporting={importAccountsMutation.isPending}
          stats={stats}
        />

        {/* Accounts Table */}
        <div className="lg:col-span-3">
          <AccountTable
            accounts={filteredAccounts}
            isLoading={isLoading}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onCopyUsername={(username) => copyToClipboard(username, 'tài khoản')}
            onCopyPassword={(password) => copyToClipboard(password, 'mật khẩu')}
            onToggleStatus={handleToggleStatus}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!accountToDelete}
        accountName={accountToDelete?.username || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAccountToDelete(null)}
        isDeleting={deleteAccountMutation.isPending}
      />
    </div>
  );
}
