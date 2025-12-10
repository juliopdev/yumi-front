import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchAdminApi } from "@/lib/fetch";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CategoryRequest } from "@/lib/dtoRequest";
import { Textarea } from "../ui/textarea";

interface CategoryManagementProps {
  categories: CategoryRequest[];
  onUpdate: () => void;
}

export const CategoryManagement = ({
  categories,
  onUpdate,
}: CategoryManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryRequest | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = (category?: CategoryRequest) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description ?? "");
    } else {
      setEditingCategory(null);
      setName("");
      setDescription("");
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre de la categoría es obligatorio");
      return;
    }

    setIsLoading(true);

    try {
      const response = editingCategory
        ? await fetchAdminApi.put.category(editingCategory.slug, {
            name: name.trim(),
            description: description.trim(),
          })
        : await fetchAdminApi.post.category({ name: name.trim(), description: description.trim() });
      if (response.data) {
        toast.success(
          editingCategory ? "Categoría actualizada" : "Categoría creada"
        );
        setIsOpen(false);
        onUpdate();
      } else {
        throw new Error(
          response.error?.message ?? "Error al guardar categoría"
        );
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán sin categoría."
      )
    )
      return;

    try {
      const response = await fetchAdminApi.delete.category(slug);
      if (response.data) {
        toast.success("Categoría eliminada");
        onUpdate();
      } else {
        toast.error(response.error?.message ?? "Error al eliminar categoría");
      }
    } catch {
      toast.error("Error al eliminar categoría");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ej: Electrónica"
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Descripción de la categoría"
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-2">
        {categories.map((category) => (
          <div
            key={category.slug}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                Slug: {category.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleOpenDialog(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(category.slug)}
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
