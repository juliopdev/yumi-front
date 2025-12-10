import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Package, Eye, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/fetch";
import { OrderRequest } from "@/lib/dtoRequest";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const { sku } = useParams<{ sku: string }>();
  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const isDetail = !!sku;

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (isDetail) {
          const res = await fetchApi.get.myOrder(sku!);
          setOrder(res.data);
        } else {
          const res = await fetchApi.get.myOrders();
          if (res.data) {
            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
          }
        }
      } catch {
        toast.error("No se pudieron cargar los pedidos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, sku, page]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "pendiente":
        return "bg-warning text-warning-foreground";
      case "shipped":
      case "enviado":
        return "bg-accent text-accent-foreground";
      case "delivered":
      case "entregado":
        return "bg-success text-success-foreground";
      case "cancelled":
      case "cancelado":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto p-8 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">
            Inicia sesión para ver tus pedidos
          </h2>
          <p className="text-muted-foreground mb-6">
            Los pedidos de usuarios anónimos no se guardan en tu cuenta.
          </p>
          <Button asChild>
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (isDetail) {
    if (!order) {
      return (
        <div className="container py-12">
          <Card className="max-w-lg mx-auto p-8 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Pedido no encontrado</h2>
            <Button asChild>
              <Link to="/orders" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a mis pedidos
              </Link>
            </Button>
          </Card>
        </div>
      );
    }

    return (
      <div className="container py-8">
        <Button variant="link" asChild>
          <Link to="/orders" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a mis pedidos
          </Link>
        </Button>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Pedido #{order.orderSku}</h1>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {new Date(order.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Productos</h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.productName} (x{item.quantity})
                  </span>
                  <span className="font-semibold">${item.unitPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-4 text-right">
            <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto p-8 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No tienes pedidos</h2>
          <p className="text-muted-foreground mb-6">
            Realiza tu primera compra para ver tus pedidos aquí
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
      <h1 className="text-4xl font-bold mb-8">Mis Pedidos</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">
                    Pedido #{order.orderSku}
                  </h3>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-accent">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link to={`/orders/${order.orderSku}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalle
                  </Link>
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                {order.items.length} producto
                {order.items.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-sm">
                    {item.productName} (x{item.quantity})
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-muted-foreground">
                    y {order.items.length - 3} más...
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {page + 1} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;