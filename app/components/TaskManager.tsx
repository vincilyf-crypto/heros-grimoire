"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sword, Scroll, Shield, Star, Flame, Crown,
  CheckCircle2, Gift, Wallet, Circle, Swords, BookOpen, Trophy,
  Hourglass, Plus, X, AlertTriangle, Sparkles,
  Headphones, FileText, Coins, Zap,
} from "lucide-react";
import { type QuestNodeContent } from "./ConstellationTree";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Priority = "high" | "normal";

export interface Task {
  id: string; title: string; reward: number; completed: boolean;
  icon: string; priority?: Priority; deadline?: string;
}

export interface Reward {
  id: string; title: string; cost: number; icon: React.ElementType;
}

// Extends QuestNodeContent with routing info for cross-tab dispatch
export type ActiveTrial = QuestNodeContent & { questId: string; questTitle: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Sword, Scroll, Shield, Star, Flame, Crown,
  CheckCircle2, Gift, Wallet, Circle, Swords, BookOpen, Trophy,
  Hourglass, Plus, X, AlertTriangle, Sparkles,
  Headphones, FileText, Coins, Zap,
};

export const MAX_DAILY_SLOTS = 6;

export const INITIAL_TASKS: Record<"daily" | "weekly" | "monthly", Task[]> = {
  daily: [
    { id: "d1", title: "討伐晨間拖延魔",   reward: 25, completed: false, icon: "Sword",    priority: "high",   deadline: "06:00" },
    { id: "d2", title: "秘法冥想儀式",     reward: 10, completed: false, icon: "Flame",    priority: "normal", deadline: "12:00" },
    { id: "d3", title: "鐵人體能鍛鍊",     reward: 20, completed: false, icon: "Shield",   priority: "high",   deadline: "18:00" },
    { id: "d4", title: "古籍閱讀 20 頁",   reward: 15, completed: false, icon: "BookOpen", priority: "normal", deadline: "23:59" },
    { id: "d5", title: "整理今日任務卷軸", reward: 8,  completed: false, icon: "Scroll",   priority: "normal", deadline: "21:00" },
  ],
  weekly: [
    { id: "w1", title: "完成一個線上課程章節", reward: 60,  completed: false, icon: "Star"   },
    { id: "w2", title: "深度整理工作空間",     reward: 40,  completed: false, icon: "Shield" },
    { id: "w3", title: "與家人或朋友通話",     reward: 30,  completed: false, icon: "Flame"  },
    { id: "w4", title: "寫一篇週回顧日誌",     reward: 50,  completed: false, icon: "Scroll" },
  ],
  monthly: [
    { id: "m1", title: "完成一個 Side Project 功能", reward: 200, completed: false, icon: "Swords" },
    { id: "m2", title: "月儲蓄目標達標",             reward: 150, completed: false, icon: "Trophy" },
    { id: "m3", title: "安排並完成健康檢查",         reward: 120, completed: false, icon: "Star"   },
  ],
};

export const INITIAL_REWARDS: Reward[] = [
  { id: "r1", title: "吃一頓壽司大餐",     cost: 150,  icon: Gift     },
  { id: "r2", title: "購買一款新遊戲",     cost: 500,  icon: Trophy   },
  { id: "r3", title: "看一場電影",         cost: 80,   icon: Star     },
  { id: "r4", title: "買一本想看的書",     cost: 30,   icon: BookOpen },
  { id: "r5", title: "安排一次週末小旅行", cost: 1000, icon: Flame    },
];

