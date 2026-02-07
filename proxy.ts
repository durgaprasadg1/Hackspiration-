import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple proxy for basic route handling - auth is handled in pages
export default async function proxy(request: NextRequest) {
  // Just pass through - let pages handle their own auth checks
  return NextResponse.next();
}

export const config = {
  // Only match specific patterns that need proxy handling
  matcher: [],
};
