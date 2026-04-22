"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

function cycleUltimoCleanupSort(
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (desc: boolean, isMulti?: boolean) => void;
  },
) {
  const s = column.getIsSorted();
  if (s === "desc") {
    column.toggleSorting(false, false);
  } else {
    column.toggleSorting(true, false);
  }
}

const buildBaseColumns = (): ColumnDef<CadastroCtoRow>[] => [
  {
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ getValue }) => (getValue() as string) ?? "—",
  },
  {
    accessorKey: "identificacao_cto",
    header: "Identificação CTO",
    cell: ({ row }) => (
      <span className="block min-w-[12rem] max-w-[16rem] break-words font-medium sm:min-w-[14rem] sm:max-w-[22rem] lg:max-w-[28rem] xl:max-w-[36rem]">
        {row.original.identificacao_cto}
      </span>
    ),
  },
  {
    accessorKey: "tecnico_campo",
    header: "Técnico",
    cell: ({ getValue }) => {
      const v = getValue() as string;
      return v ? (
        <span className="block min-w-[10rem] max-w-[14rem] break-words sm:max-w-[18rem] lg:max-w-[22rem]">
          {v}
        </span>
      ) : (
        "—"
      );
    },
  },
  {
    accessorKey: "bko_nome",
    header: "BKO",
    cell: ({ getValue }) => {
      const v = (getValue() as string | null) ?? "";
      return v ? (
        <span className="block min-w-[6rem] max-w-[12rem] break-words sm:max-w-[14rem]">
          {v}
        </span>
      ) : (
        "—"
      );
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
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string | null | undefined;
      const b = rowB.getValue(columnId) as string | null | undefined;
      const an = a == null || a === "";
      const bn = b == null || b === "";
      if (an && bn) return 0;
      if (an) return 1;
      if (bn) return -1;
      if (a! < b!) return -1;
      if (a! > b!) return 1;
      return 0;
    },
    header: ({ column }) => {
      const sortState = column.getIsSorted();
      return (
        <button
          type="button"
          className="hover:text-foreground -m-1 flex max-w-full items-center gap-1.5 rounded-md py-0.5 pr-1.5 pl-0 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:bg-muted/50"
          onClick={() => cycleUltimoCleanupSort(column)}
        >
          <span className="min-w-0 flex-1 whitespace-normal leading-tight break-words normal-case sm:text-inherit">
            Último clean up
          </span>
          {sortState === "desc" ? (
            <ArrowDown className="size-3.5 shrink-0" aria-hidden />
          ) : sortState === "asc" ? (
            <ArrowUp className="size-3.5 shrink-0" aria-hidden />
          ) : (
            <ArrowUpDown
              className="text-muted-foreground/80 size-3.5 shrink-0"
              aria-hidden
            />
          )}
        </button>
      );
    },
    cell: ({ getValue }) => (
      <span className="inline-block min-w-[10.5rem] whitespace-nowrap tabular-nums sm:min-w-[12.5rem]">
        {formatDateTimePtBr(getValue() as string | null | undefined)}
      </span>
    ),
  },
];

const actionsColumn: ColumnDef<CadastroCtoRow> = {
  id: "actions",
  header: () => (
    <span className="text-muted-foreground whitespace-nowrap">Ações</span>
  ),
  cell: ({ row }) => (
    <Link
      href={`/dashboard/cto/${row.original.id}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "inline-flex shrink-0 gap-1.5 whitespace-nowrap no-underline shadow-sm",
      )}
      aria-label={`Atualizar auditoria da CTO ${row.original.identificacao_cto}`}
    >
      <RefreshCw className="size-3.5 shrink-0" aria-hidden />
      <span className="hidden sm:inline">Atualizar</span>
    </Link>
  ),
  enableSorting: false,
};

type CtoDataTableProps = {
  data: CadastroCtoRow[];
  showRowActions?: boolean;
  sortResetKey?: number;
};

const stickyActionsColumnClass =
  "[&_thead_th:last-child]:sticky [&_thead_th:last-child]:right-0 [&_thead_th:last-child]:z-20 [&_thead_th:last-child]:border-border/70 [&_thead_th:last-child]:border-l [&_thead_th:last-child]:bg-muted [&_thead_th:last-child]:shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] dark:[&_thead_th:last-child]:shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.35)] [&_tbody_td:last-child]:sticky [&_tbody_td:last-child]:right-0 [&_tbody_td:last-child]:z-10 [&_tbody_td:last-child]:border-border/70 [&_tbody_td:last-child]:border-l [&_tbody_td:last-child]:bg-card [&_tbody_td:last-child]:shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)] dark:[&_tbody_td:last-child]:bg-card dark:[&_tbody_td:last-child]:shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.35)] [&_tbody_tr:hover_td:last-child]:bg-muted/60";

export function CtoDataTable({
  data,
  showRowActions,
  sortResetKey = 0,
}: CtoDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setSorting([]);
  }, [sortResetKey]);

  const columns = useMemo(
    () => (showRowActions ? [...buildBaseColumns(), actionsColumn] : buildBaseColumns()),
    [showRowActions],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
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
    <Table
      className={cn(showRowActions ? stickyActionsColumnClass : undefined)}
    >
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  (header.column.id === "identificacao_cto" ||
                    header.column.id === "tecnico_campo" ||
                    header.column.id === "bko_nome") &&
                    "whitespace-normal",
                )}
              >
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
              <TableCell
                key={cell.id}
                className={cn(
                  (cell.column.id === "identificacao_cto" ||
                    cell.column.id === "tecnico_campo" ||
                    cell.column.id === "bko_nome") &&
                    "whitespace-normal",
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
