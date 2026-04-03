import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FilterOption = {
  label: string;
  value: string;
};

export function TableFilters({
  q,
  qPlaceholder = "Rechercher...",
  status,
  statusOptions,
  action,
  actionOptions,
}: {
  q?: string;
  qPlaceholder?: string;
  status?: string;
  statusOptions?: FilterOption[];
  action?: string;
  actionOptions?: FilterOption[];
}) {
  return (
    <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
      <Input name="q" defaultValue={q} placeholder={qPlaceholder} />
      {statusOptions ? (
        <select
          name="status"
          defaultValue={status ?? ""}
          className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <option value="">Tous les statuts</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input type="hidden" name="status" value="" />
      )}
      {actionOptions ? (
        <select
          name="action"
          defaultValue={action ?? ""}
          className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <option value="">Toutes les actions</option>
          {actionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input type="hidden" name="action" value="" />
      )}
      <div className="flex gap-2">
        <Button type="submit">Filtrer</Button>
        <Button type="submit" formAction="?" variant="outline">
          Reinitialiser
        </Button>
      </div>
    </form>
  );
}
