// ============================================
// AAROGYA AI — WHATSAPP CLOUD API SERVICE
//
// Sends outbound messages via the WhatsApp Business
// Cloud API (Meta Graph API v18.0) and processes
// inbound messages by routing them through Claude
// (callMedicalAI for text, callMedicalVisionAI for
// image attachments).
//
// Env vars required:
//   • WHATSAPP_TOKEN          — system-user access token
//   • WHATSAPP_PHONE_ID       — phone-number-id from Meta Business
//   • WHATSAPP_VERIFY_TOKEN   — arbitrary string configured in Meta webhook UI
//
// Server-side only — secrets live in process.env.
// ============================================

import { callMedicalAI, callMedicalVisionAI } from '@/lib/ai-client';

// --------------------------------------------
// Types — minimal shape of an inbound webhook payload
// (WhatsApp sends a rich nested object; we model only
// the fields we actually read so the surface stays tight).
// --------------------------------------------

export interface WhatsAppTextMessage {
  from: string;
  messageId: string;
  text: string;
  type: 'text';
}

export interface WhatsAppImageMessage {
  from: string;
  messageId: string;
  imageId: string;
  caption?: string;
  mimeType: string;
  type: 'image';
}

export type WhatsAppIncomingMessage = WhatsAppTextMessage | WhatsAppImageMessage;

interface WhatsAppWebhookEntry {
  changes?: Array<{
    value?: {
      messaging_product?: string;
      metadata?: { phone_number_id?: string; display_phone_number?: string };
      contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
      messages?: Array<{
        id?: string;
        type?: string;
        from?: string;
        text?: { body?: string };
        image?: {
          id?: string;
          mime_type?: string;
          caption?: string;
          sha256?: string;
        };
      }>;
    };
    field?: string;
  }>;
}

export interface WhatsAppWebhookPayload {
  object?: string;
  entry?: WhatsAppWebhookEntry[];
}

// --------------------------------------------
// Outbound — sendWhatsAppMessage
// --------------------------------------------

/**
 * Send a plain-text WhatsApp message to a single recipient.
 *
 * @param phoneNumber  Recipient phone in international format, digits only (e.g. "919876543210").
 * @param message      Plain-text body. WhatsApp will reject > 4096 chars.
 * @returns            The parsed JSON response from the Graph API.
 * @throws             If WHATSAPP_TOKEN / WHATSAPP_PHONE_ID are missing or the API call fails.
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
): Promise<unknown> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    throw new Error(
      'WhatsApp env vars not configured. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID.',
    );
  }

  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `WhatsApp API error ${response.status}: ${errorBody}`,
    );
  }

  return response.json();
}

// --------------------------------------------
// Inbound — processIncomingMessage
// --------------------------------------------

const TEXT_SYSTEM_PROMPT = `You are Aarogya AI, a medical AI assistant accessed via WhatsApp.

Your role:
1. Detect the language the user wrote in (Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Urdu, etc.).
2. Reply in the SAME language the user used. If they switch languages mid-conversation, match their latest message.
3. Be concise — WhatsApp is a chat interface. Keep replies under ~150 words. Use short paragraphs or bullet points.
4. You are NOT a replacement for a doctor. You provide general health information, triage guidance, and help users decide whether to seek care.
5. ALWAYS append this disclaimer at the end of every reply: "⚠️ This is AI-generated health information, not medical advice. For emergencies, call 112 (India)."
6. If the user describes RED-FLAG symptoms (chest pain, difficulty breathing, severe bleeding, stroke signs like facial droop/slurred speech, suicidal thoughts, severe allergic reaction, unconsciousness, severe burns, fitting/convulsions), START your reply by telling them to call 112 immediately, then give interim first-aid guidance.
7. Do not prescribe scheduled drugs. You may mention OTC options at a high level and direct the user to a pharmacist or doctor for prescriptions.
8. Do not diagnose definitively. Offer likely possibilities with appropriate uncertainty and recommend a consultation when appropriate.
9. Never share the user's data or assume identity beyond what they tell you in this conversation.
10. If the message is not health-related, gently redirect: "I'm Aarogya AI, a health assistant. I can help with symptoms, lab reports, medications, lifestyle, etc. — what health question can I help with?"`;

const VISION_SYSTEM_PROMPT = `You are Aarogya AI, a medical vision assistant accessed via WhatsApp.

Your role:
1. Detect the language used in the user's caption (or default to English if no caption).
2. Reply in the SAME language.
3. Be concise — keep replies under ~180 words. Use clear sections: "Observations", "Possible causes", "Next steps".
4. You are analyzing a medical image (e.g. lab report, X-ray, skin photo, prescription, wound photo). Be honest about image quality and your confidence.
5. NEVER give a definitive diagnosis. Use phrases like "this may indicate", "could be consistent with", "consider discussing with a doctor".
6. If the image shows an emergency (e.g. severe bleeding, fracture with deformity, severe allergic reaction, stroke symptoms, suicidal content), tell the user to call 112 immediately.
7. ALWAYS append: "⚠️ This is AI-generated analysis, not medical advice. For emergencies, call 112 (India). Confirm findings with a qualified clinician."
8. Do not prescribe scheduled drugs.
9. If the image is unclear or non-medical, say so politely and ask for a clearer image or more context.`;

/**
 * Process an inbound WhatsApp message and produce a plain-text reply
 * ready to be sent back via sendWhatsAppMessage.
 *
 * Text  → routed through callMedicalAI with a WhatsApp-specific prompt
 *         (language detection, conciseness, disclaimer, 112 escalation).
 * Image → routed through callMedicalVisionAI. The WhatsApp image is
 *         fetched from the Graph API as binary, base64-encoded, and
 *         handed to Claude with the user's caption (if any).
 *
 * @param incomingMessage  Normalized message parsed from the webhook payload.
 * @returns                AI-generated reply string.
 */
