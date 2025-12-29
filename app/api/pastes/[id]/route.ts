import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const data = await redis.hgetall(key);

  if (!data || !data.content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = nowMs(new Headers());

  if (data.expires_at && currentTime > Number(data.expires_at)) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (data.max_views !== null) {
    if (Number(data.views) >= Number(data.max_views)) {
      return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
    }
  }

  await redis.hincrby(key, "views", 1);

  const remainingViews =
    data.max_views !== null
      ? Number(data.max_views) - (Number(data.views) + 1)
      : null;

  return NextResponse.json({
    content: data.content,
    remaining_views: remainingViews,
    expires_at: data.expires_at
      ? new Date(Number(data.expires_at)).toISOString()
      : null,
  });
}
