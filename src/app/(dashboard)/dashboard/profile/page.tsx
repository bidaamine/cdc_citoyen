import { ProfileForm } from "@/components/app/profile-form";
import { getProfile } from "@/lib/queries";
import { requireSessionForPage } from "@/lib/session";

export default async function ProfilePage() {
  const session = await requireSessionForPage();
  const profile = await getProfile(session.user.id);

  if (!profile) {
    return null;
  }

  return <ProfileForm profile={profile} />;
}
