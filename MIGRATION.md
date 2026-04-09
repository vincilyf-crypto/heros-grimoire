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

Create this folder and file manually:

**Folder path:**
```
C:\Users\<YourName>\.claude\skills\frontend-design\
```

**Create file** `SKILL.md` inside that folder with the content from:
https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md

Or run this in PowerShell:
```
mkdir "$env:USERPROFILE\.claude\skills\frontend-design"
curl -s -H "Authorization: token <YOUR_GITHUB_TOKEN>" "https://api.github.com/repos/anthropics/claude-code/contents/plugins/frontend-design/skills/frontend-design/SKILL.md" | python -c "import sys,json,base64; d=json.load(sys.stdin); print(base64.b64decode(d['content']).decode())" > "$env:USERPROFILE\.claude\skills\frontend-design\SKILL.md"
```

---

## Step 5 — Connect GitHub Account

1. Go to: https://github.com/settings/tokens/new
2. Check scopes: `repo` + `workflow` + `read:org`
3. Generate token and run:
```
echo YOUR_TOKEN | gh auth login --with-token
```

---

## Done!

Your GitHub repo: https://github.com/vincilyf-crypto/heros-grimoire
