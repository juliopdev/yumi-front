import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/fetch";
import { AddressRequest } from "@/lib/dtoRequest";
import { AddressResponse, CreateOrderResponse } from "@/lib/dtoResponse";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AddressSelectorModal } from "@/components/order/AddressSelectorModal";
import { AddressAnonymousModal } from "@/components/order/AddressAnonymousModal";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { items, baseImponible, igv, igv_rate, totalConIGV, clearCart } =
    useCart();

  const [addresses, setAddresses] = useState<AddressRequest[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressRequest | null>(
    null
  );
  const [anonymousData, setAnonymousData] = useState<{
    email: string;
    address: AddressResponse;
  } | null>(null);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchApi.get
      .address()
      .then((res) => setAddresses(res.data || []))
      .catch(() => toast.error("No se pudieron cargar tus direcciones"));
  }, [isAuthenticated]);

  // Si viene del carrito con dirección seleccionada o anónima
  useEffect(() => {
    if (location.state?.addressId && isAuthenticated) {
      const addr = addresses.find((a) => a.id === location.state.addressId);
      if (addr) setSelectedAddress(addr);
    } else if (location.state?.anonymous && !isAuthenticated) {
      setAnonymousData(location.state.anonymous);
    }
  }, [location.state, addresses, isAuthenticated]);

  const handlePlaceOrder = async () => {
    if (isAuthenticated && !selectedAddress) {
      toast.error("Selecciona una dirección de envío");
      return;
    }
    if (!isAuthenticated && !anonymousData) {
      toast.error("Completa tu dirección y email");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreateOrderResponse = {
        customerEmail: isAuthenticated ? user.email : anonymousData!.email,
        isAnonymous: !isAuthenticated,
        addressDetail: isAuthenticated
          ? {
              city: selectedAddress!.city,
              state: selectedAddress!.state,
              zipCode: selectedAddress!.zipCode,
              country: selectedAddress!.country,
            }
          : {
              city: anonymousData!.address.city,
              state: anonymousData!.address.state,
              zipCode: anonymousData!.address.zipCode,
              country: anonymousData!.address.country,
            },
        items: items.map((i) => ({
          productSku: i.productSku,
          quantity: i.quantity,
        })),
      };

      try {
        const newOrder = await fetchApi.post.order(payload);
        await clearCart();
        toast.success("¡Pedido realizado con éxito!");
        navigate("/orders");
      } catch (error) {
        toast.error(error.message || "No se pudo crear el pedido");
      }
    } catch (error) {
      toast.error(error.message || "Error al crear el pedido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!items?.length) {
      navigate("/cart");
    }
  }, [items, navigate]);

  if (!items?.length) return null;

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Dirección de envío */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Dirección de Envío</h2>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Dirección
                </Button>
              )}
            </div>

            {isAuthenticated ? (
              selectedAddress ? (
                <div className="border rounded-lg p-4">
                  <p className="font-medium">
                    {selectedAddress.city}, {selectedAddress.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAddress.zipCode} · {selectedAddress.country}
                  </p>
                  <Button
                    variant="link"
                    className="px-0"
                    onClick={() => setShowAddressModal(true)}
                  >
                    Cambiar dirección
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No has seleccionado una dirección
                  </p>
                  <Button onClick={() => setShowAddressModal(true)}>
                    Seleccionar dirección
                  </Button>
                </div>
              )
            ) : anonymousData ? (
              <div className="border rounded-lg p-4">
                <p className="font-medium">
                  {anonymousData.address.city}, {anonymousData.address.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  {anonymousData.address.zipCode} ·{" "}
                  {anonymousData.address.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {anonymousData.email}
                </p>
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setShowAddressModal(true)}
                >
                  Cambiar dirección
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ingresa tu dirección de envío
                </p>
                <Button onClick={() => setShowAddressModal(true)}>
                  Ingresar dirección
                </Button>
              </div>
            )}
          </Card>

          {/* Productos */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Productos ({items?.length})
            </h2>
            <div className="space-y-4">
              {items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded bg-muted" />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${baseImponible.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>IGV ({(igv_rate * 100).toFixed(0)}%)</span>
                <span>${igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span className="text-success">Gratis</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-accent">${totalConIGV.toFixed(2)}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Realizar Pedido"}
            </Button>
          </Card>
        </div>
      </div>

      {/* Modales */}
      {showAddressModal &&
        (isAuthenticated ? (
          <AddressSelectorModal
            onClose={() => setShowAddressModal(false)}
            onSelect={(addr) => {
              setSelectedAddress(addr);
              setShowAddressModal(false);
            }}
          />
        ) : (
          <AddressAnonymousModal
            onClose={() => setShowAddressModal(false)}
            onConfirm={({ email, address }) => {
              const { city, state, zipCode, country } = address;
              setAnonymousData({
                email,
                address: { city, state, zipCode, country },
              });
              setShowAddressModal(false);
            }}
          />
        ))}
    </div>
  );
};

export default Checkout;
