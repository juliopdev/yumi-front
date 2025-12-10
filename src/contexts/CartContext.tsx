import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "@/lib/fetch";
import { CartItemRequest, CartRequest } from "@/lib/dtoRequest";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItemRequest[] | null;
  baseImponible: number;
  igv: number;
  igv_rate: number;
  totalConIGV: number;
  isLoading: boolean;
  addToCart: (productSku: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [myCart, setMyCart] = useState<CartRequest>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = async () => {
    try {
      const res = await fetchApi.get.myCart();
      if (res.data) setMyCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productSku: string, quantity: number) => {
    await fetchApi.post.addItemToCart({ productSku, quantity });
    await refreshCart();
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setIsLoading(true);
    try {
      await fetchApi.patch.updateItemQuantity(itemId, quantity);
      await refreshCart();
    } catch (error) {
      toast.error(error.message || "Error al actualizar cantidad");
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    setIsLoading(true);
    try {
      await fetchApi.delete.removeItemToCart(itemId);
      await refreshCart();
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      toast.error(error.message || "Error al eliminar producto");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await fetchApi.delete.clearCart();
      setMyCart(null);
      await refreshCart();
      toast.success("Carrito vaciado");
    } catch (error) {
      toast.error(error.message || "Error al vaciar carrito");
    } finally {
      setIsLoading(false);
    }
  };

  const items = myCart?.items;
  const baseImponible = myCart?.baseImponible;
  const igv = myCart?.igv;
  const igv_rate = myCart?.igv_rate;
  const totalConIGV = myCart?.totalConIGV;

  return (
    <CartContext.Provider
      value={{
        items,
        baseImponible,
        igv,
        igv_rate,
        totalConIGV,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
