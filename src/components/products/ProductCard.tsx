import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ProductRequest } from "@/lib/dtoRequest";
import { useEffect } from "react";

interface ProductCardProps {
  product: ProductRequest;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(product.sku, 1);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-product">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              <Eye className="h-12 w-12" />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-base">
                Agotado
              </Badge>
            </div>
          )}
          {!isOutOfStock && product.stock < 10 && (
            <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground">
              ¡Últimas {product.stock} unidades!
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.category.name && (
          <Badge variant="secondary" className="mb-2">
            {product.category.name}
          </Badge>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-accent">
            ${product.price.toFixed(2)}
          </span>

          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={isLoading || isOutOfStock}
            className="transition-transform hover:scale-110"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
