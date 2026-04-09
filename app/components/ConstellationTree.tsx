"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Coins, Zap, Swords } from "lucide-react";

// ─── Exported types ────────────────────────────────────────────────────────────

export type NodeStatus = "locked" | "active" | "completed";

export interface QuestNodeContent {
  id: number;
  label: string;
  sub: string;
  description: string;
  icon: React.ElementType;
  goldReward: number;
  xpReward: number;
}

// ─── Exported constants (used by page.tsx) ─────────────────────────────────────

export const INITIAL_NODE_STATES: Record<number, NodeStatus> = {
  1: "active", 2: "locked", 3: "locked", 4: "locked", 5: "locked", 6: "locked",
};

const DIRECT_UNLOCKS: Record<number, number[]> = {
  1: [2, 3], 2: [4], 3: [5], 4: [], 5: [], 6: [],
};

export function applyUnlocks(
  completedId: number,
  current: Record<number, NodeStatus>,
): Record<number, NodeStatus> {
  const next = { ...current, [completedId]: "completed" as NodeStatus };
  DIRECT_UNLOCKS[completedId].forEach((dep) => {
    if (next[dep] === "locked") next[dep] = "active";
  });
  if (next[4] === "completed" && next[5] === "completed" && next[6] === "locked") {
    next[6] = "active";
  }
  return next;
}

// ─── Internal SVG layout ───────────────────────────────────────────────────────
// viewBox = "0 0 400 540"

const SVG_POS: Record<number, { cx: number; cy: number }> = {
  1: { cx: 200, cy: 72  },
  2: { cx: 88,  cy: 205 },
  3: { cx: 312, cy: 205 },
  4: { cx: 88,  cy: 352 },
  5: { cx: 312, cy: 352 },
  6: { cx: 200, cy: 472 },
};

const CONNECTIONS = [
  { from: 1, to: 2 }, { from: 1, to: 3 },
  { from: 2, to: 4 }, { from: 3, to: 5 },
  { from: 4, to: 6 }, { from: 5, to: 6 },
];

const BG_STARS = [
  { cx: 22,  cy: 22,  r: 0.9, o: 0.35 }, { cx: 378, cy: 38,  r: 1.3, o: 0.45 },
  { cx: 48,  cy: 105, r: 0.6, o: 0.25 }, { cx: 358, cy: 118, r: 0.8, o: 0.30 },
  { cx: 12,  cy: 210, r: 1.0, o: 0.40 }, { cx: 392, cy: 275, r: 0.7, o: 0.30 },
  { cx: 32,  cy: 435, r: 0.9, o: 0.35 }, { cx: 372, cy: 425, r: 1.1, o: 0.45 },
  { cx: 158, cy: 28,  r: 0.5, o: 0.20 }, { cx: 252, cy: 42,  r: 0.7, o: 0.25 },
  { cx: 142, cy: 508, r: 0.8, o: 0.30 }, { cx: 268, cy: 512, r: 0.6, o: 0.22 },
  { cx: 58,  cy: 285, r: 0.5, o: 0.20 }, { cx: 348, cy: 305, r: 0.6, o: 0.22 },
  { cx: 178, cy: 150, r: 0.4, o: 0.15 }, { cx: 228, cy: 390, r: 0.4, o: 0.15 },
];

// ─── Per-state visual config ───────────────────────────────────────────────────

const STATE_CFG: Record<NodeStatus, {
  r: number; fill: string; stroke: string; sw: number;
  iconColor: string; filter?: string;
}> = {
  locked:    { r: 19, fill: "#111118", stroke: "#2d2d2d",  sw: 1.5, iconColor: "#333" },
  active:    { r: 22, fill: "#1a0a2e", stroke: "#c9a84c",  sw: 2.5, iconColor: "#c9a84c", filter: "url(#glow-gold)"    },
  completed: { r: 22, fill: "#0d0820", stroke: "#f1e8d9",  sw: 2.5, iconColor: "#f1e8d9", filter: "url(#glow-intense)" },
};

