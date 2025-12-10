import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductRequest, CategoryRequest } from "@/lib/dtoRequest";
import { fetchAdminApi } from "@/lib/fetch";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { generateSku } from "@/lib/utils";
import { EditProductResponse } from "@/lib/dtoResponse";
import { parse } from "path";

interface ProductManagementProps {
  products: ProductRequest[];
  categories: CategoryRequest[];
  onUpdate: () => void;
}

export const ProductManagement = ({
  products,
  categories,
  onUpdate,
}: ProductManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRequest | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<EditProductResponse>({
    sku: generateSku(),
    name: "",
    description: "",
    price: 0,
    stock: 0,
    features: [],
    categoryId: 0,
  });

  const [imageFile, setImageFile] = useState<Blob | null>(null);

  const resetForm = () => {
    setFormData({
      sku: generateSku(),
      name: "",
      description: "",
      price: 0,
      stock: 0,
      features: [],
      categoryId: 0,
    });
    setImageFile(null);
    setEditingProduct(null);
  };

  const handleOpenDialog = (product?: ProductRequest) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description ?? "",
        price: product.price,
        stock: product.stock,
        features: product.features,
        categoryId: product.category.id,
      });
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      formData.price > 0 &&
      formData.stock > 0 &&
      formData.categoryId > 0
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      const featuresArray = formData.features.filter((f) => f.name && f.value);


      const price = formData.price;
      const stock = formData.stock;
      const categoryId = formData.categoryId;

      if (isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
        toast.error("Precio, stock o categoría inválidos");
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append("sku", formData.sku.trim());
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("price", price.toString());
      formDataToSend.append("stock", stock.toString());
      formDataToSend.append("categoryId", categoryId.toString());

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      featuresArray.forEach((f, index) => {
        formDataToSend.append(`features[${index}].name`, f.name);
        formDataToSend.append(`features[${index}].value`, f.value);
      });

      const response = editingProduct
        ? await fetchAdminApi.put.product(editingProduct.id, formDataToSend)
        : await fetchAdminApi.post.product(formDataToSend);
        console.log("response: ", response);
        

      if (response.success) {
        toast.success(
          editingProduct ? "Producto actualizado" : "Producto creado"
        );
        setIsOpen(false);
        onUpdate();
      } else {
        toast.error(response.error?.message ?? "Error al guardar");
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      toast.error("Error de red");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const res = await fetchAdminApi.delete.product(id);
      if (res.data) {
        toast.success("Producto eliminado");
        onUpdate();
      } else {
        toast.error(res.error?.message ?? "Error al eliminar");
      }
    } catch {
      toast.error("Error de red");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Modifica los detalles del producto existente"
                  : "Completa los detalles del nuevo producto"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={formData.sku} disabled required />
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value, 10) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: +value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Características (clave:valor)</Label>
                {formData.features.map((f, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Clave"
                      value={f.name}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[index].name = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                    />
                    <Input
                      placeholder="Valor"
                      value={f.value}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[index].value = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updated = formData.features.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, features: updated });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      features: [...formData.features, { name: "", value: "" }],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar característica
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Imagen</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || !isFormValid}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!products.length && (
        <p className="text-muted-foreground">No hay productos disponibles</p>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category.name}
                </p>
                <p className="text-sm">
                  ${product.price.toFixed(2)} - Stock: {product.stock}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleOpenDialog(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
