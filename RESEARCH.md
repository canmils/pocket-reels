# Repository review — 16 October 2026

A scoped comparison of three projects found through GitHub repository search. This is not an exhaustive audit or a claim that these are the best projects on GitHub. Readme claims are distinguished from implementation inspected below.

| Project | Inspected | Useful idea adopted | What was not adopted |
| --- | --- | --- | --- |
| [johakr/html5-slot-machine](https://github.com/johakr/html5-slot-machine) | README, MIT LICENSE, `src/js/Slot.js`, `src/js/Reel.js` | Lightweight browser implementation; selected outcome separate from staggered reel presentation | Star Wars assets, automatic repeated spins and the source implementation |
| [weyoss/pixi-slot-machine](https://github.com/weyoss/pixi-slot-machine) | README, MIT LICENSE, `src/config/index.ts` | Explicit reel configuration and per-reel timing | Pixi dependency and five-reel scope. No claim about payout implementation; it was not inspected |
| [nuxy/slot-machine-gen](https://github.com/nuxy/slot-machine-gen) | README, MIT LICENSE, package.json, first 240 lines of `src/slot-machine.js` | Explicit selection weights and a replaceable random source | Its biased demo premise, 3D cylinder implementation, source and assets |

All three inspected root licences are MIT. Asset licensing is separate from source licensing; none of their assets is used here. No third-party code was copied or adapted. Generic ideas were independently implemented, so there is no bundled third-party code requiring a licence notice. If code or assets are incorporated later, preserve their licences and attribution separately.

## Evidence fingerprints

GitHub returned these blob SHAs for the inspected files. These identify file versions read during the review; they are not repository commit SHAs.

- johakr README: `915ca69015b0e464e27a4c0a45b5f2e2cf001269`; LICENSE: `3466b8ec81eb067f2780bb3c326ce228836e90d8`; Slot.js: `c0cb749d4cc53ee439901c2195b30f457270b34d`; Reel.js: `d6bd4274ebcd4d56b834dfad9091c3bfbadd36e9`.
- weyoss README: `28447c3f5188b4dcebc0ce0370777d5150e35f52`; LICENSE: `90613bf7774e5f647405e4235feac38c8a0a8976`; config: `da8b48054e0ae3648a34f84f245fb198a57c24ed`.
- nuxy README: `3cec4ec5536d81367b2e14c121732a1aaf657c83`; LICENSE: `7559b58c533dc12135291a789562fcd2bbde0d1e`; package.json: `21aa0e02faeeab4224e8c6bb67f9cfa7c0ce6f68`; source: `77b39fdbf9de60292f96c38d3af99fc8358f8e20` (only first 240 lines read).

## Deliberate additions

The reviewed material does not establish a verified RTP or production readiness for those projects. Pocket Reels adds its own five-line evaluator, explicit reel strips, exact enumeration of 8,000 combinations, atomic credit settlement and regression tests. These should be evaluated on their own evidence.