function diamond(cx: number, cy: number, h: number) {
  return `${cx},${cy - h} ${cx + h},${cy} ${cx},${cy + h} ${cx - h},${cy}`;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  nodes: QuestNodeContent[];
  nodeStates: Record<number, NodeStatus>;
  onNodeComplete: (id: number) => void;
  questTitle?: string;
  onAbandon?: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ConstellationTree({
  nodes, nodeStates, onNodeComplete, questTitle, onAbandon,
}: Props) {
  const [bursting, setBursting]       = useState<Set<number>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [lastUnlocked, setLastUnlocked] = useState<number[]>([]);
  const prevStates = useRef(nodeStates);

  // Detect newly unlocked nodes from prop changes (driven by parent)
  useEffect(() => {
    const justUnlocked = Object.entries(nodeStates)
      .filter(([id, st]) => st === "active" && prevStates.current[Number(id)] === "locked")
      .map(([id]) => Number(id));
    prevStates.current = nodeStates;
    if (justUnlocked.length > 0) {
      setLastUnlocked(justUnlocked);
      const t = setTimeout(() => setLastUnlocked([]), 2200);
      return () => clearTimeout(t);
    }
  }, [nodeStates]);

  const completedCount = Object.values(nodeStates).filter((s) => s === "completed").length;

  function handleNodeClick(id: number) {
    if (nodeStates[id] !== "active") return;
    // Trigger local supernova VFX
    setBursting((prev) => new Set(prev).add(id));
    setTimeout(() => setBursting((prev) => { const s = new Set(prev); s.delete(id); return s; }), 900);
    // Notify parent to update persistent state
    onNodeComplete(id);
  }

  // Tooltip: find the hovered node's content and position
  const hoveredContent = hoveredNode !== null ? nodes.find((n) => n.id === hoveredNode) : null;
  const hoveredPos     = hoveredNode !== null ? SVG_POS[hoveredNode] : null;
  const tooltipToLeft  = hoveredPos ? hoveredPos.cx >= 250 : false;

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {questTitle && (
            <p className="text-sm font-semibold text-[#c9a84c] mb-0.5">{questTitle}</p>
          )}
          <p className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/25">
            {completedCount} / {nodes.length} nodes completed
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[9px] text-[#e8d5b7]/20 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d2d2d]" /> Locked
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c9a84c]" /> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f1e8d9]" /> Done
            </span>
          </div>
          {onAbandon && (
            <button
              onClick={onAbandon}
              className="text-[9px] uppercase tracking-widest text-[#e8d5b7]/15 hover:text-red-400/50 transition-colors"
            >
              Abandon
            </button>
          )}
        </div>
      </div>

      {/* Unlock toast */}
      <AnimatePresence>
        {lastUnlocked.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#c9a84c]/20 bg-[#c9a84c]/5 text-xs text-[#c9a84c]/70"
          >
            <Unlock className="w-3 h-3" />
            {nodes.filter((n) => lastUnlocked.includes(n.id)).map((n) => n.label).join("、")} 已解鎖
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG + Tooltip wrapper — paddingBottom holds aspect ratio 400:540 */}
      <div className="relative w-full" style={{ paddingBottom: "135%" }}>
        <svg
          viewBox="0 0 400 540"
          className="absolute inset-0 w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow-gold" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-intense" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-line" filterUnits="userSpaceOnUse" x="0" y="0" width="400" height="540">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Per-connection neon gradients */}
            {CONNECTIONS.map((c) => {
              const a = SVG_POS[c.from], b = SVG_POS[c.to];
              return (
                <linearGradient key={`g${c.from}-${c.to}`} id={`g${c.from}-${c.to}`}
                  gradientUnits="userSpaceOnUse" x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}>
                  <stop offset="0%"   stopColor="#c9a84c" />
                  <stop offset="50%"  stopColor="#f1e8d9" />
                  <stop offset="100%" stopColor="#c9a84c" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Decorative stars */}
          {BG_STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#e8d5b7" fillOpacity={s.o} />
          ))}

          {/* Connections */}
          {CONNECTIONS.map((c) => {
            const a = SVG_POS[c.from], b = SVG_POS[c.to];
            const lit = nodeStates[c.from] === "completed";
            return (
              <g key={`c${c.from}-${c.to}`}>
                {lit ? (
                  <>
                    <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                      stroke={`url(#g${c.from}-${c.to})`} strokeWidth={6} strokeLinecap="round"
                      filter="url(#glow-line)" className="neon-line" />
                    <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                      stroke={`url(#g${c.from}-${c.to})`} strokeWidth={1.8} strokeLinecap="round"
                      className="neon-line" />
                  </>
                ) : (
                  <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                    stroke="#2a2a2a" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="5 4" />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos  = SVG_POS[node.id];
            const st   = nodeStates[node.id] ?? "locked";
            const cfg  = STATE_CFG[st];
            const Icon = st === "locked" ? Lock : node.icon;
            const isBursting  = bursting.has(node.id);
            const isClickable = st === "active";
            const isCompleted = st === "completed";

            return (
              <g key={node.id}
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: isClickable ? "pointer" : "default" }}
              >
                {/* Supernova VFX */}
                <AnimatePresence>
                  {isBursting && (
                    <>
                      <motion.circle cx={pos.cx} cy={pos.cy} r={22} fill="none"
                        stroke="#f1e8d9" strokeWidth={2}
                        initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 4.5, opacity: 0 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                      <motion.circle cx={pos.cx} cy={pos.cy} r={28} fill="white"
                        initial={{ scale: 0.3, opacity: 0.85 }} animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                      <motion.circle cx={pos.cx} cy={pos.cy} r={22} fill="#c9a84c"
                        initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                    </>
                  )}
                </AnimatePresence>

                {/* Main circle */}
                <motion.circle cx={pos.cx} cy={pos.cy} r={cfg.r}
                  fill={cfg.fill} stroke={cfg.stroke} strokeWidth={cfg.sw}
                  filter={cfg.filter}
                  className={[
                    "cst-node",
                    st === "active"  ? "node-breathe" : "",
                    isBursting       ? "supernova"     : "",
                  ].join(" ")}
                  whileHover={isClickable ? { scale: 1.16 } : undefined}
                  whileTap={isClickable   ? { scale: 0.93 } : undefined}
                />

                {/* Inner diamond gem — completed */}
                {isCompleted && (
                  <polygon points={diamond(pos.cx, pos.cy, 9)}
                    fill="#c9a84c" filter="url(#glow-gold)" className="pointer-events-none" />
                )}

                {/* Lucide icon via foreignObject */}
                <foreignObject
                  x={pos.cx - 9} y={pos.cy - (isCompleted ? 16 : 9)}
                  width={18} height={18}
                  className="pointer-events-none"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px" }}>
                    <Icon size={12} color={cfg.iconColor} />
                  </div>
                </foreignObject>

                {/* Sub label below circle */}
                <text x={pos.cx} y={pos.cy + cfg.r + 14}
                  textAnchor="middle" fontSize="9" fill={cfg.iconColor}
                  letterSpacing="0.07em" className="pointer-events-none select-none"
                  opacity={st === "locked" ? 0.35 : 0.7}
                >
                  {node.sub.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ── HTML Tooltip Overlay ── */}
        <AnimatePresence>
          {hoveredContent && hoveredPos && (
            <motion.div
              key={hoveredContent.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-48 pointer-events-none"
              style={{
                left: `${(hoveredPos.cx / 400) * 100}%`,
                top:  `${(hoveredPos.cy / 540) * 100}%`,
                transform: tooltipToLeft
                  ? "translate(calc(-100% - 18px), -50%)"
                  : "translate(18px, -50%)",
              }}
            >
              {/* Glassmorphism card */}
              <div className="rounded-lg border border-[#c9a84c]/25 bg-black/85 backdrop-blur-md p-3 shadow-xl">
                {/* Node status badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#e8d5b7]/30">
                    {nodeStates[hoveredContent.id] === "locked"    && "🔒 Locked"}
                    {nodeStates[hoveredContent.id] === "active"    && "⚡ Active"}
                    {nodeStates[hoveredContent.id] === "completed" && "✦ Completed"}
                  </span>
                  {nodeStates[hoveredContent.id] === "active" && (
                    <span className="text-[9px] text-[#c9a84c]/60 italic">click to complete</span>
                  )}
                </div>

                {/* Title */}
                <p className="text-sm font-semibold text-[#c9a84c] mb-0.5">{hoveredContent.label}</p>
                <p className="text-[10px] text-[#e8d5b7]/40 leading-snug mb-3">{hoveredContent.description}</p>

                {/* Rewards */}
                <div className="flex items-center gap-3 pt-2 border-t border-[#c9a84c]/10">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-[#c9a84c]/60" />
                    <span className="text-xs font-mono text-[#c9a84c]">{hoveredContent.goldReward}</span>
                    <span className="text-[9px] text-[#e8d5b7]/20">G</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-400/60" />
                    <span className="text-xs font-mono text-purple-400">{hoveredContent.xpReward}</span>
                    <span className="text-[9px] text-[#e8d5b7]/20">XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion banner */}
      <AnimatePresence>
        {completedCount === nodes.length && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-3 rounded border border-[#c9a84c]/30 bg-[#c9a84c]/8 text-sm text-[#c9a84c] tracking-wider">
            <Swords className="w-4 h-4" />
            星座完成 — 傳奇已銘刻於天際
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
