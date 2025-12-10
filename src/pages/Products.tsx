import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { fetchApi } from "@/lib/fetch";
import { ProductRequest, CategoryRequest } from "@/lib/dtoRequest";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SlidersHorizontal } from "lucide-react";
import { usePaginatedData } from "@/hooks/use-paginatedData";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<CategoryRequest[]>([]);

  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "all",
    minPrice: +searchParams.get("minPrice") || 0,
    maxPrice: +searchParams.get("maxPrice") || 0,
    inStock: searchParams.get("inStock") === "true",
  });

  const {
    data: products,
    page,
    totalPages,
    setPage,
    reload,
  } = usePaginatedData<ProductRequest>((p, s) =>
    fetchApi.get
      .products(
        filters.category === "all" ? undefined : filters.category,
        undefined,
        filters.query || undefined,
        filters.minPrice || undefined,
        filters.maxPrice || undefined,
        p,
        s
      )
      .then((res) => res.data!)
  );

  useEffect(() => {
    fetchApi.get
      .categories()
      .then((res) => {
        if (res.data) setCategories(res.data.content);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const newQuery = searchParams.get("q") || "";
    const newCategory = searchParams.get("category") || "all";
    const newMin = Number(searchParams.get("minPrice") || 0);
    const newMax = Number(searchParams.get("maxPrice") || 0);
    const newInStock = searchParams.get("inStock") === "true";

    setFilters({
      query: newQuery,
      category: newCategory,
      minPrice: newMin,
      maxPrice: newMax,
      inStock: newInStock,
    });
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    reload();
  }, [filters]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams);
    if (value && (key !== "category" || value !== "all")) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Productos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filtros</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    className="pl-10"
                    value={filters.query}
                    onChange={(e) =>
                      handleFilterChange("query", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rango de Precio</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) =>
                    handleFilterChange("inStock", Boolean(checked))
                  }
                />
                <Label htmlFor="inStock" className="cursor-pointer">
                  Solo en stock
                </Label>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron productos
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Anterior
                </Button>

                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Página {page + 1} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
