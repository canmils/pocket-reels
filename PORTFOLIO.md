# Pocket Reels — product case study

[Play the prototype](https://canmils.github.io/pocket-reels/) · [Rules and exact maths](README.md) · [Give feedback](https://github.com/canmils/pocket-reels/issues/new?template=feedback.yml)

## Goal and role

Build a small fictional-credit slot in which players can understand the total bet, winning lines, payout and resulting balance. Joan Casellas directed the scope, reference selection and release process. Implementation, SVG symbols and synthesized audio were created with AI assistance.

## MVP decisions

- Three reels, three visible rows, five fixed paylines and five familiar symbols.
- A visible paytable uses line-bet multipliers; all line wins add together.
- Payout messages distinguish a net win, a break-even result and a payout below the total bet.
- Results and credit settlement are computed before the staggered animation reveals the outcome.
- A maths panel, recent spin history, a free reset and optional sound support inspection.
- Fictional credits only: no deposits, prizes, purchases or backend.

[Repository research](RESEARCH.md) records what was inspected and which design ideas were adopted. No third-party source or assets were copied.

## Evidence and current limits

The exact model has 8,000 equally likely stop combinations. Exhaustive enumeration gives 95.125% theoretical RTP, 37.825% of spins with any payout and 14.275% paying more than the total bet. The maximum payout is 281× total bet.

Ten initial model tests passed, covering all displayed grids against the line evaluator, exact payout totals, accounting, bet scaling, input validation, RNG rejection/failure and reset. [CI](https://github.com/canmils/pocket-reels/actions/workflows/ci.yml) and [deployment](https://github.com/canmils/pocket-reels/actions/workflows/pages.yml) expose the check history.

This is a public browser prototype, not a certified real-money system. Exhaustive maths tests do not establish animation correctness or device compatibility. There is no measured player comprehension, retention or monetisation result.

## Next validation

Ask a first-time player to explain a spin: total cost, winning line, amount returned and net balance change. Record misunderstandings, device/browser and reproduction steps. Correct unclear presentation before expanding the feature set.

## Portfolio claim supported

Directed an AI-assisted slot prototype release with transparent rules, an exhaustively evaluated mathematical model, automated accounting checks and public playtest access.
