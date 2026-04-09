"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sword, Wallet, AlertTriangle,
  Flame, Star, Crown, Gift, Sparkles, ChevronLeft,
  BookOpen, Scroll, FileText, Headphones, Trophy,
} from "lucide-react";
import ConstellationTree, {
  type NodeStatus, type QuestNodeContent,
  INITIAL_NODE_STATES, applyUnlocks,
} from "./components/ConstellationTree";
import ContractForm, { type ForgedContract } from "./components/ContractForm";
import QuestDashboard, { type EpicQuest } from "./components/QuestDashboard";
import TaskManager, {
  type Task, type Reward, type ActiveTrial,
  INITIAL_TASKS, INITIAL_REWARDS, MAX_DAILY_SLOTS, isExpired,
} from "./components/TaskManager";

// ─── useLocalStorage ───────────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch { /* ignore parse errors */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* quota */ }
      return next;
    });
  }, [key]);

  return [value, set] as const;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type TabId = "daily" | "weekly" | "monthly" | "rewards" | "epic";

// ─── Quest node templates ──────────────────────────────────────────────────────

const NODE_TEMPLATES: Omit<QuestNodeContent, "goldReward" | "xpReward">[] = [
  { id: 1, label: "源點", sub: "Origin",   icon: Sparkles,   description: "踏上旅途的第一步，千里之行始於足下" },
  { id: 2, label: "探索", sub: "Explore",  icon: BookOpen,   description: "深入未知領域，累積知識與核心基礎" },
  { id: 3, label: "鍛造", sub: "Forge",    icon: Scroll,     description: "在熔爐中淬煉，將知識化為核心技能" },
  { id: 4, label: "精通", sub: "Mastery",  icon: FileText,   description: "反覆實踐使完美，突破自身的極限邊界" },
  { id: 5, label: "試煉", sub: "Trial",    icon: Headphones, description: "以實戰驗證你的力量，尋找弱點並修正" },
  { id: 6, label: "征服", sub: "Conquest", icon: Trophy,     description: "史詩終章——見證你的傳奇在此刻誕生" },
];

const NODE_GOLD_PCT = [0.08, 0.12, 0.12, 0.18, 0.18, 0.32];
const NODE_XP_PCT   = [0.08, 0.12, 0.12, 0.18, 0.18, 0.32];

function generateQuestNodes(contract: ForgedContract): QuestNodeContent[] {
  return NODE_TEMPLATES.map((t, i) => ({
    ...t,
    goldReward: Math.max(1, Math.round(contract.totalGold * NODE_GOLD_PCT[i])),
    xpReward:   Math.max(1, Math.round(contract.totalXp   * NODE_XP_PCT[i])),
  }));
}

// ─── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "daily",   label: "每日", icon: Flame    },
  { id: "weekly",  label: "每週", icon: Star     },
  { id: "monthly", label: "每月", icon: Crown    },
  { id: "rewards", label: "金庫", icon: Gift     },
  { id: "epic",    label: "史詩", icon: Sparkles },
];

// ─── WalletBar ────────────────────────────────────────────────────────────────

