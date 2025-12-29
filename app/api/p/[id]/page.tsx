import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({ params }: any) {
  const data = await getPaste(params.id);

  if (!data) notFound();

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "1rem" }}>
      {data.content}
    </pre>
  );
}
