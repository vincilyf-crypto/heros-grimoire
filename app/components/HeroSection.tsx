"use client";

import { motion } from "framer-motion";
import { Sword, Shield, Scroll, Star, Flame, Crown } from "lucide-react";

const PARTICLES = [
  { id: 1, x: "10%", y: "20%", delay: 0, duration: 6 },
  { id: 2, x: "85%", y: "15%", delay: 1.5, duration: 8 },
  { id: 3, x: "60%", y: "70%", delay: 3, duration: 7 },
  { id: 4, x: "25%", y: "80%", delay: 0.5, duration: 9 },
  { id: 5, x: "75%", y: "50%", delay: 2, duration: 6.5 },
  { id: 6, x: "45%", y: "10%", delay: 4, duration: 7.5 },
];

const QUEST_PREVIEWS = [
  {
    icon: Sword,
    title: "每日鍛鍊",
    category: "體能",
    xp: 150,
    status: "進行中",
    statusColor: "text-yellow-400",
  },
  {
    icon: Scroll,
    title: "閱讀一章節",
    category: "知識",
    xp: 80,
    status: "已完成",
    statusColor: "text-green-400",
  },
  {
    icon: Shield,
    title: "冥想 10 分鐘",
    category: "心靈",
    xp: 100,
    status: "進行中",
    statusColor: "text-yellow-400",
  },
];

const STATS = [
  { label: "等級", value: "12", icon: Crown },
  { label: "完成任務", value: "47", icon: Star },
  { label: "連續天數", value: "8", icon: Flame },
];

export default function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden parchment-overlay">
      {/* Animated Background Particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-[#c9a84c] particle"
          style={{ left: p.x, top: p.y }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-[#c9a84c]/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#c9a84c]/50 flex items-center justify-center">
            <Sword className="w-4 h-4 text-[#c9a84c]" />
          </div>
          <span className="text-[#c9a84c] font-semibold tracking-widest text-sm uppercase">
            Hero&apos;s Grimoire
          </span>
        </div>
        <div className="flex gap-6 text-sm text-[#e8d5b7]/60">
          <button className="hover:text-[#c9a84c] transition-colors">任務</button>
          <button className="hover:text-[#c9a84c] transition-colors">角色</button>
          <button className="hover:text-[#c9a84c] transition-colors">成就</button>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-20 pb-12 text-center">
        {/* Decorative top ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
          <Crown className="w-6 h-6 text-[#c9a84c]" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-7xl font-bold mb-4 gold-glow tracking-tight"
        >
          Hero&apos;s Grimoire
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl text-[#e8d5b7]/70 mb-3 tracking-widest uppercase text-sm"
        >
          ✦ Life RPG Mission Tracker ✦
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg text-[#e8d5b7]/50 max-w-md mb-12"
        >
          將你的日常任務化為史詩冒險。每一個挑戰，都是你成長的傳說。
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex gap-4 mb-16"
        >
          <button className="grimoire-border px-8 py-3 bg-[#c9a84c]/10 text-[#c9a84c] rounded hover:bg-[#c9a84c]/20 transition-all duration-300 font-semibold tracking-wider text-sm uppercase">
            開始冒險
          </button>
          <button className="px-8 py-3 border border-[#e8d5b7]/20 text-[#e8d5b7]/60 rounded hover:border-[#e8d5b7]/40 hover:text-[#e8d5b7]/80 transition-all duration-300 text-sm uppercase tracking-wider">
            查看任務
          </button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-8 mb-16"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <stat.icon className="w-5 h-5 text-[#c9a84c]/70" />
              <span className="text-2xl font-bold text-[#c9a84c]">{stat.value}</span>
              <span className="text-xs text-[#e8d5b7]/40 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Quest Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-full max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Scroll className="w-4 h-4 text-[#c9a84c]/60" />
            <span className="text-xs uppercase tracking-widest text-[#e8d5b7]/40">今日任務</span>
            <div className="flex-1 h-px bg-[#c9a84c]/10" />
          </div>

          <div className="flex flex-col gap-3">
            {QUEST_PREVIEWS.map((quest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + i * 0.1 }}
                whileHover={{ x: 4 }}
                className="grimoire-border flex items-center justify-between px-5 py-4 rounded bg-[#1a0a2e]/40 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded border border-[#c9a84c]/30 flex items-center justify-center bg-[#c9a84c]/5">
                    <quest.icon className="w-4 h-4 text-[#c9a84c]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#e8d5b7]">{quest.title}</p>
                    <p className="text-xs text-[#e8d5b7]/40">{quest.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className={`text-xs ${quest.statusColor}`}>{quest.status}</span>
                  <span className="text-xs text-[#c9a84c]/60 font-mono">+{quest.xp} XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-12 flex items-center gap-4"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/30" />
          <span className="text-xs text-[#e8d5b7]/20 tracking-widest uppercase">Heros Grimoire v0.1</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/30" />
        </motion.div>
      </div>
    </div>
  );
}
