import { NextResponse } from "next/server"

export async function createResponse(message: string | object, status: number) {
  return new NextResponse(JSON.stringify(message), { status })
}
