"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Calendar, Coins, Zap, Flame, Wand2, ChevronLeft } from "lucide-react";

// ─── Exported type ─────────────────────────────────────────────────────────────

export interface ForgedContract {
  title: string;
  deadline: string;
  difficulty: number;
  totalGold: number;
  totalXp: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS = ["旅人", "冒險者", "勇士", "英雄", "傳說"];
const GOLD_TABLE = [50, 120, 200, 350, 500];
const XP_TABLE  = [100, 250, 450, 700, 1000];

function calcRewards(d: number) {
  return { gold: GOLD_TABLE[d - 1], xp: XP_TABLE[d - 1] };
}

// ─── Editable field (click-to-edit) ───────────────────────────────────────────

function EditableField({
  value, onChange, icon: Icon, label, mono,
}: {
  value: string; onChange: (v: string) => void;
  icon: React.ElementType; label: string; mono?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  return (
    <div className="flex items-start gap-3">
      <Icon className="w-3.5 h-3.5 text-[#c9a84c]/50 mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/25">{label}</span>
        {editing ? (
          <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
            className={`bg-[#0d0418]/80 border border-[#c9a84c]/40 rounded px-2 py-1 text-sm text-[#e8d5b7] outline-none w-full ${mono ? "font-mono" : ""}`}
          />
        ) : (
          <button onClick={() => setEditing(true)}
            className={`text-sm text-left text-[#e8d5b7] hover:text-[#c9a84c] border-b border-dashed border-[#c9a84c]/20 hover:border-[#c9a84c]/50 transition-colors duration-200 pb-0.5 truncate ${mono ? "font-mono" : ""}`}
          >
            {value}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ContractForm({ onForge, onCancel }: { onForge: (c: ForgedContract) => void; onCancel?: () => void }) {
  const [phase, setPhase]           = useState<"oracle" | "parsing" | "contract">("oracle");
  const [goalInput, setGoalInput]   = useState("");
  const [title, setTitle]           = useState("");
  const [deadline, setDeadline]     = useState("2026/10/07");
  const [difficulty, setDifficulty] = useState(3);
  const [displayGold, setDisplayGold] = useState(calcRewards(3).gold);
  const [displayXp, setDisplayXp]     = useState(calcRewards(3).xp);
  const [isRolling, setIsRolling]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (phase === "oracle") inputRef.current?.focus(); }, [phase]);

  // Slot-machine effect when difficulty changes
  useEffect(() => {
    const target = calcRewards(difficulty);
    setIsRolling(true);
    let ticks = 0;
    const iv = setInterval(() => {
      ticks++;
      if (ticks < 16) {
        setDisplayGold(Math.floor(Math.random() * 800 + 30));
        setDisplayXp(Math.floor(Math.random() * 1200 + 80));
      } else {
        clearInterval(iv);
        setDisplayGold(target.gold);
        setDisplayXp(target.xp);
        setIsRolling(false);
      }
    }, 45);
    return () => clearInterval(iv);
  }, [difficulty]);

  function handleOracleSubmit() {
    if (!goalInput.trim()) return;
    setTitle(goalInput.trim());
    setPhase("parsing");
    setTimeout(() => setPhase("contract"), 1000);
  }

  function handleForge() {
    onForge({ title, deadline, difficulty, totalGold: calcRewards(difficulty).gold, totalXp: calcRewards(difficulty).xp });
  }

  return (
    <AnimatePresence mode="wait">

      {/* ── Phase 1: Oracle Crystal ── */}
      {phase === "oracle" && (
        <motion.div key="oracle"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35 }}
          className="flex flex-col items-center py-10"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#c9a84c]/10 blur-3xl scale-150" />
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-16 h-16 rounded-full border border-[#c9a84c]/40 bg-gradient-to-br from-[#1a0a2e] to-[#0a0208] flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.2)]"
            >
              <Sparkles className="w-7 h-7 text-[#c9a84c]" />
            </motion.div>
          </div>

          <h2 className="text-[#c9a84c] text-base font-semibold tracking-widest uppercase mb-1">
            The Oracle&apos;s Crystal
          </h2>
          <p className="text-[#e8d5b7]/25 text-[10px] uppercase tracking-widest mb-6">
            許下你的宏願，讓命運來解讀
          </p>

          <div className="w-full max-w-sm relative">
            <motion.div animate={{ opacity: goalInput ? 1 : 0.3 }}
              className="absolute -inset-px rounded-lg bg-gradient-to-r from-transparent via-[#c9a84c]/25 to-transparent blur-sm"
            />
            <input ref={inputRef} value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOracleSubmit()}
              placeholder="Whisper your ambition to the Oracle..."
              className="relative w-full bg-[#0d0418]/80 border border-[#c9a84c]/25 rounded-lg px-5 py-3.5 text-sm text-[#e8d5b7] placeholder-[#e8d5b7]/18 outline-none focus:border-[#c9a84c]/55 transition-all duration-300 text-center"
            />
          </div>
          <p className="mt-3 text-[9px] text-[#e8d5b7]/12 uppercase tracking-widest">按下 Enter 召喚命運</p>
        </motion.div>
      )}

      {/* ── Phase 2: Parsing ── */}
      {phase === "parsing" && (
        <motion.div key="parsing"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex flex-col items-center py-14 gap-3"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="w-7 h-7 text-[#c9a84c]/60" />
          </motion.div>
          <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
            className="text-sm text-[#c9a84c]/60 tracking-widest"
          >
            Oracle 正在解析命運
          </motion.p>
        </motion.div>
      )}

      {/* ── Phase 3: Contract ── */}
      {phase === "contract" && (
        <motion.div key="contract"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}
        >
          {/* Back link */}
          {onCancel && (
            <button onClick={onCancel}
              className="flex items-center gap-1 text-[10px] text-[#e8d5b7]/25 hover:text-[#c9a84c]/60 transition-colors uppercase tracking-widest mb-3"
            >
              <ChevronLeft className="w-3 h-3" /> Back to Grimoire
            </button>
          )}

          {/* Section title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
            <div className="flex items-center gap-1.5 text-[#c9a84c]/50">
              <Wand2 className="w-3 h-3" />
              <span className="text-[9px] uppercase tracking-[0.2em]">The Alchemist&apos;s Contract</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
          </div>

          {/* Parchment card */}
          <div className="relative rounded-lg border border-[#c9a84c]/22 bg-gradient-to-b from-[#170d2e] to-[#0d0418] overflow-hidden shadow-[inset_0_1px_0_rgba(201,168,76,0.08)]">
            {/* Corner ornaments */}
            {[["top-2 left-2 border-t border-l"], ["top-2 right-2 border-t border-r"],
              ["bottom-2 left-2 border-b border-l"], ["bottom-2 right-2 border-b border-r"]].map(([cls], i) => (
              <div key={i} className={`absolute w-3 h-3 border-[#c9a84c]/25 ${cls}`} />
            ))}

            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Editable fields */}
              <EditableField value={title} onChange={setTitle} icon={Sparkles} label="宏願目標 · 點擊以編輯" />
              <EditableField value={deadline} onChange={setDeadline} icon={Calendar} label="命運期限 · 點擊以編輯" mono />

              <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/12 to-transparent" />

              {/* Difficulty slider */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-[#e8d5b7]/25">難度刻度</span>
                  <span className="text-xs text-[#c9a84c] font-semibold">
                    Lv.{difficulty} — {DIFFICULTY_LABELS[difficulty - 1]}
                  </span>
                </div>
                <input type="range" min={1} max={5} step={1} value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[#c9a84c] [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-[#0a0208] [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(201,168,76,0.6)]
                    [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{ background: `linear-gradient(to right, #c9a84c ${(difficulty - 1) * 25}%, #2d1b4e ${(difficulty - 1) * 25}%)` }}
                />
                <div className="flex justify-between">
                  {DIFFICULTY_LABELS.map((l, i) => (
                    <span key={i} className={`text-[8px] uppercase tracking-wide transition-colors duration-200 ${i + 1 === difficulty ? "text-[#c9a84c]" : "text-[#e8d5b7]/15"}`}>{l}</span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/12 to-transparent" />

              {/* Slot-machine rewards */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest text-[#e8d5b7]/25">預期報酬</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-[#c9a84c]/60" />
                    <span className={`text-base font-bold font-mono tabular-nums transition-colors duration-75 ${isRolling ? "text-[#c9a84c]/35" : "text-[#c9a84c]"}`}>
                      {displayGold}
                    </span>
                    <span className="text-[9px] text-[#e8d5b7]/20">金</span>
                  </div>
                  <div className="w-px h-4 bg-[#c9a84c]/10" />
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400/60" />
                    <span className={`text-base font-bold font-mono tabular-nums transition-colors duration-75 ${isRolling ? "text-purple-400/25" : "text-purple-400"}`}>
                      {displayXp}
                    </span>
                    <span className="text-[9px] text-[#e8d5b7]/20">XP</span>
                  </div>
                </div>
              </div>

              {/* Forge button */}
              <motion.button onClick={handleForge}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded border border-[#c9a84c]/45 bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#c9a84c]/18 hover:border-[#c9a84c]/70 hover:shadow-[0_0_20px_rgba(201,168,76,0.18)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" /> Forge Destiny
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

    </AnimatePresence>
  );
}
