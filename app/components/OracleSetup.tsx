"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Loader2, Calendar, Coins, Zap,
  Shield, Sword, Star, Trophy, Lock, ChevronRight,
  Flame, Wand2, RotateCcw,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase = "oracle" | "parsing" | "contract" | "skilltree";

interface SkillNode {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: "active" | "locked";
  icon: React.ElementType;
}

interface ForgedContract {
  title: string;
  deadline: string;
  difficulty: number;
  gold: number;
  xp: number;
  nodes: SkillNode[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS = ["旅人", "冒險者", "勇士", "英雄", "傳說"];
const GOLD_TABLE = [50, 120, 200, 350, 500];
const XP_TABLE = [100, 250, 450, 700, 1000];

function calcRewards(d: number) {
  return { gold: GOLD_TABLE[d - 1], xp: XP_TABLE[d - 1] };
}

function generateNodes(goal: string): SkillNode[] {
  const trimmed = goal.length > 14 ? goal.slice(0, 14) + "…" : goal;
  return [
    {
      id: "n1", status: "active", icon: Shield,
      title: "基礎奠基",
      description: "構築知識根基，以穩固的地基承載未來高塔",
      xpReward: 100,
    },
    {
      id: "n2", status: "locked", icon: Sword,
      title: "技能鍛造",
      description: "在熔爐中淬煉，深化並整合核心技能",
      xpReward: 200,
    },
    {
      id: "n3", status: "locked", icon: Star,
      title: "試煉磨礪",
      description: "以模擬實戰驗證你的力量，尋找弱點並修正",
      xpReward: 300,
    },
    {
      id: "n4", status: "locked", icon: Trophy,
      title: `征服：${trimmed}`,
      description: "史詩終章——見證你的傳奇在此刻誕生",
      xpReward: 500,
    },
  ];
}

// ─── Phase 1: Oracle Crystal ───────────────────────────────────────────────────

function OracleCrystal({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && value.trim()) onSubmit(value.trim());
  }

  return (
    <motion.div
      key="oracle"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12"
    >
      {/* Ambient orb glow */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-[#c9a84c]/10 blur-3xl scale-150" />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 rounded-full border border-[#c9a84c]/40 bg-gradient-to-br from-[#1a0a2e] to-[#0a0208] flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.2)]"
        >
          <Sparkles className="w-8 h-8 text-[#c9a84c]" />
        </motion.div>
      </div>

      <h2 className="text-[#c9a84c] text-lg font-semibold tracking-widest uppercase mb-1">
        The Oracle&apos;s Crystal
      </h2>
      <p className="text-[#e8d5b7]/30 text-xs uppercase tracking-widest mb-8">
        許下你的宏願，讓命運來解讀
      </p>

      {/* Input field */}
      <div className="w-full max-w-md relative">
        <motion.div
          animate={{ opacity: value ? 1 : 0.4 }}
          className="absolute -inset-px rounded-lg bg-gradient-to-r from-[#c9a84c]/0 via-[#c9a84c]/30 to-[#c9a84c]/0 blur-sm"
        />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Whisper your ambition to the Oracle..."
          className="relative w-full bg-[#0d0418]/80 border border-[#c9a84c]/25 rounded-lg px-5 py-4 text-sm text-[#e8d5b7] placeholder-[#e8d5b7]/20 outline-none focus:border-[#c9a84c]/60 focus:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300 text-center tracking-wide"
        />
      </div>

      <p className="mt-4 text-[10px] text-[#e8d5b7]/15 uppercase tracking-widest">
        按下 Enter 召喚命運
      </p>
    </motion.div>
  );
}

// ─── Parsing State ─────────────────────────────────────────────────────────────

function ParsingState() {
  return (
    <motion.div
      key="parsing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-[#c9a84c]/60" />
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-[#c9a84c]/70 tracking-widest">Oracle 正在解析命運</p>
        <motion.div
          className="flex gap-1"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-[#c9a84c]/40" />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Inline Edit Field ─────────────────────────────────────────────────────────

function EditableField({
  value, onChange, icon: Icon, label, mono,
}: {
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  label: string;
  mono?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() { setEditing(false); }

  return (
    <div className="flex items-start gap-3">
      <Icon className="w-3.5 h-3.5 text-[#c9a84c]/50 mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/25">{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className={`bg-[#0d0418]/80 border border-[#c9a84c]/40 rounded px-2 py-1 text-sm text-[#e8d5b7] outline-none w-full ${mono ? "font-mono" : ""}`}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className={`text-sm text-left text-[#e8d5b7] hover:text-[#c9a84c] border-b border-dashed border-[#c9a84c]/20 hover:border-[#c9a84c]/50 transition-colors duration-200 pb-0.5 truncate ${mono ? "font-mono" : ""}`}
            title="點擊編輯"
          >
            {value}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Phase 2: Alchemist's Contract ─────────────────────────────────────────────

function AlchemistContract({
  initialGoal,
  onForge,
}: {
  initialGoal: string;
  onForge: (contract: ForgedContract) => void;
}) {
  const [title, setTitle] = useState(initialGoal);
  const [deadline, setDeadline] = useState("2026/07/07");
  const [difficulty, setDifficulty] = useState(3);
  const [displayGold, setDisplayGold] = useState(calcRewards(3).gold);
  const [displayXp, setDisplayXp] = useState(calcRewards(3).xp);
  const [isRolling, setIsRolling] = useState(false);

  // Slot machine effect on difficulty change
  useEffect(() => {
    const target = calcRewards(difficulty);
    setIsRolling(true);

    let ticks = 0;
    const TOTAL_TICKS = 16;
    const interval = setInterval(() => {
      ticks++;
      if (ticks < TOTAL_TICKS) {
        // Rapidly scramble
        setDisplayGold(Math.floor(Math.random() * 800 + 30));
        setDisplayXp(Math.floor(Math.random() * 1200 + 80));
      } else {
        clearInterval(interval);
        setDisplayGold(target.gold);
        setDisplayXp(target.xp);
        setIsRolling(false);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [difficulty]);

  function handleForge() {
    onForge({
      title,
      deadline,
      difficulty,
      gold: calcRewards(difficulty).gold,
      xp: calcRewards(difficulty).xp,
      nodes: generateNodes(title),
    });
  }

  return (
    <motion.div
      key="contract"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="py-4"
    >
      {/* Contract header */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a84c]/30" />
        <div className="flex items-center gap-2 text-[#c9a84c]/60">
          <Wand2 className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-[0.2em]">The Alchemist&apos;s Contract</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a84c]/30" />
      </div>

      {/* Parchment card */}
      <div className="relative rounded-lg border border-[#c9a84c]/25 bg-gradient-to-b from-[#170d2e] to-[#0d0418] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(201,168,76,0.1)]">

        {/* Corner ornaments */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c9a84c]/30" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c9a84c]/30" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c9a84c]/30" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c9a84c]/30" />

        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Goal + Deadline editable fields */}
          <div className="flex flex-col gap-4">
            <EditableField
              value={title}
              onChange={setTitle}
              icon={Sparkles}
              label="宏願目標 · 點擊以編輯"
            />
            <EditableField
              value={deadline}
              onChange={setDeadline}
              icon={Calendar}
              label="命運期限 · 點擊以編輯"
              mono
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/15 to-transparent" />

          {/* Difficulty slider */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/30">
                難度刻度 · The Scales
              </span>
              <span className="text-xs text-[#c9a84c] font-semibold tracking-wider">
                Lv.{difficulty} — {DIFFICULTY_LABELS[difficulty - 1]}
              </span>
            </div>

            {/* Custom slider */}
            <div className="relative">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[#c9a84c]
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-[#0a0208]
                  [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(201,168,76,0.6)]
                  [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #c9a84c ${(difficulty - 1) * 25}%, #2d1b4e ${(difficulty - 1) * 25}%)`,
                }}
              />
              {/* Tick labels */}
              <div className="flex justify-between mt-1.5">
                {DIFFICULTY_LABELS.map((label, i) => (
                  <span
                    key={i}
                    className={`text-[9px] uppercase tracking-wide transition-colors duration-200 ${
                      i + 1 === difficulty ? "text-[#c9a84c]" : "text-[#e8d5b7]/15"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/15 to-transparent" />

          {/* Slot Machine Rewards */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/30">
              預期報酬
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#c9a84c]/70" />
                <motion.span
                  key={displayGold}
                  className={`text-base font-bold font-mono tabular-nums transition-colors duration-100 ${
                    isRolling ? "text-[#c9a84c]/40" : "text-[#c9a84c]"
                  }`}
                >
                  {displayGold}
                </motion.span>
                <span className="text-[10px] text-[#e8d5b7]/20">金</span>
              </div>
              <div className="w-px h-4 bg-[#c9a84c]/10" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400/70" />
                <motion.span
                  key={displayXp}
                  className={`text-base font-bold font-mono tabular-nums transition-colors duration-100 ${
                    isRolling ? "text-purple-400/30" : "text-purple-400"
                  }`}
                >
                  {displayXp}
                </motion.span>
                <span className="text-[10px] text-[#e8d5b7]/20">XP</span>
              </div>
            </div>
          </div>

          {/* Forge button */}
          <motion.button
            onClick={handleForge}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded border border-[#c9a84c]/50 bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#c9a84c]/20 hover:border-[#c9a84c]/80 hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4" />
            Forge Destiny
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Phase 3: Skill Tree ───────────────────────────────────────────────────────

function SkillTree({ contract, onReset }: { contract: ForgedContract; onReset: () => void }) {
  return (
    <motion.div
      key="skilltree"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/25 mb-1">史詩任務已鑄造</p>
          <h3 className="text-[#c9a84c] font-semibold text-base leading-snug">{contract.title}</h3>
          <p className="text-xs text-[#e8d5b7]/30 mt-0.5 font-mono">
            期限：{contract.deadline} · {DIFFICULTY_LABELS[contract.difficulty - 1]}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3 h-3 text-[#c9a84c]/60" />
            <span className="text-sm font-bold font-mono text-[#c9a84c]">{contract.gold}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-purple-400/60" />
            <span className="text-sm font-bold font-mono text-purple-400">{contract.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-[#c9a84c]/10" />
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#e8d5b7]/20">Skill Tree</span>
        <div className="h-px flex-1 bg-[#c9a84c]/10" />
      </div>

      {/* Tree nodes */}
      <div className="flex flex-col items-center">
        {contract.nodes.map((node, idx) => {
          const Icon = node.icon;
          const isActive = node.status === "active";

          return (
            <div key={node.id} className="flex flex-col items-center w-full">
              {/* Connector line (not before first node) */}
              {idx > 0 && (
                <div className="flex flex-col items-center py-1">
                  <div className="w-px h-6 border-l border-dashed border-[#c9a84c]/20" />
                  <ChevronRight
                    className="w-3 h-3 text-[#c9a84c]/15 rotate-90"
                  />
                </div>
              )}

              {/* Node card */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className={`w-full rounded border px-5 py-4 flex items-center gap-4 transition-all duration-500 ${
                  isActive
                    ? "border-[#c9a84c]/50 bg-[#1a0a2e]/60 shadow-[0_0_16px_rgba(201,168,76,0.12)]"
                    : "border-[#e8d5b7]/5 bg-[#0d0418]/40 opacity-50"
                }`}
              >
                {/* Icon */}
                <div className={`relative w-10 h-10 rounded border flex items-center justify-center shrink-0 ${
                  isActive
                    ? "border-[#c9a84c]/50 bg-[#c9a84c]/10 shadow-[0_0_10px_rgba(201,168,76,0.2)]"
                    : "border-[#e8d5b7]/10 bg-transparent"
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#c9a84c]" : "text-[#e8d5b7]/20"}`} />
                  {!isActive && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0a0208] border border-[#e8d5b7]/10 flex items-center justify-center">
                      <Lock className="w-2 h-2 text-[#e8d5b7]/20" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-medium ${isActive ? "text-[#e8d5b7]" : "text-[#e8d5b7]/25"}`}>
                      {node.title}
                    </span>
                    {isActive && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[9px] uppercase tracking-widest text-[#c9a84c] border border-[#c9a84c]/30 px-1.5 py-0.5 rounded"
                      >
                        進行中
                      </motion.span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${isActive ? "text-[#e8d5b7]/40" : "text-[#e8d5b7]/15"}`}>
                    {node.description}
                  </p>
                </div>

                {/* XP badge */}
                <div className={`text-right shrink-0 ${isActive ? "" : "opacity-30"}`}>
                  <div className="flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-purple-400/60" />
                    <span className="text-xs font-mono text-purple-400/70">+{node.xpReward}</span>
                  </div>
                  <span className="text-[9px] text-[#e8d5b7]/20">XP</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="mt-8 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#e8d5b7]/15 hover:text-[#e8d5b7]/40 transition-colors duration-200 mx-auto"
      >
        <RotateCcw className="w-3 h-3" />
        重新召喚 Oracle
      </button>
    </motion.div>
  );
}

// ─── Root Component ────────────────────────────────────────────────────────────

export default function OracleSetup() {
  const [phase, setPhase] = useState<Phase>("oracle");
  const [goalText, setGoalText] = useState("");
  const [contract, setContract] = useState<ForgedContract | null>(null);

  function handleOracleSubmit(goal: string) {
    setGoalText(goal);
    setPhase("parsing");
    setTimeout(() => setPhase("contract"), 1000);
  }

  function handleForge(c: ForgedContract) {
    setContract(c);
    setPhase("skilltree");
  }

  function handleReset() {
    setGoalText("");
    setContract(null);
    setPhase("oracle");
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "oracle" && (
        <OracleCrystal key="oracle" onSubmit={handleOracleSubmit} />
      )}
      {phase === "parsing" && (
        <ParsingState key="parsing" />
      )}
      {phase === "contract" && (
        <AlchemistContract key="contract" initialGoal={goalText} onForge={handleForge} />
      )}
      {phase === "skilltree" && contract && (
        <SkillTree key="skilltree" contract={contract} onReset={handleReset} />
      )}
    </AnimatePresence>
  );
}
