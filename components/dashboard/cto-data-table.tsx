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
import { formatAreaColumn } from "@/lib/area-display";
import { formatDateTimePtBr } from "@/lib/format";
import { cn } from "@/lib/utils";

export type CadastroCtoRow = {
  id: string;
  nome_cto: string;
  area: string | null;
  primaria_codigo?: string | null;
  olt: string | null;
  slot: number | null;
  pon: number | null;
  capacidade: number;
  potencia_dbm: string | number | null;
  ultimo_cleanup: string | null;
  vagas_atuais: number;
};

const baseColumns: ColumnDef<CadastroCtoRow>[] = [
  {
    accessorKey: "nome_cto",
    header: "Nome da CTO",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.nome_cto}</span>
    ),
  },
  {
    id: "area_display",
    header: "Área",
    cell: ({ row }) => formatAreaColumn(row.original),
  },
  {
    accessorKey: "olt",
    header: "OLT",
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "slot",
    header: "Slot",
    cell: ({ getValue }) => {
      const v = getValue() as number | null;
      return v != null ? String(v) : "—";
    },
  },
  {
    accessorKey: "pon",
    header: "PON",
    cell: ({ getValue }) => {
      const v = getValue() as number | null;
      return v != null ? String(v) : "—";
    },
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
  header: () => <span className="text-muted-foreground">Atualizar</span>,
  cell: ({ row }) => (
    <Link
      href={`/dashboard/cto/${row.original.id}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "inline-flex gap-1.5 no-underline",
      )}
      aria-label={`Atualizar auditoria da CTO ${row.original.nome_cto}`}
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
    () =>
      showRowActions ? [...baseColumns, actionsColumn] : baseColumns,
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
