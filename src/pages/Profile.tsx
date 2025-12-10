import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchApi } from "@/lib/fetch";
import { toast } from "sonner";
import { UserEditResponse, ChangePasswordResponse } from "@/lib/dtoResponse";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: UserEditResponse = {
        newEmail: userData.email !== user?.email ? userData.email : undefined,
        newFullName:
          userData.fullName !== user?.fullName ? userData.fullName : undefined,
      };

      await fetchApi.put.profileUser(payload);
      await refreshUser();
      toast.success("Perfil actualizado");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Error al actualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const payload: ChangePasswordResponse = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };

      await fetchApi.put.changePassword(payload);
      toast.success("Contraseña actualizada");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Error al cambiar contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>

      <div className="space-y-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza tu información de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  value={userData.fullName}
                  onChange={(e) =>
                    setUserData({ ...userData, fullName: e.target.value })
                  }
                  disabled={!isEditing || isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  disabled={!isEditing || isLoading}
                  required
                />
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setUserData({
                          fullName: user?.fullName || "",
                          email: user?.email || "",
                        });
                      }}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Contraseña Actual</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar Nueva Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator />

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/orders")}
          >
            <CardHeader>
              <CardTitle className="text-lg">Mis Pedidos</CardTitle>
              <CardDescription>Ver historial de compras</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/addresses")}
          >
            <CardHeader>
              <CardTitle className="text-lg">Direcciones</CardTitle>
              <CardDescription>Gestionar direcciones de envío</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
