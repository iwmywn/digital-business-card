"use server";

import { session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  await session.user.delete();
  return new NextResponse(null, { status: 204 });
}
