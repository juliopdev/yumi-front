import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Minus, Plus, ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductRequest } from "@/lib/dtoRequest";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetch";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCart();

  const [product, setProduct] = useState<ProductRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      toast.error("ID de producto inválido");
      navigate("/products");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetchApi.get.product(Number(id));
        if (res.data) {
          setProduct(res.data);
        } else {
          toast.error(res.error?.message || "Producto no encontrado");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error al cargar producto:", error);
        toast.error("Error al cargar el producto");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product.sku, quantity);
      toast.success(`${quantity} × ${product.name} agregado al carrito`);
    } catch (error) {
      toast.error("No se pudo agregar al carrito");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Package className="h-24 w-24" />
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
            )}
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-accent">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Características</h3>
                <ul className="space-y-1 text-muted-foreground">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        {feature.name}: {feature.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator />

          {/* Stock */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive">Agotado</Badge>
            ) : product.stock < 10 ? (
              <Badge className="bg-warning text-warning-foreground">
                ¡Solo quedan {product.stock} unidades!
              </Badge>
            ) : (
              <Badge className="bg-success text-success-foreground">
                En Stock ({product.stock} disponibles)
              </Badge>
            )}
          </div>

          {/* Cantidad y agregar al carrito */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Cantidad:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={cartLoading || isOutOfStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? "Producto Agotado" : "Agregar al Carrito"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
