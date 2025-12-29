import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPaste(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`;

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}


export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getPaste(params.id);

  if (!data) notFound();

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "1rem" }}>
      {data.content}
    </pre>
  );
}