export async function processIncomingMessage(
  incomingMessage: WhatsAppIncomingMessage,
): Promise<string> {
  if (incomingMessage.type === 'text') {
    return callMedicalAI(
      TEXT_SYSTEM_PROMPT,
      incomingMessage.text,
      1024,
    );
  }

  // Image — fetch from Graph API, base64-encode, hand to Claude.
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) {
    throw new Error('WHATSAPP_TOKEN not configured for image download.');
  }

  const mediaRes = await fetch(
    `https://graph.facebook.com/v18.0/${incomingMessage.imageId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!mediaRes.ok) {
    throw new Error(
      `Failed to fetch WhatsApp media URL (${mediaRes.status}).`,
    );
  }

  const mediaMeta = (await mediaRes.json()) as { url?: string };
  if (!mediaMeta.url) {
    throw new Error('WhatsApp media metadata missing URL.');
  }

  const blobRes = await fetch(mediaMeta.url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!blobRes.ok) {
    throw new Error(`Failed to download WhatsApp image (${blobRes.status}).`);
  }

  const arrayBuffer = await blobRes.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  const mediaType = incomingMessage.mimeType === 'image/png'
    ? 'image/png'
    : incomingMessage.mimeType === 'image/webp'
      ? 'image/webp'
      : 'image/jpeg';

  const userMessage = incomingMessage.caption?.trim()
    ? `User caption: ${incomingMessage.caption}\n\nPlease analyze this medical image.`
    : 'Please analyze this medical image.';

  return callMedicalVisionAI(
    VISION_SYSTEM_PROMPT,
    userMessage,
    base64,
    mediaType,
  );
}

// --------------------------------------------
// Payload parser — extracts a normalized message
// from a raw WhatsApp webhook POST body.
// Returns null when the payload contains no
// actionable inbound message (status updates,
// read receipts, etc.).
// --------------------------------------------

export function parseWebhookPayload(
  payload: WhatsAppWebhookPayload,
): WhatsAppIncomingMessage | null {
  const entry = payload.entry?.[0];
  const value = entry?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message || !message.from || !message.id || !message.type) {
    return null;
  }

  if (message.type === 'text' && message.text?.body) {
    return {
      type: 'text',
      from: message.from,
      messageId: message.id,
      text: message.text.body,
    };
  }

  if (message.type === 'image' && message.image?.id) {
    return {
      type: 'image',
      from: message.from,
      messageId: message.id,
      imageId: message.image.id,
      caption: message.image.caption,
      mimeType: message.image.mime_type ?? 'image/jpeg',
    };
  }

  return null;
}
