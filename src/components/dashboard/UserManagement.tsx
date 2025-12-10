import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRequest } from "@/lib/dtoRequest";
import { fetchAdminApi } from "@/lib/fetch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/dtoHelper";

interface UserManagementProps {
  users: UserRequest[];
  onUpdate: () => void;
}

const roleList: UserRole[] = [
  UserRole.INVENTORYMANAGER,
  UserRole.SHIPPINGMANAGER,
  UserRole.CUSTOMER,
];

export const UserManagement = ({ users, onUpdate }: UserManagementProps) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    setLoadingId(userId);
    try {
      const res = await fetchAdminApi.put.changeRole(userId, { role: newRole });
      if (res.data) {
        toast.success("Rol actualizado");
        onUpdate();
      } else {
        toast.error(res.error?.message ?? "Error al cambiar rol");
      }
    } catch {
      toast.error("Error de red");
    } finally {
      setLoadingId(null);
    }
  };

  if (!users.length)
    return <p className="text-muted-foreground">No hay usuarios disponibles</p>;

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex-1">
            <h3 className="font-semibold">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={user.role}
              onValueChange={(value) =>
                handleRoleChange(user.id, value as UserRole)
              }
              disabled={loadingId === user.id || user.role === UserRole.ADMIN}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {user.role === UserRole.ADMIN && (
                  <SelectItem key={user.id} value={user.role}>
                    <Badge variant="outline">{user.role}</Badge>
                  </SelectItem>
                )}
                {roleList.map((role) => (
                  <SelectItem key={role} value={role}>
                    <Badge variant="outline">{role}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
};
