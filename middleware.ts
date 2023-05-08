import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
// import { supabase } from './app/supabaseClient'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const data = await supabase.auth.getSession()
  console.log(data);
  return res
}
export const config ={
  matcher: ["/login", "/dashboard/:id*"]
}