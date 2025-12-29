import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "Invalid ttl_seconds" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "Invalid max_views" },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const expiresAt = ttl_seconds
      ? Date.now() + ttl_seconds * 1000
      : null;

    await redis.hset(`paste:${id}`, {
      content,
      views: 0,
      max_views: max_views ?? null,
      expires_at: expiresAt,
    });

    if (ttl_seconds) {
      await redis.expire(`paste:${id}`, ttl_seconds);
    }

    return NextResponse.json({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    });
  } catch (err) {
    console.error("POST /api/pastes failed:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