function WalletBar({ balance, lastDelta, forfeit }: {
  balance: number; lastDelta: number | null; forfeit: string | null;
}) {
  return (
    <div className="border-b border-[#c9a84c]/15 bg-[#0d0418]/60">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#c9a84c]/40 flex items-center justify-center bg-[#c9a84c]/5">
            <Wallet className="w-4 h-4 text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#e8d5b7]/30">虛擬錢包</p>
            <div className="flex items-baseline gap-2">
              <motion.span key={balance}
                initial={{ scale: 1.3, color: "#f0c96e" }} animate={{ scale: 1, color: "#c9a84c" }}
                transition={{ duration: 0.4 }}
                className="text-xl font-bold font-mono text-[#c9a84c]"
              >
                ${balance}
              </motion.span>
              <AnimatePresence>
                {lastDelta !== null && (
                  <motion.span key={String(lastDelta) + Date.now()}
                    initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -16 }}
                    exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
                    className={`text-sm font-mono font-bold ${lastDelta > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {lastDelta > 0 ? `+$${lastDelta}` : `-$${Math.abs(lastDelta)}`}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-[#e8d5b7]/20 uppercase tracking-widest">純虛擬 · 非真實金流</p>
      </div>
      <AnimatePresence>
        {forfeit && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="flex items-center gap-2 px-8 py-2 bg-[#8b1a1a]/20 border-t border-[#8b1a1a]/30"
          >
            <AlertTriangle className="w-3 h-3 text-red-400/70 shrink-0" />
            <span className="text-xs text-red-400/70">{forfeit}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export default function Home() {
  // ── Persisted state ──────────────────────────────────────────────────────────
  const [balance,      setBalance]      = useLocalStorage<number>("hg_balance", 0);
  const [tasks,        setTasks]        = useLocalStorage("hg_tasks", INITIAL_TASKS);
  const [questArchive, setQuestArchive] = useLocalStorage<EpicQuest[]>("hg_quest_archive", []);

  // ── Ephemeral state ───────────────────────────────────────────────────────────
  const [lastDelta,       setLastDelta]       = useState<number | null>(null);
  const [forfeit,         setForfeit]         = useState<string | null>(null);
  const [activeTab,       setActiveTab]       = useState<TabId>("daily");
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [showContract,    setShowContract]    = useState(false);
  const [rewards]                             = useState(INITIAL_REWARDS);

  // ── Derived: active epic trials across all active quests ──────────────────────
  const activeEpicTrials: ActiveTrial[] = questArchive
    .filter((q) => q.status === "active")
    .flatMap((q) => {
      const nodes = generateQuestNodes(q.contract);
      return nodes
        .filter((n) => q.nodeStates[n.id] === "active")
        .map((n) => ({ ...n, questId: q.id, questTitle: q.title }));
    });

  const hasEpicBadge = activeEpicTrials.length > 0 && activeTab !== "epic";

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function applyDelta(delta: number) {
    setBalance((b) => b + delta);
    setLastDelta(delta);
    setTimeout(() => setLastDelta(null), 1500);
  }

  function showForfeit(msg: string) {
    setForfeit(msg);
    setTimeout(() => setForfeit(null), 3000);
  }

  function handleCompleteTask(tab: "daily" | "weekly" | "monthly", taskId: string) {
    const task = tasks[tab].find((t) => t.id === taskId);
    if (!task || task.completed) return;
    setTasks((prev) => ({ ...prev, [tab]: prev[tab].map((t) => t.id === taskId ? { ...t, completed: true } : t) }));
    if (task.deadline && isExpired(task.deadline)) {
      showForfeit(`「${task.title}」已逾期，+$${task.reward} 獎勵已沒收。`);
    } else {
      applyDelta(task.reward);
    }
  }

  function handleRedeemReward(rewardId: string) {
    const r = rewards.find((r) => r.id === rewardId);
    if (!r || balance < r.cost) return;
    applyDelta(-r.cost);
  }

  /** Creates a brand-new EpicQuest and adds it to the archive. */
  function handleForgeDestiny(contract: ForgedContract) {
    const newQuest: EpicQuest = {
      id: `quest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: contract.title,
      status: "active",
      contract,
      nodeStates: { ...INITIAL_NODE_STATES },
    };
    setQuestArchive((prev) => [...prev, newQuest]);
    setSelectedQuestId(newQuest.id);
    setShowContract(false);
    setActiveTab("epic");
  }

  /**
   * Completes a node inside a specific quest.
   * Rewards wallet, unlocks next nodes, and auto-archives quest if all 6 nodes done.
   */
  function handleEpicNodeComplete(questId: string, nodeId: number) {
    // Compute gold reward outside the updater to avoid Strict Mode double-invoke
    const quest = questArchive.find((q) => q.id === questId);
    const node  = quest ? generateQuestNodes(quest.contract).find((n) => n.id === nodeId) : null;

    setQuestArchive((prev) => prev.map((q) => {
      if (q.id !== questId) return q;
      const newNodeStates = applyUnlocks(nodeId, q.nodeStates);
      const allDone = Object.values(newNodeStates).every((s) => s === "completed");
      return { ...q, nodeStates: newNodeStates, status: allDone ? "completed" : "active" };
    }));

    if (node) applyDelta(node.goldReward);
  }

  // ── Derived ───────────────────────────────────────────────────────────────────

  // Resolve selected quest (guard against stale IDs after page restore)
  const selectedQuest = questArchive.find((q) => q.id === selectedQuestId) ?? null;

  const isTaskTab = (activeTab === "daily" || activeTab === "weekly" || activeTab === "monthly" || activeTab === "rewards");

  return (
    <div className="min-h-screen bg-[#0a0208] text-[#e8d5b7]">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#c9a84c]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#c9a84c]/50 flex items-center justify-center">
            <Sword className="w-4 h-4 text-[#c9a84c]" />
          </div>
          <span className="text-[#c9a84c] font-semibold tracking-widest text-sm uppercase">Hero&apos;s Grimoire</span>
        </div>
        <span className="text-xs text-[#e8d5b7]/20 uppercase tracking-widest">Life RPG Mission Tracker</span>
      </nav>

      <WalletBar balance={balance} lastDelta={lastDelta} forfeit={forfeit} />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 p-1 rounded border border-[#c9a84c]/15 bg-[#0d0418]/60">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30" : "text-[#e8d5b7]/30 hover:text-[#e8d5b7]/60"}`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
                {tab.id === "epic" && hasEpicBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >

            {/* ── Daily / Weekly / Monthly / Vault ── */}
            {isTaskTab && (
              <TaskManager
                activeTab={activeTab as "daily" | "weekly" | "monthly" | "rewards"}
                tasks={tasks}
                balance={balance}
                rewards={rewards}
                activeEpicTrials={activeEpicTrials}
                onCompleteTask={handleCompleteTask}
                onRedeemReward={handleRedeemReward}
                onEpicNodeComplete={handleEpicNodeComplete}
              />
            )}

            {/* ── Epic Quests ── */}
            {activeTab === "epic" && (
              <AnimatePresence mode="wait">

                {/* View A: Constellation Tree drill-down */}
                {selectedQuest && !showContract && (
                  <motion.div key="tree"
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3"
                  >
                    {/* Back button */}
                    <button
                      onClick={() => setSelectedQuestId(null)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#e8d5b7]/28 hover:text-[#c9a84c]/65 transition-colors w-fit"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back to Grimoire
                    </button>

                    <ConstellationTree
                      nodes={generateQuestNodes(selectedQuest.contract)}
                      nodeStates={selectedQuest.nodeStates}
                      onNodeComplete={(nodeId) => handleEpicNodeComplete(selectedQuest.id, nodeId)}
                      questTitle={selectedQuest.title}
                    />
                  </motion.div>
                )}

                {/* View B: Alchemist's Contract form */}
                {showContract && !selectedQuest && (
                  <motion.div key="contract"
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}
                  >
                    <ContractForm
                      onForge={handleForgeDestiny}
                      onCancel={() => setShowContract(false)}
                    />
                  </motion.div>
                )}

                {/* View C: Master Dashboard */}
                {!selectedQuest && !showContract && (
                  <motion.div key="dashboard"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  >
                    <QuestDashboard
                      quests={questArchive}
                      onSelectQuest={(id) => setSelectedQuestId(id)}
                      onForgeNew={() => setShowContract(true)}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
