"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StatusOption = {
  label: string;
  value: string;
};

export function StatusActionForm({
  endpoint,
  label,
  initialStatus,
  options,
  payload,
  submitLabel = "Mettre a jour",
  noteLabel,
  notePlaceholder,
}: {
  endpoint: string;
  label: string;
  initialStatus: string;
  options?: StatusOption[];
  payload?: Record<string, string | boolean>;
  submitLabel?: string;
  noteLabel?: string;
  notePlaceholder?: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        ...(payload ?? {}),
        ...(note.trim() ? { note: note.trim() } : {}),
      }),
    });

    const payloadResponse = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payloadResponse.error ?? "Mise a jour impossible.");
      return;
    }

    setMessage(`Statut mis a jour: ${payloadResponse.status}`);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>{label}</Label>
        {options ? (
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Input value={status} onChange={(event) => setStatus(event.target.value)} />
        )}
      </div>
      {noteLabel ? (
        <div className="space-y-2">
          <Label>{noteLabel}</Label>
          <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder={notePlaceholder} />
        </div>
      ) : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Mise a jour..." : submitLabel}</Button>
    </form>
  );
}
