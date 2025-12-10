import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressResponse } from "@/lib/dtoResponse";

interface Props {
  onClose: () => void;
  onConfirm: (data: {
    email: string;
    address: Omit<AddressResponse, "id">;
  }) => void;
}

export const AddressAnonymousModal: React.FC<Props> = ({
  onClose,
  onConfirm,
}) => {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<Omit<AddressResponse, "id">>({
    city: "",
    state: "",
    zipCode: "",
    country: "Perú",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address.city || !address.state || !address.zipCode) return;
    onConfirm({ email, address });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Completa tu dirección de envío</DialogTitle>
            <DialogDescription>
              Necesitamos tu e-mail y la dirección donde enviaremos tu pedido
            </DialogDescription>
          </DialogHeader>

          {/* email */}
          <div>
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* dirección completa */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Ciudad</Label>
              <Input
                required
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Provincia / Estado</Label>
              <Input
                required
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label>Código Postal</Label>
            <Input
              required
              value={address.zipCode}
              onChange={(e) =>
                setAddress({ ...address, zipCode: e.target.value })
              }
            />
          </div>

          <div>
            <Label>País</Label>
            <Input
              required
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Continuar
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
