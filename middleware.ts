// import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // const supabase = createMiddlewareSupabaseClient({ req, res });
  const rt = req.cookies.get('sb-refresh-token')?.value as string;
  const at = req.cookies.get('sb-access-token')?.value as string;

  if (!(rt && at)) {
    // make sure you handle this case!
    throw new Error('User is not authenticated.')
  }

  return res;
}
export const config = {
  matcher: '/dashboard/:id*',
};