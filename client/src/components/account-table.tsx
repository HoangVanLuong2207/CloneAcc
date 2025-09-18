import { Copy, Key, Check, Power, Trash2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Account } from "@shared/schema";

interface AccountTableProps {
  accounts: Account[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: "all" | "on" | "off";
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | "on" | "off") => void;
  onCopyUsername: (username: string) => void;
  onCopyPassword: (password: string) => void;
  onToggleStatus: (account: Account) => void;
  onDeleteClick: (account: Account) => void;
}

export default function AccountTable({
  accounts,
  isLoading,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onCopyUsername,
  onCopyPassword,
  onToggleStatus,
  onDeleteClick,
}: AccountTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Danh sách tài khoản
          </h2>
          
          {/* Search and Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm tài khoản..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-accounts"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as "all" | "on" | "off")}>
              <SelectTrigger className="w-48" data-testid="select-status-filter">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="on">Đang hoạt động</SelectItem>
                <SelectItem value="off">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tài khoản
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Mật khẩu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Không có tài khoản nào được tìm thấy
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.id} className="hover:bg-muted/50 transition-colors" data-testid={`row-account-${account.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                    {account.id.toString().padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs" data-testid={`text-username-${account.id}`}>
                        {account.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                        ••••••••
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        account.status ? 'status-on' : 'status-off'
                      }`}
                      data-testid={`status-${account.id}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current mr-1 mt-0.5"></div>
                      {account.status ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 h-7"
                        onClick={() => onCopyUsername(account.username)}
                        data-testid={`button-copy-username-${account.id}`}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 h-7"
                        onClick={() => onCopyPassword(account.password)}
                        data-testid={`button-copy-password-${account.id}`}
                      >
                        <Key className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className={`px-2 py-1 h-7 text-white ${
                          account.status 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                        onClick={() => onToggleStatus(account)}
                        data-testid={`button-toggle-status-${account.id}`}
                      >
                        {account.status ? <Check className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 h-7"
                        onClick={() => onDeleteClick(account)}
                        data-testid={`button-delete-${account.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị <span className="font-medium">1-{accounts.length}</span> của <span className="font-medium">{accounts.length}</span> tài khoản
          </div>
        </div>
      </div>
    </div>
  );
}
