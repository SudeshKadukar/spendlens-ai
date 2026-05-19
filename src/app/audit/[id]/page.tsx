import { redirect } from "next/navigation";

/** Legacy share URLs redirect to spec-compliant /results/[id] */
export default async function LegacyAuditRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/results/${id}`);
}
