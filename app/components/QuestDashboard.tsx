"use client";

import { motion } from "framer-motion";
import {
  Plus, Swords, Crown, Star, Trophy,
  Shield, Flame, BookOpen, Sparkles, ScrollText,
} from "lucide-react";
import { type ForgedContract } from "./ContractForm";
import { type NodeStatus } from "./ConstellationTree";

// ─── Exported type ─────────────────────────────────────────────────────────────

export interface EpicQuest {
  id: string;
  title: string;
  status: "active" | "completed";
  contract: ForgedContract;
  nodeStates: Record<number, NodeStatus>;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const TOTEM_ICONS: React.ElementType[] = [
  Swords, Crown, Star, Trophy, Shield, Flame, BookOpen, Sparkles,
];

/** Deterministic icon from quest ID so the same quest always has the same icon. */
function getTotemIcon(id: string): React.ElementType {
  let hash = 0;
  for (const c of id) hash = (hash + c.charCodeAt(0)) & 0xff;
  return TOTEM_ICONS[hash % TOTEM_ICONS.length];
}

function getCompletedCount(nodeStates: Record<number, NodeStatus>): number {
  return Object.values(nodeStates).filter((s) => s === "completed").length;
}

// ─── Quest Totem Card ──────────────────────────────────────────────────────────

function QuestTotem({
  quest, onClick, index,
}: { quest: EpicQuest; onClick: () => void; index: number }) {
  const Icon = getTotemIcon(quest.id);
  const completed = getCompletedCount(quest.nodeStates);
  const total = Object.keys(quest.nodeStates).length;
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const isLegend = quest.status === "completed";

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.02, borderColor: isLegend ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.45)" }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left rounded-lg border p-4 flex flex-col gap-3 cursor-pointer transition-colors duration-300 ${
        isLegend
          ? "border-[#c9a84c]/30 bg-gradient-to-b from-[#1a0a2e]/60 to-[#0d0418]/60"
          : "border-[#c9a84c]/18 bg-[#0d0418]/50 hover:bg-[#0d0418]/70"
      }`}
    >
      {/* Top row: icon + title */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded border flex items-center justify-center shrink-0 ${
          isLegend
            ? "border-[#c9a84c]/50 bg-[#c9a84c]/12 shadow-[0_0_10px_rgba(201,168,76,0.2)]"
            : "border-[#c9a84c]/22 bg-[#c9a84c]/6"
        }`}>
          <Icon className={`w-4 h-4 ${isLegend ? "text-[#c9a84c]" : "text-[#c9a84c]/60"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug truncate ${isLegend ? "text-[#e8d5b7]" : "text-[#e8d5b7]/80"}`}>
            {quest.title}
          </p>
          <p className="text-[10px] text-[#e8d5b7]/30 mt-0.5 font-mono">
            {quest.contract.deadline} · {["旅人","冒險者","勇士","英雄","傳說"][quest.contract.difficulty - 1]}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#e8d5b7]/25 uppercase tracking-widest">Nodes</span>
          <span className="text-[10px] font-mono text-[#c9a84c]/60">{completed} / {total}</span>
        </div>
        <div className="h-0.5 w-full bg-[#e8d5b7]/8 rounded-full">
          <motion.div
            className={`h-0.5 rounded-full ${isLegend ? "bg-[#c9a84c]" : "bg-[#c9a84c]/70"}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.06 + 0.1 }}
          />
        </div>
      </div>

      {/* Status badge */}
      {isLegend ? (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#c9a84c] border border-[#c9a84c]/35 px-1.5 py-0.5 rounded">
            ✦ Legend
          </span>
        </div>
      ) : (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/70 shadow-[0_0_4px_rgba(74,222,128,0.5)]" />
          <span className="text-[9px] uppercase tracking-widest text-green-400/60">Active</span>
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  quests: EpicQuest[];
  onSelectQuest: (id: string) => void;
  onForgeNew: () => void;
}

export default function QuestDashboard({ quests, onSelectQuest, onForgeNew }: Props) {
  const activeCount    = quests.filter((q) => q.status === "active").length;
  const completedCount = quests.filter((q) => q.status === "completed").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#c9a84c] tracking-wider">Grimoire Archives</h2>
          <p className="text-[10px] text-[#e8d5b7]/30 mt-0.5 uppercase tracking-widest">
            {activeCount} active · {completedCount} legends
          </p>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-[#e8d5b7]/20 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/50" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/60" /> Legend
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/15 to-transparent" />

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Quest Totems */}
        {quests.map((quest, i) => (
          <QuestTotem
            key={quest.id}
            quest={quest}
            onClick={() => onSelectQuest(quest.id)}
            index={i}
          />
        ))}

        {/* Forge New Destiny card */}
        <motion.button
          onClick={onForgeNew}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: quests.length * 0.06 }}
          whileHover={{ scale: 1.02, borderColor: "rgba(201,168,76,0.5)" }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg border-2 border-dashed border-[#c9a84c]/18 bg-[#0d0418]/25 p-4 flex flex-col items-center justify-center gap-2.5 cursor-pointer hover:bg-[#0d0418]/50 transition-colors duration-300 min-h-[148px]"
        >
          <div className="w-10 h-10 rounded-full border border-dashed border-[#c9a84c]/30 flex items-center justify-center bg-[#c9a84c]/5">
            <Plus className="w-5 h-5 text-[#c9a84c]/40" />
          </div>
          <div className="text-center">
            <p className="text-xs text-[#e8d5b7]/35 font-semibold tracking-wider">Forge New Destiny</p>
            <p className="text-[9px] text-[#e8d5b7]/18 mt-0.5 uppercase tracking-widest">New Quest</p>
          </div>
        </motion.button>
      </div>

      {/* Empty state copy */}
      {quests.length === 0 && (
        <div className="col-span-2 flex flex-col items-center gap-2 py-6 text-center">
          <ScrollText className="w-7 h-7 text-[#c9a84c]/18" />
          <p className="text-sm text-[#e8d5b7]/20">The Grimoire awaits its first legend.</p>
          <p className="text-[10px] text-[#e8d5b7]/12 uppercase tracking-widest">Forge a destiny to begin your journey</p>
        </div>
      )}
    </div>
  );
}
