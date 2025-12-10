import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { fetchApi } from "@/lib/fetch";
import { ProductRequest, CategoryRequest } from "@/lib/dtoRequest";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductRequest[]>([]);
  const [categories, setCategories] = useState<CategoryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchApi.get.products(undefined, undefined, undefined, undefined, undefined, 0, 12),
          fetchApi.get.categories(),
        ]);

        if (productsRes.data) {
          setFeaturedProducts(productsRes.data.content ?? []);
        }

        if (categoriesRes.data) {
          setCategories(categoriesRes.data.content ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-background/15 to-black/75" />
        </div>

        <div className="container relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text">
            Bienvenido a YUMI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Vendemos de todo y para todos. Envíos a nivel nacional.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="text-lg">
              <Link to="/products">
                Explorar Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon={<ShoppingBag />} title="Envío Rápido">
              Entrega en 24-48 horas en toda España
            </Feature>
            <Feature icon={<Shield />} title="Garantía Extendida">
              2 años de garantía en todos los productos
            </Feature>
            <Feature icon={<TrendingUp />} title="Mejores Precios">
              Garantía de precio más bajo del mercado
            </Feature>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Categorías Populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="p-6 rounded-lg border bg-card hover:shadow-md transition-all duration-300 text-center group"
                >
                  <h3 className="font-semibold group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Button variant="ghost" asChild>
              <Link to="/products">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/* ----------- Componentes auxiliares ----------- */

const Feature = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{children}</p>
  </div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

export default Index;
