"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TecnicoCampoComboboxProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Nomes disponíveis (origem dinâmica em `tecnicos.nome`). */
  tecnicos: string[];
  disabled?: boolean;
  invalid?: boolean;
};

export function TecnicoCampoCombobox({
  id,
  value,
  onChange,
  tecnicos,
  disabled,
  invalid,
}: TecnicoCampoComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Preserva valor histórico salvo numa CTO mesmo que o técnico tenha sido
  // removido da base — assim a edição não perde o nome original.
  const options = React.useMemo(() => {
    if (value && !tecnicos.includes(value)) {
      return [value, ...tecnicos];
    }
    return tecnicos;
  }, [tecnicos, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-full max-w-lg justify-between font-normal",
        )}
      >
        <span className="truncate text-left">
          {value ? value : "Selecione o técnico…"}
        </span>
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-w-lg p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar técnico…" />
          <CommandList>
            <CommandEmpty>Nenhum técnico encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((nome) => (
                <CommandItem
                  key={nome}
                  value={nome}
                  keywords={[nome]}
                  onSelect={() => {
                    onChange(nome);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4 shrink-0",
                      value === nome ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="break-words">{nome}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
