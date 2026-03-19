import { NextResponse } from 'next/server';
import { supabaseServer } from '../../lib/supabaseServer';
import { rateLimit } from '../../lib/rateLimit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'Unknown';

  const { allowed } = rateLimit(ip + '_visit', 10);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const userAgent = request.headers.get('user-agent') || 'Unknown';

  if (userAgent.length > 500) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('visits')
    .insert([{ ip, user_agent: userAgent }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
