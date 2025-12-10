import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AddressResponse } from "@/lib/dtoResponse";
import { fetchApi } from "@/lib/fetch";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  onCancel: () => void;
  onSaved: () => void;
  initial?: AddressResponse;
}

export const AddressForm: React.FC<Props> = ({
  onCancel,
  onSaved,
  initial,
}) => {
  const [form, setForm] = useState<Omit<AddressResponse, "id">>({
    city: initial?.city || "",
    state: initial?.state || "",
    zipCode: initial?.zipCode || "",
    country: initial?.country || "Perú",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initial?.id) {
        await fetchApi.put.address({ ...form, id: initial.id });
        toast.success("Dirección actualizada");
      } else {
        await fetchApi.post.address(form);
        toast.success("Dirección guardada");
      }
      onSaved();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {initial ? "Editar dirección" : "Nueva dirección"}
        </DialogTitle>
        <DialogDescription>
          {initial ? "Actualiza" : "Completa"} la información de envío
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Ciudad</Label>
          <Input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div>
          <Label>Provincia / Estado</Label>
          <Input
            required
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Código Postal</Label>
        <Input
          required
          value={form.zipCode}
          onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
        />
      </div>

      <div>
        <Label>País</Label>
        <Input
          required
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
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
};

export default AddressForm;
