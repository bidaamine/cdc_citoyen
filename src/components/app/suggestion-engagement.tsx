"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { Heart, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { SuggestionCommentItem } from "@/lib/api-types";

export function SuggestionEngagement({
  endpointBase,
  initialLikes,
  initialComments,
  initialViewerHasLiked = false,
  initialDiscussion,
}: {
  endpointBase: string;
  initialLikes: number;
  initialComments: number;
  initialViewerHasLiked?: boolean;
  initialDiscussion: SuggestionCommentItem[];
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [viewerHasLiked, setViewerHasLiked] = useState(initialViewerHasLiked);
  const [discussion, setDiscussion] = useState(initialDiscussion);
  const [commentBody, setCommentBody] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLikePending, setIsLikePending] = useState(false);
  const [isCommentPending, setIsCommentPending] = useState(false);

  async function handleLike() {
    setIsLikePending(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`${endpointBase}/likes`, { method: "POST" });

      if (response.status === 401) {
        setStatusMessage("Connectez-vous pour aimer cette proposition.");
        return;
      }

      const payload = await response.json();

      if (!response.ok) {
        setStatusMessage(payload.error ?? "Impossible de mettre a jour le like.");
        return;
      }

      startTransition(() => {
        setLikes(payload.likes);
        setViewerHasLiked(payload.liked);
      });
    } catch {
      setStatusMessage("Une erreur est survenue pendant le like.");
    } finally {
      setIsLikePending(false);
    }
  }

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!commentBody.trim()) {
      setStatusMessage("Le commentaire ne peut pas etre vide.");
      return;
    }

    setIsCommentPending(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`${endpointBase}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: commentBody.trim() }),
      });

      if (response.status === 401) {
        setStatusMessage("Connectez-vous pour commenter cette proposition.");
        return;
      }

      const payload = await response.json();

      if (!response.ok) {
        setStatusMessage(payload.error ?? "Impossible d'ajouter le commentaire.");
        return;
      }

      startTransition(() => {
        setDiscussion((current) => [payload.comment, ...current]);
        setCommentsCount(payload.comments);
        setCommentBody("");
      });
    } catch {
      setStatusMessage("Une erreur est survenue pendant l'envoi du commentaire.");
    } finally {
      setIsCommentPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleLike} disabled={isLikePending} variant={viewerHasLiked ? "default" : "outline"}>
          <Heart className="size-4" />
          {viewerHasLiked ? `Like retire (${likes})` : `Aimer (${likes})`}
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
          <MessageSquare className="size-4" />
          {commentsCount} commentaire{commentsCount > 1 ? "s" : ""}
        </div>
        <Link href="/auth/login" className="text-sm font-semibold text-[var(--primary)] hover:underline">
          Se connecter pour interagir
        </Link>
      </div>

      <form className="space-y-3" onSubmit={handleCommentSubmit}>
        <Textarea
          value={commentBody}
          onChange={(event) => setCommentBody(event.target.value)}
          placeholder="Ajouter un commentaire public"
          className="min-h-28"
        />
        <Button type="submit" disabled={isCommentPending}>
          {isCommentPending ? "Publication..." : "Publier le commentaire"}
        </Button>
      </form>

      {statusMessage ? <p className="text-sm text-[var(--muted-foreground)]">{statusMessage}</p> : null}

      <div className="space-y-3">
        {discussion.length > 0 ? (
          discussion.map((comment) => (
            <article key={comment.id} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{comment.author}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{comment.createdAt}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{comment.body}</p>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card)] px-4 py-6 text-sm text-[var(--muted-foreground)]">
            Aucun commentaire public pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
