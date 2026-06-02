"use client";

import { LoaderCircle, Plus, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createTecnico, deleteTecnico } from "@/lib/tecnicos/actions";
import type { Tecnico } from "@/lib/tecnicos/queries";

type TecnicosManagerProps = {
  tecnicos: Tecnico[];
};

export function TecnicosManager({ tecnicos }: TecnicosManagerProps) {
  const router = useRouter();

  const [createOpen, setCreateOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [toDelete, setToDelete] = useState<Tecnico | null>(null);
  const [deleting, setDeleting] = useState(false);

  const nomesExistentes = useMemo(
    () => new Set(tecnicos.map((t) => t.nome.trim().toLowerCase())),
    [tecnicos],
  );

  function resetCreate() {
    setNome("");
    setCreateError(null);
    setCreating(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const nomeNormalizado = nome.trim();

    if (!nomeNormalizado) {
      setCreateError("Informe o nome do técnico.");
      return;
    }
    if (nomesExistentes.has(nomeNormalizado.toLowerCase())) {
      setCreateError("Já existe um técnico com esse nome.");
      return;
    }

    setCreating(true);
    setCreateError(null);
    try {
      const result = await createTecnico(nomeNormalizado);
      if ("error" in result) {
        setCreateError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Técnico cadastrado.");
      setCreateOpen(false);
      resetCreate();
      router.refresh();
    } catch {
      const msg = "Não foi possível cadastrar o técnico. Tente de novo.";
      setCreateError(msg);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const result = await deleteTecnico(toDelete.id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`Técnico ${toDelete.nome} excluído.`);
      setToDelete(null);
      router.refresh();
    } catch {
      toast.error("Não foi possível excluir o técnico. Tente de novo.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {tecnicos.length}{" "}
          {tecnicos.length === 1 ? "técnico cadastrado" : "técnicos cadastrados"}
        </p>
        <Button
          type="button"
          onClick={() => {
            resetCreate();
            setCreateOpen(true);
          }}
        >
          <Plus aria-hidden />
          Novo Técnico
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40">
        {tecnicos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <Users className="size-6 text-muted-foreground" aria-hidden />
            <p className="text-muted-foreground text-sm">
              Nenhum técnico cadastrado ainda. Clique em{" "}
              <span className="font-medium text-foreground">Novo Técnico</span>{" "}
              para adicionar o primeiro.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-20 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tecnicos.map((tecnico) => (
                <TableRow key={tecnico.id}>
                  <TableCell className="font-medium whitespace-normal">
                    {tecnico.nome}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => setToDelete(tecnico)}
                      aria-label={`Excluir técnico ${tecnico.nome}`}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) resetCreate();
        }}
      >
        <DialogContent showCloseButton>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Novo técnico</DialogTitle>
              <DialogDescription>
                Cadastre um técnico de campo. O nome ficará disponível nos
                formulários e filtros de CTO.
              </DialogDescription>
            </DialogHeader>

            <Field data-invalid={!!createError} className="py-4">
              <FieldLabel htmlFor="novo-tecnico-nome">Nome</FieldLabel>
              <Input
                id="novo-tecnico-nome"
                value={nome}
                autoComplete="off"
                autoFocus
                placeholder="Nome completo do técnico"
                aria-invalid={!!createError || undefined}
                disabled={creating}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (createError) setCreateError(null);
                }}
              />
              {createError ? (
                <FieldError errors={[{ message: createError }]} />
              ) : null}
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden />
                    Salvando…
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir técnico</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza? Esta ação não pode ser desfeita e excluirá o técnico{" "}
              {toDelete?.nome} da base.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <LoaderCircle className="animate-spin" aria-hidden />
                  Excluindo…
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
