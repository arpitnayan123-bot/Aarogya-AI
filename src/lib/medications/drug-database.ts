// ============================================
// AAROGYA AI — DRUG INTERACTION DATABASE
//
// Queries the NLM RxNorm Interaction REST API to detect pairwise
// interactions between medications in a patient's regimen.
//
// Endpoint: https://rxnav.nlm.nih.gov/REST/interaction/list.json
// Docs:     https://lhncbc.nlm.nih.gov/RxNav/APIs/API-Interaction.html
//
// Algorithm:
//   1. Generate all C(n,2) pairs from the medications list
//   2. Batch-query RxNorm for each pair (RXCUI lookup + interaction list)
//   3. Deduplicate by (drug1, drug2) — case-insensitive, order-independent
//   4. Return normalized interaction objects
// ============================================

const RXNORM_BASE = 'https://rxnav.nlm.nih.gov/REST';

export type InteractionSeverity = 'major' | 'moderate' | 'minor' | 'unknown';

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: InteractionSeverity;
  description: string;
  source?: string;
}

/**
 * Resolve a drug name to its RxNorm Concept Unique Identifier (RXCUI) via
 * the findRxcuiByDrugName endpoint. Returns null if not found.
 */
async function resolveRxcui(drugName: string): Promise<string | null> {
  const url =
    `${RXNORM_BASE}/rxcui.json?name=${encodeURIComponent(drugName)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      idGroup?: { rxnormId?: string[] };
    };
    const id = data?.idGroup?.rxnormId?.[0];
    return id ?? null;
  } catch {
    return null;
  }
}

/**
 * Query the RxNorm interaction list endpoint with two RXCUIs and return
 * any detected interactions. The endpoint accepts up to 50 RxCUIs at once
 * and returns full pairwise interactions — we use it here per-pair for
 * clarity, but could batch for large regimens.
 */
async function queryInteractionList(
  rxcui1: string,
  rxcui2: string,
): Promise<Array<{ severity: InteractionSeverity; description: string; source?: string }>> {
  const url =
    `${RXNORM_BASE}/interaction/list.json?rxcuis=${rxcui1}+${rxcui2}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      fullInteractionTypeGroup?: Array<{
        fullInteractionType?: Array<{
          minConcept: { rxcui: string; name: string }[];
          interactionPair: Array<{
            interactionConcept: { rxcui: string; sourceConceptItem: { name: string } }[];
            severity: string;
            description: string;
          }>;
        }>;
      }>;
    };

    const interactions: Array<{
      severity: InteractionSeverity;
      description: string;
      source?: string;
    }> = [];

    for (const group of data.fullInteractionTypeGroup ?? []) {
      for (const interaction of group.fullInteractionType ?? []) {
        for (const pair of interaction.interactionPair ?? []) {
          interactions.push({
            severity: normalizeSeverity(pair.severity),
            description: pair.description ?? '',
            source: 'RxNorm',
          });
        }
      }
    }

    return interactions;
  } catch {
    return [];
  }
}

function normalizeSeverity(raw: string | undefined): InteractionSeverity {
  const s = (raw ?? '').trim().toLowerCase();
  if (s === 'major' || s === 'high' || s === 'severe' || s.includes('contraind')) {
    return 'major';
  }
  if (s === 'moderate' || s === 'medium') return 'moderate';
  if (s === 'minor' || s === 'low' || s === 'mild') return 'minor';
  return 'unknown';
}

function pairKey(drug1: string, drug2: string): string {
  // Order-independent key for dedup
  return [drug1.toLowerCase(), drug2.toLowerCase()].sort().join('||');
}

/**
 * Generate all unique unordered pairs from an array of medication names.
 * Returns array of [drug1, drug2] tuples.
 */
function generatePairs(medications: string[]): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  const n = medications.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push([medications[i], medications[j]]);
    }
  }
  return pairs;
}

/**
 * Check all pairwise drug interactions for a list of medications using
 * the NLM RxNorm API.
 *
 * @param medications Array of drug names (e.g. ["metformin", "glipizide"])
 * @returns deduplicated array of DrugInteraction objects
 */
export async function checkAllInteractions(
  medications: string[],
): Promise<DrugInteraction[]> {
  if (!medications || medications.length < 2) {
    return [];
  }

  // Sanitize + dedupe input (case-insensitive)
  const cleaned = Array.from(
    new Set(
      medications
        .map((m) => (m ?? '').trim())
        .filter((m) => m.length > 0)
        .map((m) => m.toLowerCase()),
    ),
  );
  if (cleaned.length < 2) return [];

  // Resolve RxCUIs for each drug in parallel
  const rxcuiMap = new Map<string, string | null>();
  await Promise.all(
    cleaned.map(async (drug) => {
      const rxcui = await resolveRxcui(drug);
      rxcuiMap.set(drug, rxcui);
    }),
  );

  const pairs = generatePairs(cleaned);
  const seenKeys = new Set<string>();
  const results: DrugInteraction[] = [];

  // Query interactions for each pair (with small concurrency control via Promise.all)
  await Promise.all(
    pairs.map(async ([drug1, drug2]) => {
      const rxcui1 = rxcuiMap.get(drug1);
      const rxcui2 = rxcuiMap.get(drug2);

      // If we couldn't resolve either RxCUI, skip — no interactions to report
      if (!rxcui1 || !rxcui2) return;

      const interactions = await queryInteractionList(rxcui1, rxcui2);
      for (const ix of interactions) {
        const key = pairKey(drug1, drug2) + '|' + ix.description;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        results.push({
          drug1,
          drug2,
          severity: ix.severity,
          description: ix.description,
          source: ix.source,
        });
      }
    }),
  );

  return results;
}
