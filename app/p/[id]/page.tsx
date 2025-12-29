import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPaste(id: string) {
  // Determine the base URL dynamically
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching paste:", error);
    return null;
  }
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>; // 1. Update Type to Promise
}) {
  const { id } = await params; // 2. Await the params
  const data = await getPaste(id);

  if (!data) notFound();

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "1rem" }}>
      {data.content}
    </pre>
  );
}