// Glossary for the sentence-case fixer (tools/sentence-case/fix-heading-case.mjs).
//
// Words already in ALL CAPS (e.g. API, SDK, RTOS) or with internal capitals
// (e.g. PowerUp, iOS) are auto-detected as acronyms/camelCase and don't need
// an entry here. This file only needs brand/product/platform names that are
// capitalized like ordinary words.
//
// Extend PHRASES/WORDS as the --dry-run report surfaces legitimate proper
// nouns under "low confidence" findings.

// Minor words: always lowercased unless they're the first word of the heading/title.
export const STOPWORDS = new Set([
  "a", "an", "the",
  "and", "or", "but", "nor",
  "to", "for", "of", "with", "in", "on", "at", "by", "from", "as",
  "into", "onto", "per", "via", "vs",
  "up", "it", "is",
]);

// Multi-word proper-noun phrases, preserved verbatim (case-insensitive match,
// canonical casing restored). Matched longest-first so "EMV Core" wins over
// a lone "EMV" or "Core" match.
export const PHRASES = [
  "EMV Core",
  "Core Extension",
  "Marshall Pro",
  "Amazon SQS",
  "FIS Cortina",
  "UNO-mini",
  "Nayax Core",
];

// Single-word proper nouns / brand or platform names -> canonical casing.
// Keys are lowercase for case-insensitive lookup.
export const WORDS = new Map(Object.entries({
  nayax: "Nayax",
  lynx: "Lynx",
  marshall: "Marshall",
  spark: "Spark",
  cortina: "Cortina",
  tweezercomm: "TweezerComm",
  devzone: "DevZone",
  mintlify: "Mintlify",
  ecom: "Ecom",
  bruno: "Bruno",
  doxygen: "Doxygen",
  github: "GitHub",
  windows: "Windows",
  android: "Android",
  java: "Java",
  python: "Python",
  amazon: "Amazon",
  google: "Google",
  aws: "AWS",
  // Found while mining the docs/ corpus for capitalized non-first words
  // (see .claude/sentence-case-report.md for the workflow): real proper
  // nouns that would otherwise get lowercased by the default rule.
  israel: "Israel",
  onyx: "Onyx",
  smartfridge: "Smartfridge",
  agamento: "Agamento",
  amit: "Amit",
  c: "C",
  "c#": "C#",
}));

// Words that are always capitalized regardless of position (English pronoun
// "I" and its common contractions). Checked before the default-lowercase rule.
export const ALWAYS_CAPS_RE = /^i(?:'(?:m|ll|ve|d))?$/;
