import { NextResponse } from "next/server";
import os from "os";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ hostname: os.hostname() });
  } catch {
    return NextResponse.json({ hostname: "unknown" });
  }
}
