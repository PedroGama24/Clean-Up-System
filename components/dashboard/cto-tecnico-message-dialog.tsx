"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildTecnicoCleanUpMessage } from "@/lib/cto/format-tecnico-message";
import type { EditCtoFormValues } from "@/lib/validations/edit-cto";
import type { UseFormGetValues } from "react-hook-form";

type CtoTecnicoMessageDialogProps = {
  getValues: UseFormGetValues<EditCtoFormValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CtoTecnicoMessageDialog({
  getValues,
  open,
  onOpenChange,
}: CtoTecnicoMessageDialogProps) {
  const message = open ? buildTecnicoCleanUpMessage(getValues()) : "";

  async function handleCopy() {
    const text = buildTecnicoCleanUpMessage(getValues());
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Mensagem copiada!");
    } catch {
      toast.error(
        "Não foi possível copiar. Tente selecionar o texto manualmente.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,32rem)] gap-4 overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>Mensagem para o técnico</DialogTitle>
          <DialogDescription>
            Copie o texto abaixo e envie à operação de campo.
          </DialogDescription>
        </DialogHeader>
        <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 font-sans text-xs leading-relaxed">
          {message}
        </pre>
        <Button type="button" size="lg" className="w-full" onClick={handleCopy}>
          Copiar Texto
        </Button>
      </DialogContent>
    </Dialog>
  );
}
