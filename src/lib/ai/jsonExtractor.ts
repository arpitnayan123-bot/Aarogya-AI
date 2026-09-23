// ============================================
// AAROGYA AI — ROBUST JSON EXTRACTOR
// Extracts JSON from AI responses that may be
// wrapped in markdown fences, have preamble
// text, or contain multiple JSON blocks.
// ============================================

/**
 * Extracts and parses JSON from a potentially messy AI response.
 * Handles:
 * 1. Direct JSON
 * 2. JSON wrapped in ```json ... ``` fences
 * 3. JSON with preamble/postamble text
 * 4. JSON arrays
 * 5. Partial JSON (best effort)
 */
export function extractJSON(text: string): any | null {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();

  // Strategy 1: Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {}

  // Strategy 2: Extract from markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {}
  }

  // Strategy 3: Find the largest JSON object using brace matching (PREFERRED over arrays)
  const objResult = findBalancedJSON(trimmed, '{', '}');
  if (objResult) {
    try {
      return JSON.parse(objResult);
    } catch {}
  }

  // Strategy 4: Find the largest JSON array using bracket matching (fallback only)
  const arrResult = findBalancedJSON(trimmed, '[', ']');
  if (arrResult) {
    try {
      return JSON.parse(arrResult);
    } catch {}
  }

  // Strategy 5: Try removing common preamble patterns
  const cleaned = trimmed
    .replace(/^(Here is|Here's|Below is|The following is|Sure[!,]?|Certainly[!,]?)\s*:?\s*/i, '')
    .replace(/^(Based on|According to)\s+.*?:\s*/i, '')
    .trim();

  if (cleaned !== trimmed) {
    try {
      return JSON.parse(cleaned);
    } catch {}
    // Retry fence extraction on cleaned text
    const fenceMatch2 = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (fenceMatch2) {
      try {
        return JSON.parse(fenceMatch2[1].trim());
      } catch {}
    }
    const objResult2 = findBalancedJSON(cleaned, '{', '}');
    if (objResult2) {
      try {
        return JSON.parse(objResult2);
      } catch {}
    }
  }

  return null;
}

/**
 * Finds a balanced JSON string using bracket matching.
 * Returns the substring from the first opening bracket to its matching close.
 */
function findBalancedJSON(text: string, open: string, close: string): string | null {
  const startIndex = text.indexOf(open);
  if (startIndex === -1) return null;

  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let bestEnd = -1;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === open) {
      depth++;
    } else if (char === close) {
      depth--;
      if (depth === 0) {
        bestEnd = i;
        // Continue to find the last valid balanced block (in case there are multiple)
        // But for now, return the first complete one
        return text.substring(startIndex, bestEnd + 1);
      }
    }
  }

  // If we didn't find a complete balance, try the best we have
  if (bestEnd > startIndex) {
    return text.substring(startIndex, bestEnd + 1);
  }

  return null;
}

/**
 * Safely stringifies and re-parses to ensure valid JSON.
 * Useful for cleaning up AI-generated JSON with trailing commas, etc.
 */
export function cleanJSON(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}
