import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { AddressSelectorModal } from "@/components/order/AddressSelectorModal";
import { AddressAnonymousModal } from "@/components/order/AddressAnonymousModal";
import { AddressRequest } from "@/lib/dtoRequest";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAddressModal, setShowAddressModal] = useState(false);

  /* --- nuevos estados para pasar al checkout --- */
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [anonymousData, setAnonymousData] = useState<{
    email: string;
    address: Pick<AddressRequest, "city" | "state" | "zipCode" | "country">;
  } | null>(null);

  const {
    items,
    baseImponible,
    igv,
    igv_rate,
    totalConIGV,
    updateQuantity,
    removeItem,
    clearCart,
    isLoading,
  } = useCart();

  const handleCheckout = () => setShowAddressModal(true);

  /* vacío */
  if (!items?.length) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto p-8 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">
            Agrega productos para comenzar tu compra
          </p>
          <Button asChild>
            <Link to="/products">Explorar Productos</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- items ---------- */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                {/* imagen */}
                <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-accent font-semibold mb-2">
                    ${item.unitPrice.toFixed(2)}
                  </p>

                  {/* controles */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={isLoading || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* subtotal */}
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={clearCart}
            disabled={isLoading}
            className="w-full text-destructive hover:text-destructive"
          >
            Vaciar Carrito
          </Button>
        </div>

        {/* ---------- resumen ---------- */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${baseImponible?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>IGV ({((igv_rate || 0) * 100) - 100}%)</span>
                <span>${igv?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span className="text-success">Gratis</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-accent">${totalConIGV?.toFixed(2)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceder al Pago
            </Button>

            <Button variant="outline" className="w-full mt-2" asChild>
              <Link to="/products">Continuar Comprando</Link>
            </Button>
          </Card>
        </div>
      </div>

      {/* ---------- modales ---------- */}
      {showAddressModal &&
        (isAuthenticated ? (
          <AddressSelectorModal
            onClose={() => setShowAddressModal(false)}
            onSelect={(addr) => {
              setSelectedAddressId(addr.id);
              setShowAddressModal(false);
              navigate("/checkout", {
                state: { addressId: addr.id },
              });
            }}
          />
        ) : (
          <AddressAnonymousModal
            onClose={() => setShowAddressModal(false)}
            onConfirm={(data) => {
              setAnonymousData(data);
              setShowAddressModal(false);
              navigate("/checkout", {
                state: { anonymous: data },
              });
            }}
          />
        ))}
    </div>
  );
};

export default Cart;
