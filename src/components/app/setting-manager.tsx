"use client";

import { useState } from "react";

import type { SettingGroup } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingManager({
  setting,
  initialData,
}: {
  setting: string;
  initialData: SettingGroup;
}) {
  const [items, setItems] = useState(initialData.rows);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/settings/${setting}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: value }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Impossible d'ajouter cette valeur.");
      return;
    }

    setItems((current) => [payload, ...current]);
    setValue("");
    setMessage("Référentiel mis à jour.");
  }

  async function handleDeactivate(id: string) {
    setRemovingId(id);
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/settings/${setting}/${id}`, {
      method: "DELETE",
    });

    const payload = await response.json();
    setRemovingId(null);

    if (!response.ok) {
      setError(payload.error ?? "Impossible de désactiver cette valeur.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    setMessage("Valeur désactivée.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData.title}</CardTitle>
        <CardDescription>{initialData.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-2">
            <Label>Nouvelle valeur</Label>
            <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ajouter une valeur" />
          </div>
          <Button disabled={loading || !value.trim()}>{loading ? "Ajout..." : "Ajouter"}</Button>
        </form>
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--muted)]/70 px-4 py-3 text-sm text-[var(--muted-foreground)]"
            >
              <span>{item.label}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleDeactivate(item.id)}
                disabled={removingId === item.id}
              >
                {removingId === item.id ? "..." : "Désactiver"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
