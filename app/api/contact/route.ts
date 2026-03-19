import { NextResponse } from 'next/server'
import { supabaseServer } from '../../lib/supabaseServer'
import { rateLimit } from '../../lib/rateLimit'

const MAX_CONTENT_LENGTH = 1000
const MAX_FIELD_LENGTH = 100

export async function POST(request: Request) {
  const ip = request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'Unknown'

  const { allowed } = rateLimit(ip + '_contact', 3)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, name, email, subject, content } = body

  if (!type || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['email', 'message'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  if (typeof content !== 'string' || content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json({ error: 'Content too long' }, { status: 400 })
  }

  if (name && (typeof name !== 'string' || name.length > MAX_FIELD_LENGTH)) {
    return NextResponse.json({ error: 'Name too long' }, { status: 400 })
  }

  if (email && (typeof email !== 'string' || email.length > MAX_FIELD_LENGTH)) {
    return NextResponse.json({ error: 'Email too long' }, { status: 400 })
  }

  if (subject && (typeof subject !== 'string' || subject.length > MAX_FIELD_LENGTH)) {
    return NextResponse.json({ error: 'Subject too long' }, { status: 400 })
  }

  if (type === 'email' && (!name || !email || !subject)) {
    return NextResponse.json({ error: 'Email type requires name, email and subject' }, { status: 400 })
  }

  const { error } = await supabaseServer
    .from('contact_messages')
    .insert([{
      type,
      name: name?.trim().replace(/[<>]/g, '') || null,
      email: email?.trim() || null,
      subject: subject?.trim().replace(/[<>]/g, '') || null,
      content: content.trim().replace(/[<>]/g, ''),
      ip
    }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
