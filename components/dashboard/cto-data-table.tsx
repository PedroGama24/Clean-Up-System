"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTimePtBr } from "@/lib/format";
import { cn } from "@/lib/utils";

export type CadastroCtoRow = {
  id: string;
  cidade: string;
  identificacao_cto: string;
  tecnico_campo: string;
  bko_nome: string | null;
  capacidade: number;
  ultimo_cleanup: string | null;
  vagas_atuais: number;
};

const baseColumns: ColumnDef<CadastroCtoRow>[] = [
  {
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ getValue }) => (getValue() as string) ?? "—",
  },
  {
    accessorKey: "identificacao_cto",
    header: "Identificação CTO",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.identificacao_cto}</span>
    ),
  },
  {
    accessorKey: "tecnico_campo",
    header: "Técnico",
    cell: ({ getValue }) => {
      const v = getValue() as string;
      return v ? <span className="max-w-[14rem] truncate">{v}</span> : "—";
    },
  },
  {
    accessorKey: "bko_nome",
    header: "BKO",
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "capacidade",
    header: "Capacidade",
    cell: ({ getValue }) => `${getValue()} portas`,
  },
  {
    accessorKey: "vagas_atuais",
    header: "Vagas atuais",
  },
  {
    accessorKey: "ultimo_cleanup",
    header: "Último clean up",
    cell: ({ getValue }) =>
      formatDateTimePtBr(getValue() as string | null | undefined),
  },
];

const actionsColumn: ColumnDef<CadastroCtoRow> = {
  id: "actions",
  header: () => <span className="text-muted-foreground">Ações</span>,
  cell: ({ row }) => (
    <Link
      href={`/dashboard/cto/${row.original.id}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "inline-flex gap-1.5 no-underline",
      )}
      aria-label={`Atualizar auditoria da CTO ${row.original.identificacao_cto}`}
    >
      <RefreshCw className="size-3.5 shrink-0" aria-hidden />
      Atualizar
    </Link>
  ),
  enableSorting: false,
};

type CtoDataTableProps = {
  data: CadastroCtoRow[];
  /** Exibe link para `/dashboard/cto/[id]` em cada linha. */
  showRowActions?: boolean;
};

export function CtoDataTable({ data, showRowActions }: CtoDataTableProps) {
  const columns = useMemo(
    () => (showRowActions ? [...baseColumns, actionsColumn] : baseColumns),
    [showRowActions],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card/40 px-6 py-14 text-center">
        <p className="text-muted-foreground text-sm">
          Nenhuma CTO cadastrada ainda.
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          Inicie um novo clean up para registrar a primeira caixa.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
