import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchApi } from "@/lib/fetch";
import { AddressRequest } from "@/lib/dtoRequest";
import { toast } from "sonner";

/* ---------- helpers ---------- */
const emptyForm = () => ({
  city: "",
  state: "",
  zipCode: "",
  country: "Perú",
});

/* ---------- componente ---------- */
const Addresses = () => {
  const [addresses, setAddresses] = useState<AddressRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AddressRequest | null>(null);
  const [form, setForm] = useState(emptyForm());

  /* carga inicial */
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetchApi.get.address();
      setAddresses(res.data || []);
    } catch {
      toast.error("No se pudieron cargar las direcciones");
    }
  };

  /* guardar / actualizar */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await fetchApi.put.address({ ...form, id: editing.id });
        toast.success("Dirección actualizada");
      } else {
        await fetchApi.post.address(form);
        toast.success("Dirección agregada");
      }
      setOpen(false);
      reset();
      fetchAddresses();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  /* eliminar */
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;
    try {
      await fetchApi.delete.address(id);
      toast.success("Dirección eliminada");
      fetchAddresses();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  /* edición */
  const startEdit = (addr: AddressRequest) => {
    setEditing(addr);
    setForm({
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
    });
    setOpen(true);
  };

  /* reset de formulario */
  const reset = () => {
    setEditing(null);
    setForm(emptyForm());
  };

  /* ui vacía */
  if (addresses.length === 0)
    return (
      <div className="container py-12">
        <Card className="max-w-xl mx-auto p-10 text-center">
          <p className="text-muted-foreground mb-4">
            No tienes direcciones guardadas
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar dirección
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form
                form={form}
                setForm={setForm}
                editing={!!editing}
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    );

  /* ui con direcciones */
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mis Direcciones</h1>
        <Dialog open={open} onOpenChange={(v) => (v ? setOpen(v) : reset())}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva dirección
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form
              form={form}
              setForm={setForm}
              editing={!!editing}
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">
                  {a.city}, {a.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  {a.zipCode} · {a.country}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => startEdit(a)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(a.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ---------- sub-componente formulario ---------- */
function Form({
  form,
  setForm,
  editing,
  loading,
  onSubmit,
  onCancel,
}: {
  form: ReturnType<typeof emptyForm>;
  setForm: (v: ReturnType<typeof emptyForm>) => void;
  editing: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {editing ? "Editar dirección" : "Nueva dirección"}
        </DialogTitle>
        <DialogDescription>
          {editing ? "Actualiza" : "Completa"} la información de envío
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Ciudad</Label>
          <Input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Provincia / Estado</Label>
          <Input
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label>Código Postal</Label>
        <Input
          value={form.zipCode}
          onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>País</Label>
        <Input
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Guardando…" : "Guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default Addresses;
