import { useState, useRef } from "react";
import { Upload, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImportSectionProps {
  onImport: (file: File) => void;
  isImporting: boolean;
  stats?: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default function ImportSection({ onImport, isImporting, stats }: ImportSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Upload className="mr-2 h-5 w-5 text-primary" />
          Import tài khoản
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Chọn file JavaScript
            </Label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".js"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/80
                  transition-colors cursor-pointer"
                data-testid="input-import-file"
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Format file:</strong><br />
            <code className="font-mono text-xs">
              [<br />
              &nbsp;&nbsp;{`{"username": "user1", "password": "pass1"},`}<br />
              &nbsp;&nbsp;{`{"username": "user2", "password": "pass2"}`}<br />
              ]
            </code>
          </div>
          
          <Button
            className="w-full"
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            data-testid="button-import-accounts"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isImporting ? 'Đang xử lý...' : 'Import tài khoản'}
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-md font-semibold text-card-foreground mb-3 flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Thống kê
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tổng tài khoản:</span>
              <span className="font-medium text-card-foreground" data-testid="text-total-accounts">
                {stats?.total || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Đang hoạt động:</span>
              <span className="font-medium text-green-600" data-testid="text-active-accounts">
                {stats?.active || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tạm dừng:</span>
              <span className="font-medium text-red-600" data-testid="text-inactive-accounts">
                {stats?.inactive || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
