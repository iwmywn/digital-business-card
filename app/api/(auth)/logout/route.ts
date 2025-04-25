"use server";

import { deleteSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  await deleteSession();
  return new NextResponse(null, { status: 204 });
}
