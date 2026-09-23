// GET  /api/whatsapp/webhook — Webhook verification (Meta calls this once on setup)
// POST /api/whatsapp/webhook — Inbound message receiver
import { NextRequest, NextResponse } from 'next/server';
import {
  sendWhatsAppMessage,
  processIncomingMessage,
  parseWebhookPayload,
  type WhatsAppWebhookPayload,
} from '@/lib/whatsapp/whatsapp-service';

// --------------------------------------------
// GET — Webhook verification
// Meta sends hub.mode=subscribe, hub.verify_token=<our token>,
// and hub.challenge. We echo hub.challenge back as PLAIN TEXT
// once the verify token matches.
// --------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    return new NextResponse('WHATSAPP_VERIFY_TOKEN not configured', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  if (mode === 'subscribe' && token === verifyToken) {
    // Echo challenge as plain text — Meta expects exactly this string back.
    return new NextResponse(challenge ?? '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 403 — token mismatch or missing mode
  return new NextResponse('Forbidden', {
    status: 403,
    headers: { 'Content-Type': 'text/plain' },
  });
}

// --------------------------------------------
// POST — Inbound message handler
// Meta sends a webhook payload every time a user messages
// our WhatsApp number. We parse out the sender + content,
// run it through Claude via processIncomingMessage, then
// reply via sendWhatsAppMessage.
// --------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as WhatsAppWebhookPayload;

    // Meta expects a 200 OK FAST (within ~5s) or it retries.
    // We acknowledge first and let the AI work complete in-band.
    // (For production scale, push to a queue and 200 immediately.)
    const message = parseWebhookPayload(payload);

    if (!message) {
      // Not an inbound user message (likely a status/read receipt).
      return NextResponse.json({ received: true, handled: false });
    }

    // Run AI → reply. Wrapped in try/catch so a downstream AI failure
    // still returns 200 to Meta (avoids infinite retries) and sends
    // the user a graceful fallback message.
    try {
      const aiReply = await processIncomingMessage(message);
      await sendWhatsAppMessage(message.from, aiReply);
      return NextResponse.json({ received: true, handled: true, replied: true });
    } catch (innerError) {
      console.error('WhatsApp message processing error:', innerError);
      // Best-effort graceful fallback to the user.
      try {
        await sendWhatsAppMessage(
          message.from,
          'Sorry, I could not process your message right now. Please try again in a moment. For emergencies, call 112.',
        );
      } catch {
        // If even the fallback send fails, swallow — Meta must still get 200.
      }
      return NextResponse.json({
        received: true,
        handled: true,
        replied: false,
        error: innerError instanceof Error ? innerError.message : 'unknown',
      });
    }
  } catch (error) {
    console.error('WhatsApp webhook POST error:', error);
    // Still return 200 to Meta to prevent webhook retries of malformed payloads.
    return NextResponse.json(
      { received: false, error: 'Invalid webhook payload' },
      { status: 200 },
    );
  }
}
