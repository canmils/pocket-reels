# Pocket Reels

A tiny open-source slot prototype for desktop and phone browsers. **Fictional credits only.** No deposits, cash prizes, purchases, accounts, analytics or backend. AI-assisted development directed by Joan Casellas.

## Play locally

Download the files and open `index.html` in a modern browser. No installation, build or API key. If your browser restricts local files, use Python 3:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. On Windows, `py -m http.server 8000` is an alternative.

The intended public demo URL is https://canmils.github.io/pocket-reels/ — **not live until the repository is created and Pages deployment succeeds**.

## Rules

- 3 reels, 3 visible rows, 5 fixed lines: all three horizontal rows and both diagonals.
- Every spin starts from independent, uniformly selected reel stops. Visible rows are adjacent strip symbols.
- Choose a total bet of 5, 10 or 25 fictional credits. Line bet is total bet / 5. All five lines always play.
- Three identical symbols on a line pay: cherry 5×, lemon 10×, bell 25×, star 100×, seven 1,400× **line bet**.
- All matching line payouts add. Deduct total bet once; add payout once. Payouts include returned stake.
- No wilds, scatters, free spins, autoplay or bonus games.
- Each page session begins with 1,000 credits. Reset or reload to start again. There is no persistent balance.
- Tap/click Spin or use Space outside another control. Sound is optional and off initially. Reduced-motion preference shortens the spin presentation.

## Exact maths, not a simulated claim

Each reel has 20 stops: 8 cherries, 5 lemons, 4 bells, 2 stars and 1 seven. Full strips are in `math.js`.

| Measure | Exact result |
| --- | --- |
| Equally likely stop combinations | 8,000 |
| Theoretical RTP | 95.125% |
| Spins with any payout | 37.825% |
| Spins paying more than total bet | 14.275% |
| Maximum payout at total bet 5 | 1,405 credits / 281× total bet |

RTP is the expected payout divided by total bet. It does not predict an individual session. The highest single-symbol payout (three sevens) is 1,400× line bet, or 280× total bet; an additional cherry line can bring the maximum spin to 281× total bet.

For each line the expected return is `(8³×5 + 5³×10 + 4³×25 + 2³×100 + 1³×1400) / 20³ = 0.95125`. Expected returns add over five lines even though their outcomes are correlated. Any-payout frequency and max payout are found by enumerating all stops, not by treating lines as independent.

The model uses Web Crypto with rejection sampling to avoid modulo bias. It fails explicitly if randomness is unavailable. Results and the credit transaction are computed before animation; animation only reveals the chosen result. Browser code can be edited by the player: this is not a secure, certified or deployable real-money system.

## Checks

With Node.js 22+ installed:

```sh
npm test
npm run math
node --check game.js
```

Tests verify all 8,000 displayed grids against line evaluation, exact payout totals, symbol frequencies, bet scaling, strip wrapping, credit accounting, invalid inputs, RNG rejection/failure and session reset.

Browser rendering, real phone input, animation timing and audio still need manual verification. Automated model tests are not a claim of browser QA or external certification.

## Source research and reuse

See [RESEARCH.md](RESEARCH.md) for the reviewed repositories, licences and adopted ideas. The implementation, SVG symbols and synthesized audio are original. No third-party source or assets were copied or bundled. There are no third-party runtime dependencies.

## Give feedback or contribute

Open **Issues → New issue → Playtest feedback**. Report your device/browser, what you expected, what happened and steps to reproduce. Focus initial feedback on bet/payout clarity, visible winning lines, spin pace and touch usability. GitHub feedback requires a GitHub account; playing does not.

Fork and submit a small pull request. Keep game maths separate from presentation, run the tests and test mobile/desktop controls for UI changes. Include licences for any new third-party assets. A change to strips or pays must update the full enumeration and documented maths.

## Publish

1. Create a public `canmils/pocket-reels` repository.
2. Add these files to its root, including `.github/`.
3. Under Settings → Pages, select **GitHub Actions** as source.
4. Push to `main` or manually run **Deploy demo** under Actions.
5. Verify the deployment before sharing its public URL.

The deployment workflow tests the model and packages only the four runtime files. The CI workflow also runs on pull requests.

## Scope

A base-game portfolio prototype, not evidence of F2P retention, a monetisation economy or commercial performance. Next validation: can a new player explain why a spin paid and how the balance changed? Extend only after observing playtests.

MIT licence: see LICENSE. No affiliation with referenced projects or commercial slot brands.
