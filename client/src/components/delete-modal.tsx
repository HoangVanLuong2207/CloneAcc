import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteModalProps {
  isOpen: boolean;
  accountName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteModal({ 
  isOpen, 
  accountName, 
  onConfirm, 
  onCancel, 
  isDeleting 
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md" data-testid="modal-delete-account">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="text-destructive mr-3 h-5 w-5" />
            Xác nhận xóa tài khoản
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa tài khoản "<span className="font-medium text-card-foreground">{accountName}</span>"? 
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isDeleting}
            data-testid="button-cancel-delete"
          >
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
            data-testid="button-confirm-delete"
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa tài khoản'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
