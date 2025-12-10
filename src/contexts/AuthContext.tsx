import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "@/lib/fetch";
import { UserRequest } from "@/lib/dtoRequest";
import { toast } from "sonner";
import { tokenManager } from "@/lib/tokenManager";
import { UserRole } from "@/lib/dtoHelper";

interface AuthContextType {
  user: UserRequest | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInventoryManager: boolean;
  isShippingManager: boolean;
  login: (
    email: string,
    password: string,
    prevItemCount: number
  ) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetchApi.get.myProfile();
        if (res.data) {
          setUser(res.data);
          tokenManager.setUser(res.data);
        } else tokenManager.clearTokens();
      } catch {
        tokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    prevItemCount: number
  ) => {
    try {
      const res = await fetchApi.post.login({ email, password });
      if (!res.success) {
        toast.error(res.error.message);
        throw new Error(res.error.message);
      }
      tokenManager.setTokens(res.data.token);
      setUser(res.data.user);
      tokenManager.setUser(res.data.user);

      if (prevItemCount > 0) {
        try {
          await fetchApi.post.mergeCart([]);
        } catch {
          // miss error
        }

        toast.success("¡Bienvenido de nuevo!");
      }
    } catch (error) {
      toast.error(error.message || "Error desconocido");
      throw error;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetchApi.post.register({ fullName, email, password });
      if (!res.success) toast.error(res.error.message);
      else {
        tokenManager.setTokens(res.data.token);
        setUser(res.data.user);
        tokenManager.setUser(res.data.user);

        toast.success("¡Cuenta creada exitosamente!");
      }
    } catch (error) {
      toast.error(error.message || "Error desconocido");
      throw error;
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
    toast.success("Sesión cerrada");
  };

  const refreshUser = async () => {
    try {
      const res = await fetchApi.get.myProfile();
      if (res.data) {
        setUser(res.data);
        tokenManager.setUser(res.data);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const isAdmin = user?.role == UserRole.ADMIN;
  const isInventoryManager = user?.role == UserRole.INVENTORYMANAGER;
  const isShippingManager = user?.role == UserRole.SHIPPINGMANAGER;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        isInventoryManager,
        isShippingManager,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
