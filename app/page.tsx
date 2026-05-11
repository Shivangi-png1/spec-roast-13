"use client";

import { useState, useRef, useEffect } from "react";

// ─── Sample spec (intentionally flawed so the roast is dramatic) ─────────────
const SAMPLE_SPEC = `Feature: In-App Emoji Reactions

Overview
We want to add emoji reactions to messages in our mobile app. This will improve engagement and make the app feel more modern.

What we're building
Users can long-press any message to see a floating emoji tray with 6 options (👍 ❤️ 😂 😮 😢 🔥). Tapping an emoji adds a reaction below the message. Multiple users can react and small avatar bubbles stack under the message showing who reacted.

Why we're building this
NPS scores have been flat for 2 quarters. Support tickets mention users wanting to respond faster without typing. Slack, iMessage, and WhatsApp all have this feature. We should too.

Success metrics
Improve engagement. Higher retention. Reduce support tickets about communication.

Technical notes
The frontend team will implement this. It should work on iOS and Android.

Timeline
Ship in Sprint 14 — 3 weeks from now.`;

// ─── Score badge component ────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;

  const circumference = 2 * Math.PI * 26; // r=26
  const pct = score / 10;
  const dashArray = `${pct * circumference} ${circumference}`;

  const color =
    score <= 3
      ? { ring: "#ef4444", bg: "bg-red-50", text: "text-red-600", label: "Needs major rework" }
      : score <= 6
      ? { ring: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600", label: "Getting there" }
      : { ring: "#22c55e", bg: "bg-green-50", text: "text-green-600", label: "Strong spec" };

  return (
    <div
      className={`flex items-center gap-4 ${color.bg} rounded-2xl px-5 py-4 mb-1`}
    >
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke="white"
            strokeWidth="5"
          />
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke={color.ring}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            className="score-arc"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${color.text}`}>{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
          Spec Quality Score
        </p>
        <p className={`text-lg font-semibold ${color.text}`}>{color.label}</p>
      </div>
    </div>
  );
}

// ─── Section card colours ─────────────────────────────────────────────────────
const SECTION_STYLES: Record<
  string,
  { border: string; bg: string; titleColor: string; emoji: string }
> = {
  engineer: {
    border: "border-violet-200",
    bg: "bg-violet-50",
    titleColor: "text-violet-800",
    emoji: "🔨",
  },
  edge: {
    border: "border-red-200",
    bg: "bg-red-50",
    titleColor: "text-red-800",
    emoji: "🕳️",
  },
  missing: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    titleColor: "text-amber-800",
    emoji: "📊",
  },
  hidden: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    titleColor: "text-blue-800",
    emoji: "🔗",
  },
  devil: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    titleColor: "text-orange-800",
    emoji: "😈",
  },
  biggest: {
    border: "border-teal-200",
    bg: "bg-teal-50",
    titleColor: "text-teal-800",
    emoji: "🚩",
  },
};

function getSectionStyle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("engineer")) return SECTION_STYLES.engineer;
  if (t.includes("edge")) return SECTION_STYLES.edge;
  if (t.includes("missing") || t.includes("metric")) return SECTION_STYLES.missing;
  if (t.includes("hidden") || t.includes("depend")) return SECTION_STYLES.hidden;
  if (t.includes("devil") || t.includes("fail")) return SECTION_STYLES.devil;
  if (t.includes("biggest") || t.includes("gap") || t.includes("fix")) return SECTION_STYLES.biggest;
  return SECTION_STYLES.engineer;
}

// ─── Output renderer ──────────────────────────────────────────────────────────
function RoastOutput({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  let currentTitle = "";
  let currentLines: string[] = [];

  const flushSection = () => {
    if (!currentTitle) return;
    const style = getSectionStyle(currentTitle);
    elements.push(
      <div
        key={key++}
        className={`rounded-xl border ${style.border} ${style.bg} p-4 mb-3`}
      >
        <h3 className={`font-semibold text-sm mb-2 ${style.titleColor}`}>
          {style.emoji} {currentTitle}
        </h3>
        <div className="text-gray-700 text-sm leading-relaxed space-y-1">
          {currentLines
            .filter((l) => l.trim())
            .map((l, i) => (
              <p key={i}>{l}</p>
            ))}
        </div>
      </div>
    );
    currentTitle = "";
    currentLines = [];
  };

  let assessmentDone = false;

  for (const line of lines) {
    // Skip the score line — shown in badge
    if (/^SPEC QUALITY SCORE:/i.test(line)) continue;

    if (line.startsWith("## ")) {
      flushSection();
      currentTitle = line.replace(/^## /, "").trim();
      assessmentDone = true;
    } else if (currentTitle) {
      currentLines.push(line);
    } else if (!assessmentDone && line.trim()) {
      // One-line assessment
      elements.push(
        <p key={key++} className="text-sm text-gray-500 italic mb-3 px-1">
          {line}
          {isStreaming && elements.length === 0 && (
            <span className="cursor" />
          )}
        </p>
      );
    }
  }

  // Flush in-progress section
  if (currentTitle) {
    const style = getSectionStyle(currentTitle);
    elements.push(
      <div
        key={key++}
        className={`rounded-xl border ${style.border} ${style.bg} p-4 mb-3`}
      >
        <h3 className={`font-semibold text-sm mb-2 ${style.titleColor}`}>
          {style.emoji} {currentTitle}
        </h3>
        <div className="text-gray-700 text-sm leading-relaxed space-y-1">
          {currentLines
            .filter((l) => l.trim())
            .map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          {isStreaming && <span className="cursor" />}
        </div>
      </div>
    );
  }

  return <>{elements}</>;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [spec, setSpec] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [charWarning, setCharWarning] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll output as it streams
  useEffect(() => {
    if (outputRef.current && isLoading) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, isLoading]);

  const handleSpecChange = (val: string) => {
    setSpec(val);
    setCharWarning(val.length > 7000);
  };

  const handleRoast = async () => {
    if (!spec.trim() || isLoading) return;

    setIsLoading(true);
    setOutput("");
    setScore(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setOutput(full);

        const m = full.match(/SPEC QUALITY SCORE:\s*(\d+)/i);
        if (m) setScore(parseInt(m[1]));
      }
    } catch (err) {
      setOutput(
        "Something went wrong. Make sure your ANTHROPIC_API_KEY is set and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSpec("");
    setOutput("");
    setScore(null);
    textareaRef.current?.focus();
  };

  const hasOutput = output.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">🔥</span>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">
                Spec Roast
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Stress-test your PRD before your engineers do
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-300 hidden sm:block">
            Built by Shivangi Saxena · Powered by Claude
          </p>
        </div>
      </header>

      {/* ── Main layout ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        <div
          className={`grid gap-5 ${
            hasOutput ? "lg:grid-cols-2" : "max-w-xl mx-auto"
          }`}
        >
          {/* ── Left: Input panel ── */}
          <div className="flex flex-col gap-3">
            {/* Intro text (only before first roast) */}
            {!hasOutput && (
              <div className="text-center mb-2">
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  Will your spec survive the meeting?
                </p>
                <p className="text-sm text-gray-400">
                  Paste it below. We&apos;ll tell you exactly what questions,
                  edge cases, and risks you&apos;ve missed.
                </p>
              </div>
            )}

            {/* Textarea card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Your product spec
                </span>
                <button
                  onClick={() => handleSpecChange(SAMPLE_SPEC)}
                  className="text-xs text-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  Load sample →
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={spec}
                onChange={(e) => handleSpecChange(e.target.value)}
                placeholder={`Paste your PRD, feature brief, or product spec here.

Include:
• What you're building and why
• How it works (user flow)
• Success metrics
• Timeline / scope

It can be rough — that's the point.`}
                className="flex-1 min-h-[280px] w-full text-sm text-gray-800 placeholder-gray-300 resize-none outline-none leading-relaxed"
              />

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span
                  className={`text-xs ${
                    charWarning ? "text-amber-400" : "text-gray-300"
                  }`}
                >
                  {spec.length.toLocaleString()} / 8,000 chars
                </span>
                {spec && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={handleRoast}
              disabled={!spec.trim() || isLoading || spec.length > 8000}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white
                bg-gradient-to-r from-orange-500 to-red-500
                hover:from-orange-600 hover:to-red-600
                disabled:opacity-40 disabled:cursor-not-allowed
                active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Roasting your spec…
                </span>
              ) : (
                "🔥 Roast my spec →"
              )}
            </button>

            {!hasOutput && (
              <p className="text-xs text-center text-gray-300">
                Your spec is never stored or logged.
              </p>
            )}
          </div>

          {/* ── Right: Output panel ── */}
          {hasOutput && (
            <div className="flex flex-col gap-3">
              <ScoreBadge score={score} />

              <div
                ref={outputRef}
                className="flex flex-col overflow-y-auto max-h-[68vh] pr-1 pb-1"
              >
                <RoastOutput text={output} isStreaming={isLoading} />
              </div>

              {!isLoading && output.length > 50 && (
                <button
                  onClick={handleCopy}
                  className="mt-1 py-2.5 px-4 rounded-xl text-sm font-medium
                    border border-gray-200 hover:bg-gray-100
                    text-gray-600 flex items-center justify-center gap-2
                    transition-colors"
                >
                  {copied ? (
                    <span className="text-green-600">✓ Copied!</span>
                  ) : (
                    <>📋 Copy full roast</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-4 px-6 text-center">
        <p className="text-xs text-gray-300">
          Spec Roast · Built with Claude · Made by{" "}
          <a
            href="https://www.linkedin.com/in/shivangi-saxena"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-600 transition-colors"
          >
            Shivangi Saxena
          </a>
        </p>
      </footer>
    </div>
  );
}
