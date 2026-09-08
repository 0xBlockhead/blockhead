# Network presentation session

This source-owned boundary materializes Blockhead network selections as immutable
`NetworkEntityPresentationV1` snapshots. Renderers may display snapshots and relay
semantic actions, but may not duplicate collection queries or own fixture data.
`acquireNetworkPresentationDriver` is the production-only selection boundary;
`createNetworkPresentationSessionFromDriver` owns the renderer-neutral state machine
and accepts a deterministic driver for contract replay without imitating the schema
client.
Version 1 rejects selectors other than the frozen `eip155:1` authority target;
generalizing to another network requires a separately validated schema version.
The port includes host navigation, Back, main-focus restoration, targeted retry,
idempotent teardown, and a `closed` promise that settles after the aggregate
presentation effect stops, already-dispatched actions drain, and the final injected
checkpoint save drains. Async navigation completion cannot mutate a destroyed
session, concurrent actions retain dispatch order, and a failed retry does not
consume its token. A save failure rejects `closed` so teardown evidence cannot
silently pass. The underlying selections remain client-owned and are
released only when the host destroys that client; renderer remount must therefore
not be reported as resource-level teardown proof.
The host Back adapter returns its authoritative resulting route; the session rejects
a route outside the frozen Network family instead of guessing from stale chrome.

Current downstream consumers are the `desktop-gpuix-svelte` candidate and the
Symbiote candidate. Both consume the same session port; neither owns this source.

The first producer slice owns the canonical network fields, seven summary resource
states, block and transaction collections, actions, retries, and teardown. Native
price follows the stable Network → native Coin → USD Market → MarketPrice → latest
Coingecko quote graph and formats its fixed-eight-decimal bigint without lossy
number conversion. Its retry owns that complete graph. Network-stack detail is
materialized from the referenced Constants-owned NetworkStack entity.

`activeSubscriptions` counts the single aggregate presentation session, not the
number of internal TanStack collection observers. Mount, subscription, and
persistence generations are supplied by the host that owns application bootstrap.
The host may restore the session's frozen checkpoint, which carries revision,
validated route, observation fingerprints/counts, and failure ordinals. A restored
session allocates the next revision while deliberately resetting disclosure and
selected-section state, matching the frozen cold-relaunch policy. Renderer-owned
focus state and retry tokens are never persisted. Recovery closes a failure episode,
so recurrence of the same diagnostic receives a new retry ordinal rather than
resurrecting a stale token. Deterministic fixture replay,
producer behavior, and renderer/runtime proof are separate evidence lanes; none
substitutes for another.
