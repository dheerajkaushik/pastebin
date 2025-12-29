import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const data = await redis.hgetall<Record<string, string>>(key);

  if (!data || !data.content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = nowMs(request.headers);

  if (data.expires_at && currentTime > Number(data.expires_at)) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  const maxViews = data.max_views ? Number(data.max_views) : null;
  const views = data.views ? Number(data.views) : 0;

  if (maxViews !== null && views >= maxViews) {
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  const newViews = await redis.hincrby(key, "views", 1);

  return NextResponse.json({
    content: data.content,
    remaining_views:
      maxViews !== null ? Math.max(0, maxViews - newViews) : null,
    expires_at: data.expires_at
      ? new Date(Number(data.expires_at)).toISOString()
      : null,
  });
}
