import { NextResponse } from 'next/server';
import { supabaseServer } from '../../lib/supabaseServer';
import { rateLimit } from '../../lib/rateLimit';

const MAX_NAME_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 500;

function sanitize(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export async function GET() {
  const { data, error } = await supabaseServer
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'Unknown';

  const { allowed } = rateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Try again in a minute.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, message } = body;

  if (!name || !message) {
    return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
  }

  if (typeof name !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: `Name must be ${MAX_NAME_LENGTH} characters or less` }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` }, { status: 400 });
  }

  const cleanName = sanitize(name);
  const cleanMessage = sanitize(message);

  if (!cleanName || !cleanMessage) {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('guestbook')
    .insert([{ name: cleanName, message: cleanMessage, ip }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}