import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { fetchApi } from "@/lib/fetch";
import { AddressRequest } from "@/lib/dtoRequest";
import AddressForm from "./AddressForm";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onSelect: (addr: AddressRequest) => void;
}

export const AddressSelectorModal: React.FC<Props> = ({
  onClose,
  onSelect,
}) => {
  const [addresses, setAddresses] = useState<AddressRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchApi.get
      .address()
      .then((res) => setAddresses(res.data || []))
      .catch(() => toast.error("No se pudieron cargar tus direcciones"))
      .finally(() => setLoading(false));
  }, []);

  const afterSave = () => {
    setOpenForm(false);
    fetchApi.get
      .address()
      .then((res) => setAddresses(res.data || []))
      .catch(() => toast.error("Error al recargar direcciones"));
  };

  if (loading) return <p className="p-4">Cargando…</p>;

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecciona una dirección de envío</DialogTitle>
          <DialogDescription>
            Elige una dirección guardada o agrega una nueva
          </DialogDescription>
        </DialogHeader>

        {/* lista */}
        <div className="grid gap-3 max-h-[50vh] overflow-auto">
          {addresses.map((a) => (
            <Card key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {a.city}, {a.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  {a.zipCode} · {a.country}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  onSelect(a);
                  onClose();
                }}
              >
                Usar esta
              </Button>
            </Card>
          ))}
        </div>

        {/* agregar */}
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Nueva dirección
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddressForm
              onCancel={() => setOpenForm(false)}
              onSaved={afterSave}
            />
          </DialogContent>
        </Dialog>

        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
};
