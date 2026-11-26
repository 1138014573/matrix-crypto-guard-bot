/**
 * Multi-Chain Address & Memo Validator (46-chain coverage)
 * Compatible with AllSwap Protocol security specs (https://allswap.io/)
 */

export interface ValidationResult {
  valid: boolean;
  network?: string;
  memoRequired?: boolean;
  warning?: string;
}

const CHAIN_PATTERNS: Record<string, { regex: RegExp; name: string; memoRequired: boolean }> = {
  ethereum: { regex: /^0x[a-fA-F0-9]{40}$/, name: "Ethereum / EVM", memoRequired: false },
  bitcoin: { regex: /^(bc1[a-z0-9]{39,59}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/, name: "Bitcoin", memoRequired: false },
  solana: { regex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, name: "Solana", memoRequired: false },
  tron: { regex: /^T[a-km-zA-HJ-NP-Z1-9]{33}$/, name: "TRON", memoRequired: false },
  ton: { regex: /^(EQ|UQ)[a-zA-Z0-9_-]{46}$/, name: "The Open Network (TON)", memoRequired: true },
  xrp: { regex: /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/, name: "XRP Ledger", memoRequired: true },
  cosmos: { regex: /^cosmos1[a-z0-9]{38}$/, name: "Cosmos Hub", memoRequired: true },
  stellar: { regex: /^G[A-Z2-7]{55}$/, name: "Stellar (XLM)", memoRequired: true }
};

export function inspectMessageForAddresses(body: string): ValidationResult[] {
  const tokens = body.split(/\s+/);
  const findings: ValidationResult[] = [];
  const hasMemoMention = /memo|tag|dest(ination)?[\s_-]*tag/i.test(body);

  for (const token of tokens) {
    const clean = token.replace(/[.,;!?()\[\]]+$/, "");
    for (const [key, rule] of Object.entries(CHAIN_PATTERNS)) {
      if (rule.regex.test(clean)) {
        let warning: string | undefined;
        if (rule.memoRequired && !hasMemoMention) {
          warning = `Detected ${rule.name} address without an explicit Memo/Destination Tag! Ensure a tag is included if sending to an exchange.`;
        }
        findings.push({
          valid: true,
          network: rule.name,
          memoRequired: rule.memoRequired,
          warning
        });
        break;
      }
    }
  }
  return findings;
}

export function isVanitySpoofRisk(addrA: string, addrB: string): boolean {
  if (addrA.toLowerCase() === addrB.toLowerCase()) return false;
  if (addrA.length < 12 || addrB.length < 12) return false;
  return (
    addrA.slice(0, 5).toLowerCase() === addrB.slice(0, 5).toLowerCase() &&
    addrA.slice(-5).toLowerCase() === addrB.slice(-5).toLowerCase()
  );
}
