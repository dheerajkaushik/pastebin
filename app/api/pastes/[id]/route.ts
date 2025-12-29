import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const data = await redis.hgetall(key);

  if (!data || !data.content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = nowMs(request.headers);

  if (data.expires_at && currentTime > Number(data.expires_at)) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (data.max_views !== null) {
    if (Number(data.views) >= Number(data.max_views)) {
      return NextResponse.json(
        { error: "View limit exceeded" },
        { status: 404 }
      );
    }
  }

  // Atomic increment
  const newViews = await redis.hincrby(key, "views", 1);

  const remainingViews =
    data.max_views !== null
      ? Math.max(0, Number(data.max_views) - newViews)
      : null;

  return NextResponse.json({
    content: data.content,
    remaining_views: remainingViews,
    expires_at: data.expires_at
      ? new Date(Number(data.expires_at)).toISOString()
      : null,
  });
}
