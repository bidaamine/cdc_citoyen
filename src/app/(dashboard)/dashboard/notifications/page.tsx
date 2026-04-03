import Link from "next/link";

import { InfoCard } from "@/components/app/blocks";
import { getUserNotifications } from "@/lib/queries";
import { requireSessionForPage } from "@/lib/session";

export default async function NotificationsPage() {
  const session = await requireSessionForPage();
  const notifications = await getUserNotifications(session.user.id);

  return (
    <InfoCard title="Notifications" description="Centre de notifications in-app et e-mail.">
      <div className="space-y-3">
        {notifications.map((item) => (
          <div key={item.id} className="rounded-2xl bg-[var(--muted)]/65 px-4 py-3 text-sm">
            <p className="font-medium">{`${item.date} · ${item.title}`}</p>
            <p className="mt-1 text-[var(--muted-foreground)]">{item.body}</p>
            {item.relatedHref && item.relatedLabel ? (
              <Link href={item.relatedHref} className="mt-2 inline-block font-semibold text-[var(--primary)] hover:underline">
                {item.relatedLabel}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