const RUNE_WEEK = [
  { day: "一", completed: true  }, { day: "二", completed: true  },
  { day: "三", completed: true  }, { day: "四", completed: false },
  { day: "五", completed: false }, { day: "六", completed: false },
  { day: "日", completed: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isExpired(deadline: string): boolean {
  const now = new Date();
  const [h, m] = deadline.split(":").map(Number);
  const t = new Date(); t.setHours(h, m, 0, 0);
  return now > t;
}

// ─── RuneMatrix ───────────────────────────────────────────────────────────────

function RuneMatrix() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-3 h-3 text-[#c9a84c]/40" />
        <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/25">Weekly Runes of Consistency</span>
      </div>
      <div className="flex gap-2">
        {RUNE_WEEK.map((r, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              className={`w-8 h-8 rounded border flex items-center justify-center transition-all duration-500 ${
                r.completed
                  ? "border-[#c9a84c]/60 bg-[#c9a84c]/20 shadow-[0_0_8px_rgba(201,168,76,0.3)]"
                  : "border-[#e8d5b7]/8 bg-[#1a1a1b]"
              }`}
              initial={r.completed ? { scale: 0.8 } : {}} animate={r.completed ? { scale: 1 } : {}}
              transition={{ delay: i * 0.05 }}
            >
              {r.completed && <X className="w-3.5 h-3.5 text-[#c9a84c]" />}
            </motion.div>
            <span className="text-[9px] text-[#e8d5b7]/20">週{r.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TaskRow ──────────────────────────────────────────────────────────────────

function TaskRow({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
  const Icon = ICON_MAP[task.icon] ?? Scroll;
  const expired = task.deadline ? isExpired(task.deadline) : false;
  const isHigh  = task.priority === "high";

  let borderClass = "border-[#c9a84c]/20 hover:border-[#c9a84c]/40";
  if (task.completed) borderClass = "border-[#e8d5b7]/5";
  else if (isHigh) borderClass = expired
    ? "border-[#8b1a1a]/30"
    : "border-[#8b1a1a]/60 shadow-[0_0_12px_rgba(139,26,26,0.25)]";

  return (
    <motion.div layout className={`rounded border transition-all duration-500 ${borderClass} ${task.completed ? "bg-[#1a0a2e]/20 opacity-40" : "bg-[#1a0a2e]/40"}`}>
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded border flex items-center justify-center shrink-0 ${task.completed ? "border-[#e8d5b7]/10 bg-transparent" : isHigh ? "border-[#8b1a1a]/50 bg-[#8b1a1a]/10" : "border-[#c9a84c]/30 bg-[#c9a84c]/5"}`}>
            <Icon className={`w-4 h-4 ${task.completed ? "text-[#e8d5b7]/20" : isHigh ? "text-red-400/80" : "text-[#c9a84c]"}`} />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              {isHigh && !task.completed && <Flame className="w-3 h-3 text-red-500/70 shrink-0" />}
              <span className={`text-sm ${task.completed ? "line-through text-[#e8d5b7]/25" : "text-[#e8d5b7]"}`}>{task.title}</span>
            </div>
            {task.deadline && (
              <div className={`flex items-center gap-1 ${task.completed ? "opacity-30" : ""}`}>
                <Hourglass className={`w-2.5 h-2.5 shrink-0 ${expired ? "text-red-500/60" : "text-[#e8d5b7]/30"}`} />
                <span className={`text-[10px] font-mono ${expired ? "text-red-500/60" : "text-[#e8d5b7]/30"}`}>{task.deadline}</span>
                {expired && !task.completed && <span className="text-[10px] text-red-500/50 ml-0.5">· 已逾期</span>}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end gap-0.5">
            {expired && !task.completed
              ? <><span className="text-xs font-mono line-through text-[#4a4a4a]">+${task.reward}</span><span className="text-[10px] text-[#4a4a4a]">沒收</span></>
              : <span className={`text-xs font-mono ${task.completed ? "text-[#e8d5b7]/15" : "text-[#c9a84c]/70"}`}>+${task.reward}</span>
            }
          </div>
          <button onClick={() => onComplete(task.id)} disabled={task.completed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-all duration-300 ${task.completed ? "border-green-800/30 text-green-700/40 cursor-default" : expired ? "border-red-900/40 text-red-400/50 hover:bg-red-900/10 cursor-pointer" : "border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60 cursor-pointer"}`}
          >
            {task.completed ? <><CheckCircle2 className="w-3 h-3" /> 已完成</> : <><Circle className="w-3 h-3" /> 完成</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── EmptySlot ────────────────────────────────────────────────────────────────

function EmptySlot({ index }: { index: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 px-5 py-4 rounded border border-dashed border-[#c9a84c]/22 bg-[#0d0418]/30 hover:border-[#c9a84c]/40 hover:bg-[#0d0418]/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="w-9 h-9 rounded border border-dashed border-[#c9a84c]/18 flex items-center justify-center group-hover:border-[#c9a84c]/38 transition-colors">
        <Plus className="w-4 h-4 text-[#c9a84c]/22 group-hover:text-[#c9a84c]/45 transition-colors" />
      </div>
      <span className="text-sm text-[#e8d5b7]/18 group-hover:text-[#e8d5b7]/32 transition-colors italic">+ Add Quest to empty slot</span>
    </motion.div>
  );
}

// ─── EpicTrialRow ─────────────────────────────────────────────────────────────

function EpicTrialRow({ trial, onComplete }: { trial: ActiveTrial; onComplete: () => void }) {
  const Icon = trial.icon;
  return (
    <motion.div layout
      className="rounded border border-purple-500/28 bg-[#1a0a2e]/55 hover:border-purple-400/45 transition-all duration-300 shadow-[0_0_12px_rgba(139,92,246,0.08)]"
    >
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded border border-purple-500/35 bg-purple-500/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-purple-300/75" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#e8d5b7]">{trial.label}</span>
              <span className="text-[9px] uppercase tracking-widest text-purple-400/45 border border-purple-500/20 px-1.5 py-0.5 rounded">
                {trial.questTitle.length > 12 ? trial.questTitle.slice(0, 12) + "…" : trial.questTitle}
              </span>
            </div>
            <span className="text-[10px] text-[#e8d5b7]/32 leading-snug">{trial.description}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1">
              <Coins className="w-2.5 h-2.5 text-[#c9a84c]/45" />
              <span className="text-xs font-mono text-[#c9a84c]/65">+{trial.goldReward}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-purple-400/45" />
              <span className="text-[10px] font-mono text-purple-400/55">+{trial.xpReward} XP</span>
            </div>
          </div>
          <button onClick={onComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-purple-500/32 text-purple-300/65 hover:bg-purple-500/12 hover:border-purple-400/55 cursor-pointer transition-all duration-300"
          >
            <Circle className="w-3 h-3" /> 完成試煉
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── RewardRow ────────────────────────────────────────────────────────────────

function RewardRow({ reward, balance, onRedeem }: { reward: Reward; balance: number; onRedeem: (id: string) => void }) {
  const Icon = reward.icon;
  const canAfford = balance >= reward.cost;
  return (
    <motion.div layout className={`flex items-center justify-between px-5 py-4 rounded border transition-colors duration-300 ${canAfford ? "border-[#c9a84c]/25 bg-[#1a0a2e]/40 hover:border-[#c9a84c]/50" : "border-[#e8d5b7]/5 bg-[#1a0a2e]/20 opacity-50"}`}>
      <div className="flex items-center gap-4">
        <div className={`w-9 h-9 rounded border flex items-center justify-center ${canAfford ? "border-[#c9a84c]/30 bg-[#c9a84c]/5" : "border-[#e8d5b7]/10"}`}>
          <Icon className={`w-4 h-4 ${canAfford ? "text-[#c9a84c]" : "text-[#e8d5b7]/20"}`} />
        </div>
        <span className={`text-sm ${canAfford ? "text-[#e8d5b7]" : "text-[#e8d5b7]/30"}`}>{reward.title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-mono ${canAfford ? "text-red-400/80" : "text-[#e8d5b7]/15"}`}>-${reward.cost}</span>
        <button onClick={() => onRedeem(reward.id)} disabled={!canAfford}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-all duration-300 ${canAfford ? "border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/15 hover:border-[#c9a84c]/70 cursor-pointer" : "border-[#e8d5b7]/5 text-[#e8d5b7]/15 cursor-not-allowed"}`}
        >
          <Gift className="w-3 h-3" />
          {canAfford ? "兌換" : "餘額不足"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── TaskManager ──────────────────────────────────────────────────────────────

interface TaskManagerProps {
  activeTab: "daily" | "weekly" | "monthly" | "rewards";
  tasks: Record<"daily" | "weekly" | "monthly", Task[]>;
  balance: number;
  rewards: Reward[];
  activeEpicTrials: ActiveTrial[];
  onCompleteTask: (tab: "daily" | "weekly" | "monthly", taskId: string) => void;
  onRedeemReward: (rewardId: string) => void;
  onEpicNodeComplete: (questId: string, nodeId: number) => void;
}

export default function TaskManager({
  activeTab, tasks, balance, rewards, activeEpicTrials,
  onCompleteTask, onRedeemReward, onEpicNodeComplete,
}: TaskManagerProps) {
  const dailySlots: (Task | null)[] = [
    ...tasks.daily,
    ...Array(Math.max(0, MAX_DAILY_SLOTS - tasks.daily.length)).fill(null),
  ];

  return (
    <>
      {/* ── Daily ── */}
      {activeTab === "daily" && (
        <>
          <RuneMatrix />

          {/* Active Epic Trials cross-dispatched from constellation trees */}
          {activeEpicTrials.length > 0 && (
            <div className="flex flex-col gap-2 mb-1">
              <div className="flex items-center gap-2">
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-[10px] uppercase tracking-widest text-purple-400/65"
                >
                  ⚔️ Active Epic Trials
                </motion.span>
                <div className="flex-1 h-px bg-purple-500/15" />
                <span className="text-[10px] text-purple-400/35">{activeEpicTrials.length} pending</span>
              </div>
              {activeEpicTrials.map((trial) => (
                <EpicTrialRow
                  key={`${trial.questId}-${trial.id}`}
                  trial={trial}
                  onComplete={() => onEpicNodeComplete(trial.questId, trial.id)}
                />
              ))}
            </div>
          )}

          {/* Hexagram 6-slot board */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Scroll className="w-3.5 h-3.5 text-[#c9a84c]/50" />
              <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/30">今日六爻懸賞</span>
            </div>
            <span className="text-[10px] text-[#e8d5b7]/20">
              {tasks.daily.filter((t) => t.completed).length} / {MAX_DAILY_SLOTS} 完成
            </span>
          </div>
          {dailySlots.map((slot, i) =>
            slot
              ? <TaskRow key={slot.id} task={slot} onComplete={(id) => onCompleteTask("daily", id)} />
              : <EmptySlot key={`e${i}`} index={i} />
          )}
        </>
      )}

      {/* ── Weekly / Monthly ── */}
      {(activeTab === "weekly" || activeTab === "monthly") && (
        <>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Scroll className="w-3.5 h-3.5 text-[#c9a84c]/50" />
              <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/30">
                {activeTab === "weekly" ? "本週任務" : "本月任務"}
              </span>
            </div>
            <span className="text-[10px] text-[#e8d5b7]/20">
              {tasks[activeTab].filter((t) => t.completed).length} / {tasks[activeTab].length} 完成
            </span>
          </div>
          {tasks[activeTab].map((task) => (
            <TaskRow key={task.id} task={task} onComplete={(id) => onCompleteTask(activeTab, id)} />
          ))}
        </>
      )}

      {/* ── Rewards (Vault) ── */}
      {activeTab === "rewards" && (
        <>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Gift className="w-3.5 h-3.5 text-[#c9a84c]/50" />
              <span className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/30">可兌換獎勵</span>
            </div>
            <span className="text-[10px] text-[#e8d5b7]/20">餘額 ${balance}</span>
          </div>
          {rewards.map((r) => (
            <RewardRow key={r.id} reward={r} balance={balance} onRedeem={onRedeemReward} />
          ))}
          {balance === 0 && (
            <p className="text-center text-xs text-[#e8d5b7]/20 py-4">先完成任務賺取虛擬幣，再來兌換獎勵吧。</p>
          )}
        </>
      )}
    </>
  );
}
