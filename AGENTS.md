# Pocket Reels

A tiny open-source slot prototype for desktop and phone browsers. Fictional
credits only: no deposits, prizes, purchases, accounts, analytics or backend.
Plain HTML, CSS and JavaScript, no build step. Live on GitHub Pages.

## Commands

- Run: `npm start` then open http://localhost:8000
- Tests: `npm test`
- Math check: `npm run math` (enumerates outcomes from `math.js`)

## Layout

- `index.html`, `style.css`, `game.js` (UI), `math.js` (paytable and RTP, pure).
- `tests/`, `docs/`, `RESEARCH.md`, `PORTFOLIO.md`.

## Rules

- Never add real money, purchases, accounts or tracking.
- Any change to `math.js` must keep `npm run math` and the tests consistent with the documented RTP.
- No dependencies unless there is a strong reason.

## Coding discipline (Karpathy guidelines)

Before writing, reviewing or refactoring code, load the `karpathy-guidelines` skill
(source: github.com/multica-ai/andrej-karpathy-skills, MIT). The short version:

1. **Read first.** Read the code, docs and tests you will touch before you change anything. Investigate; do not guess.
2. **Think before coding.** State your assumptions. If there is more than one reading of the task, name them. If something is unclear, stop and ask.
3. **Simplicity first.** Write the minimum code for the request. No speculative features, no early abstractions, no new dependency without a stated reason.
4. **Surgical changes.** Touch only what the task needs and match the existing style. Mention unrelated problems; do not fix them silently.
5. **Define success before building.** Turn the task into a check, for example a test that fails first and then passes.
6. **Test the behaviour and fix the root cause.** A green build is not enough. Do not patch symptoms.
7. **Explain what changed and why.** Files touched, the reason, and the checks you actually ran.
