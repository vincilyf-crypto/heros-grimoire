# New Computer Setup Guide

## Step 1 — Install Required Software

| Software | Download |
|---|---|
| Node.js | https://nodejs.org |
| Git | https://git-scm.com |
| VS Code | https://code.visualstudio.com |
| Claude Code | Install via VS Code Extensions (search "Claude Code") |
| GitHub CLI | Run in PowerShell: `winget install GitHub.cli` |

---

## Step 2 — Configure Git Identity

Open PowerShell and run:
```
git config --global user.name "Vinci Lau"
git config --global user.email "vinci.lyf@gmail.com"
```

---

## Step 3 — Clone the Project

```
git clone https://github.com/vincilyf-crypto/heros-grimoire.git
cd heros-grimoire
npm install
npm run dev
```

App will be running at http://localhost:3000

---

## Step 4 — Restore Claude Code Skills

Open Claude Code and type:
```
install the frontend-design skill from anthropics/claude-code
```
Claude will handle it automatically.

---

## Step 5 — Connect GitHub Account

1. Go to: https://github.com/settings/tokens/new
2. Check scopes: `repo` + `workflow`
3. Generate token, then open PowerShell and run:
```
gh auth login --with-token
```
Paste your token when prompted.

---

## Done!

Your GitHub repo: https://github.com/vincilyf-crypto/heros-grimoire
