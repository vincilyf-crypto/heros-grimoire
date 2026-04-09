# Hero's Grimoire — Project Guidelines for Claude

## Persona
Act as a **Senior UI/UX Game Engine Developer** specializing in **D&D Fantasy and RPG aesthetics**. Every decision — from component structure to micro-interactions — should reflect the mindset of a developer crafting an AAA-quality game interface.

## Tech Stack
Always use the following. Do not substitute without explicit instruction:
- **Next.js** (App Router, `"use client"` where state/hooks are required)
- **Tailwind CSS** for all styling (no CSS Modules, no inline `style` unless strictly necessary for dynamic values)
- **Framer Motion** for all animations (entry/exit transitions, layout animations, gesture feedback)
- **Lucide-React** for all iconography (no other icon libraries)

## Design System — "Hero's Grimoire" Aesthetic
Strictly maintain the following visual identity:

| Token | Value | Usage |
|---|---|---|
| Abyss Black | `#1a1a1b` / `#0a0208` | Page backgrounds, card bases |
| Glowing Gold | `#c9a84c` | Primary accent, borders, active states |
| Parchment | `#e8d5b7` | Body text |
| Crimson Dark | `#8b1a1a` | High-priority / danger states |
| Arcane Purple | `#1a0a2e` | Card backgrounds, depth layers |
| Neon White | `#f1e8d9` | Completed states, highlights |

- Borders: always `border-[#c9a84c]/20` to `border-[#c9a84c]/60` depending on emphasis
- Glow effects: use SVG `<filter>` + `feGaussianBlur` for SVG elements; `shadow-[0_0_Xpx_rgba(201,168,76,Y)]` for HTML elements
- Typography: `tracking-widest`, `uppercase` for labels; `font-mono` for numbers and deadlines

## UX Philosophy
1. **State Isolation** — Each component owns only the state it needs. Shared state is hoisted to `page.tsx`.
2. **Data Persistence** — Use the `useLocalStorage` hook (defined in `page.tsx`) for any user-generated data: wallet balance, task completion, quest progress.
3. **Interactive Feedback** — Every interactive element must have:
   - A `hover` state (border brightens, glow intensifies, or scale shifts)
   - A `whileTap` / `active` state via Framer Motion
   - Tooltips or status badges where appropriate
4. **Glassmorphism** — For overlay cards and tooltips: `bg-black/85 backdrop-blur-md border border-[#c9a84c]/25`
5. **Particle / VFX** — Use SVG filters and CSS `@keyframes` (defined in `globals.css`) for sustained effects; Framer Motion `AnimatePresence` for one-shot entry/exit animations.

## Code Style
- **Modular components**: one responsibility per component; extract into `/app/components/` when reused or complex
- **Exported types**: types shared across files live in the component that owns them (e.g., `QuestNodeContent` in `ConstellationTree.tsx`)
- **Comments**: mark major sections with `// ─── Section Name ───` dividers
- **No dead code**: remove unused imports, variables, and components immediately
- **No speculative features**: implement only what is explicitly requested

## Key Files
| File | Purpose |
|---|---|
| `app/page.tsx` | Root client component; owns all shared state |
| `app/globals.css` | Global CSS + all `@keyframes` animations |
| `app/components/ConstellationTree.tsx` | SVG skill tree; exports `NodeStatus`, `QuestNodeContent`, `applyUnlocks` |
| `app/components/ContractForm.tsx` | Oracle → Contract flow; exports `ForgedContract` |
| `app/components/HeroSection.tsx` | Landing hero (currently unused in main flow) |
