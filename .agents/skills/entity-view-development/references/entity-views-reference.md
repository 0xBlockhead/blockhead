## Entity Views (`src/views/*.svelte`)

- **`href` ownership**: Singular entity views (`*View.svelte`) compute their own `href` internally from `entityId` (e.g. `` `/network/${entityId.$network.networkSlug}/blocks/${entityId.height}` ``). Do not accept `href` as a prop unless there is a specific reason the canonical route cannot be derived from the id. List entity views (`*sView.svelte`) always accept `href` as a prop from the call site (used for their own header link); they do not pass it down to child item views — items self-link.
- Add `data-e2e` only where Playwright needs a stable selector (see Playwright E2E — `data-e2e`). Do not add decorative or non-test `data-*` tagging on `EntityView`, `EntitiesList`, or related entity chrome. Do not use `data-view`; when a non-test hook is needed, use a `class` referenced in that component’s local `<style>` (or an established global primitive from `src/styles/components.css`).
- Entity pages (`EntityView`, resource-backed views): Keep user-facing depth that still matters from older layouts (topology, execution RPCs/clients, explorers, related networks, forks, faucets, head block/epoch where applicable) while staying aligned with current schema field names (for example `$$blocks`, not stale or invented keys).
- Section chrome: Render a block only when it has meaningful payload; gate on the smallest truthful checks (`length`, `undefined`, domain-backed flags). Avoid technical placeholder copy whose only role is to fill space.
- `EntityView` + `<dl>` (required): At most two `<dl>` elements per card, and they must appear only in the `Content` snippet. Use two only when the first cleanly groups multiple live/current observation fields and the second groups multiple static/catalog identity fields (for example an EVM network card can show latest block/epoch/slot/gas in the live `<dl>`, then environment/layer/parent/CAIP-2 in the static `<dl>`). Otherwise use one `<dl>`. Do not use `<dl>` inside `Details` or other detail-only sections; put extra metadata as additional rows in the appropriate `Content` `<dl>` (with `{#if open}` when rows should only show when expanded). Each optional row is its own `{#if}…{/if}` (one row per guard). Do not use a single `{#if}` wrapping multiple rows. A nested `<EntityView>` (e.g. inline entity link) is its own card and may have its own `Content` `<dl>` — the limit is per `EntityView` instance, not the whole page.
- `Content` prose vs `<dl>`: Obvious text bodies, descriptions, bios, summaries, subtitles, social post content, comments, and feed/item excerpts should render as standalone `<p>` content in the `Content` snippet, using `<TruncatedValue>` when truncation is useful. Do not add `<dl>` rows named `Description`, `Bio`, `Text`, `Body`, `Summary`, `Publication`, or similar for prose copy; keep `<dl>` rows for structured metadata and relationships.
- `Content` row guards: Each `<dl>` item should be wrapped by at most one condition. If a row depends on expansion plus data presence, use one guard for that row (for example `{#if open && value !== undefined}`), not an outer `{#if open}` around several rows. Avoid nested guards around the same item unless the inner conditional is inside the row value itself.
- `<dl>` vs heading: Do not add `<dl>` rows that repeat fields already shown in the `EntityView` heading (linked title, subtitle line, icon-backed identity from `#snippet Icon()`, badges or labels rendered in the title row). Surface that information in the heading or in the `<dl>`, not both.
- `<dl>` vs parent id: On nested or scoped child cards, do not add `<dl>` rows for id fields that belong to the parent entity or that duplicate components already present on the child’s own id object (the parent route or enclosing context already establishes them). Omit those redundant id slices from the summary `<dl>`.
- **Enum labels in `<dd>`:** Every user-facing enum value shown in a `<dd>` (or equivalent detail copy inside `Content` `<dl>`) must use a human-readable label from `src/constants/**`, not the raw enum member string. Follow the Constants section: field-keyed rows in an internal `*Rows` list, exported plural lookup map (`networkEnvironmentByEnvironment`, `bridgeSettlementModels`, `evmTransactionKinds`, …), then `.label` in markup (e.g. `<dd>{bridgeSettlementModels[step.settlementModel].label}</dd>`). Wire-shaped free strings (API status text, Chainlist `relationshipType`, proposal `documentCategory`) stay as-is unless promoted to a schema enum with labels.
- `useEntity` selection: Prefer hierarchical resolver/source inheritance (a concise top-level `$` source list; nested field entries use `{}` where children inherit) instead of repeating the same `$` on every nested property when the model allows it. Prefer inlining short `$derived` values and colocating `{#if}` conditions beside the markup they guard over one shared visibility object unless branches genuinely share the same decision.
- **Icon in heading vs Content `<dl>`:** Artwork shown in `#snippet Icon()` must not be repeated in Content `<dl>` (no Icon, Avatar, Image, Thumbnail, or Profile image rows when the header icon already shows the same asset). Banner or Open Graph image fields that differ from the icon are OK.
- Title / media: When the loaded entity exposes artwork (for example `$icon`), show it in the title row using the existing `Icon` snippet plus shared icon components (`IconComponent`, etc.), matching patterns from other entity views.
- `EntityView` / `EntityId` snippet contracts: For bundled context (`Content`, `Details`), use an optional first tuple parameter with optional object fields (for example `Snippet<[context?: { title?: string, href?: string }]>` and `Snippet<[context?: { open?: boolean }]>`). Call sites that ignore the bundle may use `{#snippet Content()}` / `{#snippet Details()}` instead of destructuring unused bindings.

### Entity identity row (`$/components/EntityId.svelte`, `$/components/EntityView.svelte`)

- `Value` / `Title` / `Heading` snippets: value-only id (no kind prefix); labeled card/link text; loaded summary when resolver data beats the raw id.
- Card summary: `Heading` → `Title` → `Value` → `title` prop. `EntityLayout.Value` → `Value` only; `EntityLayout.Title` → `Title` then `Value`. Do not use bare `{@render Value()}` for `Title` when a loaded label exists.
- `Title` / `Heading` patterns — kind + `{@render Value()}` (`EvmBlockView`); `ResourceBoundary` + fallback (`YoutubeVideoView`, `EvmSelectorView`); `Heading` loaded, `Value` id + `EntityLayout.Value` inline (`CoinView`); `Title` prose vs `Value` id (`LiquidityPoolView`, `EnsView`); hub/protocol name, not `entityId.scope` (`FarcasterView`, `GlobalView`). No `·` in title copy.
- `EntityId`: icon + linked label; summary link wraps `#snippet Icon` and label so the row is one draggable target. `EntityView` header uses the HTML `<Heading>` component; `HeadingAfter` and collapsed `Content` live there, not on `EntityId`.
- Readable ids: no `stringify(entityId)` in user-visible snippets; use `<Address>`, `<TruncatedValue>`, domain labels. Fine for `id`, view-transition names, drag text, route params.
- Do not repeat summary identity in `<dl>` rows (see `<dl>` vs heading above). `EntitiesList` context hides per-row type annotation.

### Related entities: inline `Title` vs `CollapsibleTabs`

Be deliberate about how child entities appear in `Content` and `Details`. Default to the lightest layout that matches cardinality and depth.

Inline entity reference (`layout={EntityLayout.Value}` in a `<dl>` row when `<dt>` already names the kind; `EntityLayout.Title` when the inline row needs the full labeled title; never `EntityLayout.Summary` / `SummaryDetails` for entity refs inside `<dl>` items):

- One related entity (parent market, upstream coin, network, pool, block, wallet-on-network, from/to deployment, …).
- The child is primarily a link target—identity + navigation, not a nested card to expand on this page.
- Choose the inline layout to avoid repeated words: use `EntityLayout.Value` for rows like `Block`, `Epoch`, `Slot`, `Network`, `Owner`, `Author`, `From`, `To`, or `EntryPoint` where the `<dt>` already names the role/kind; use `EntityLayout.Title` only when the row needs the entity's labeled title for clarity.
- Set `open={false}` and `showTypeAnnotation={false}` on nested views inside another entity’s `<dl>`.
- Prefer `Address`, `TruncatedValue`, or plain catalog strings only when there is no schema-backed entity row to link (or the field is not modeled as an entity ref).

Intrinsic / definitional refs (especially smart contracts that are part of the parent’s identity—not contextual links like owner, network, or thread parent):

- Render as an embedded child `EntityView` with `layout={EntityLayout.SummaryDetails}` and `showTypeAnnotation={false}`.
- Prefer `open={true}` when the ref is the main subject (pool on a position, registry on an 8004 service, contract on an ERC-4337 row, market base/quote); `open={false}` when there are several sibling refs (pair tokens on a pool, step tokens in a route).

Flat `<section>` in `Details` (no carousel):

- One or two substantive blocks that are not single-entity links: a field list (`*View` with `entityFieldReference`), a chart hub (`MarketOhlcHub`), route-local `children`, etc.
- Example: `MarketView` — spot (`MarketPricesView`) + OHLC (`MarketOhlcHub`) as sibling sections; base/quote legs use embedded `SummaryDetails` in `Content`.

`CollapsibleTabs` + `entity-view-detail-carousels`:

- Three or more distinct sections, or two or more sections where each is a list / feed / chart column worth horizontal scroll markers (not a lone nested card).
- Hub pages that group registry slices: `NetworkView`, `CoinView`, `FarcasterView`, `EvmNetworkAccountView` (balances + activity), etc.
- Each carousel section should earn its marker row; do not wrap a single child view or `{@render children()}` alone.

Avoid:

- `CollapsibleTabs` for one related entity (e.g. parent market on a timestamp row, host network on a wallet row)—use inline `Title` in `Content` instead.
- `EntityLayout.Title` nested cards in `<dl>` rows when the ref is intrinsic to the parent (use `SummaryDetails` per above)—`Title` remains for relational one-line links (host network, owner, parent comment).
- Duplicating the same inline `Content` refs again in `Details` carousels (e.g. origin tx + initiator on `BridgeTransactionView`).
- Raw ids (chain id strings, truncated pool addresses) when a `NetworkView`, `LiquidityPoolView`, `CoinInstanceView`, etc. exists for that ref.

Quick check: *If collapsing the section hides only one link line, use `Title` in the `<dl>`; if it groups multiple lists or tools, use tabs or flat titled sections.*

### Domain-oriented views (settings, storage, social)

Keep these semantics stable in UI copy and `useEntity` wiring; do not add `data-view`. Add `data-e2e` only when a Playwright test already targets the node (same bar as `NetworkView`, which uses a small fixed set of carousel/collapsible roots—do not blanket other entity pages with parallel hooks).

| View | Role |
|------|------|
| `SettingView.svelte` | `_Global` settings hub: navigation/usage copy clarifies this is app preferences and usage (e.g. Dune credits), not the resolver `Source` catalog. |
| `SourcesView.svelte` | Lists persisted `BlockheadSource` rows (saved transports), gated by `Source.Local_Internal`; distinct from enabled `Source` definitions in `$/sources/index.ts`. |
| `SelectorsView.svelte` | Parent-scoped `$$evmSelectors` field list (not the global catalog). |
| `TopicsView.svelte` | Parent-scoped `$$evmTopics` field list (not the global catalog). |
| `EvmSelectorsView.svelte` | `_Global` `$$evmSelectors` catalog (`Source.Local_Internal`); row detail resolves signatures via `Source.Openchain_Rest`. |
| `EvmTopicsView.svelte` | `_Global` `$$evmTopics` catalog (`Source.Local_Internal`); `/evm` hub carousel + `/evm/topics` list. |
| `EvmErrorsView.svelte` | `_Global` `$$evmErrors` catalog (`Source.Local_Internal`); `/evm/errors` list + hub carousel. |
| `EvmSelectorView.svelte` / `EvmTopicView.svelte` / `EvmErrorView.svelte` | Per-hex signature lookup (`Source.Openchain_Rest`); routes under `/evm/selector|topic|error/[hex]`. |
| `EvmLogView.svelte` | EvmLog by network + tx hash + log index; topics link to EvmTopicView, emitter `EvmContractView` (`EntityLayout.SummaryDetails`); topic 0 in heading via nested EvmTopicView. |
| `EvmLogsView.svelte` | Receipt log list from parent `$$logs` on EvmTransaction; rows link to `/network/…/tx/…/log/[logIndex]`. |
| `EvmTraceTreeView.svelte` | Recursive EvmTrace call tree on a transaction; each frame renders EvmTraceContentView (selectors, value transfers). |
| `EvmTraceContentView.svelte` | Single trace frame: selector signatures, value transfers, nested calls. |
| `EvmTransactionInputDecode.svelte` | Inline tx input decode: EvmSelector link + OpenChain signatures when expanded. |
| `evm/calldata-decoder` | `/evm/calldata-decoder`: paste hex calldata or event data; OpenChain selector/topic lookup + ABI decode; shareable `?data=` query. |
| `evm/+page.svelte` | EVM hub (`GlobalView`): carousels for topics, selectors, errors, and calldata-decoder link. |
| `EvmTransactionView.svelte` | Single EvmTransaction by chain + tx hash; Blockscout / Voltaire execution fields. |
| `EvmTransactionsView.svelte` | Transaction list from a parent `$$transactions` field reference (block or network). |
| `FarcasterAccountView.svelte` | `BlockheadFarcasterAccountConnection`: connected FID, custody, verifications; Neynar / Snapchain. |
| `FarcasterAccountsView.svelte` | `_Global` `$$blockheadFarcasterAccountConnections` list (sorted by FID). |
| `FarcasterCastView.svelte` | Cast by author FID + cast hash; channel, thread, mentions, embeds; feed vs hub layout. |
| `FarcasterCastsView.svelte` | Cast cards from a FarcasterFeed `$$entries` field (e.g. hub trending). |
| `FarcasterChannelView.svelte` | FarcasterChannel by id; stats, pinned cast hash, lead/moderators as FID links. |
| `FarcasterChannelsView.svelte` | `FarcasterNetwork` `$$channels` registry list. |
| `FarcasterFeedView.svelte` | Feed (trending, by FID, by channel, following); `$$entries` cast stream + live resolve where wired. |
| `FarcasterFeedsView.svelte` | `FarcasterNetwork` `$$feeds` catalog with stable routes per feed variant. |
| `FarcasterUserView.svelte` | FarcasterUser: FID, fname (`@username`), profile fields, verified EVM address. |
| `FarcasterUsersView.svelte` | `FarcasterNetwork` `$$users` list (FID-sorted). |
| `FarcasterView.svelte` | `FarcasterNetwork` hub: carousels for feeds, trending casts, channels, users, and connected accounts; registry metadata in `Content` `<dl>`. |
| `GlobalView.svelte` | `_Global` hub: app navigation shortcuts, Dune usage, `EntityType._Global` details—distinct from resolver Source rows (SettingView). |
| `IpfsBrowseEntityChrome.svelte` | `IpfsResource` browse + gateway metadata via `Source.Ipfs_Rest` (collapsible CID / path + current resource). |
| `IpfsBrowseView.svelte` | IPFS browse form: multibase CID, IPNS, `ipfs://` / `ipns://`, or gateway URL → canonical resource navigation. |
| `StateChannelsView.svelte` | Off-chain state channel rows (`StateChannel` / `ChannelView`); not on-chain event streams. |
| `SwarmBrowseView.svelte` | Swarm browse form: BZZ references and gateways; copy states this is not IPFS (`bzz://` vs CIDs). |
| `SwarmResourceView.svelte` | Resolver-backed `SwarmResource` entity: canonical URI, gateway, typed content via `Source.Swarm_Rest`. |
| `UrlView.svelte` / `UrlsView.svelte` | `Url` entities: arbitrary web URLs with catalog / Open Graph enrichment. |
| `VaultView.svelte` / `VaultsView.svelte` | `Vault` here is concentrated-liquidity / DEX pool metadata (e.g. token pair, ticks, TVL from `Source.Dexscreener_Rest`), not ERC-4626 yield vaults—wording should not imply share-token vault semantics. |
| `XPostView.svelte` / `XPostsView.svelte` / `XUserView.svelte` / `XUsersView.svelte` | X (Twitter) posts and profiles; field lists combine `Source.Constants_Internal` on the parent with `Source.X_Rest` on the relation where applicable. |
| `XView.svelte` | `XNetwork` hub: carousel of profiles + posts lists (`entity-view-detail-carousels` + `CollapsibleTabs` like `FarcasterView`); singleton metadata via `Source.Constants_Internal`. |
| `XmtpView.svelte` / `XmtpConversationsView.svelte` / `XmtpConversationView.svelte` | `XmtpNetwork` + `XmtpConversation`: `_Global` `$$actors` / `$$xmtpConversations` (`Source.Local_Internal`); omit `Content` `<dl>` ids that duplicate the conversation identifier in `#snippet Title`. |
| `Proposal*View.svelte` / `ProposalsView.svelte` | Proposal catalogs: realm (`ProposalRealm`) scopes kind (`ProposalKind`: EIP / CAIP / …), then upstream `Proposal` documents; `ProposalKindsView` / `ProposalRealmsView` mirror `/proposals/…` navigation; mute copy distinguishes spec text from live governance tallies where applicable. |
| `Reddit*View.svelte` | `RedditNetwork` lists subreddits + popular submissions, `RedditLinkView` nests `$$comments`, `RedditCommentView` resolves `$link`; terminology stays Reddit-native (subreddit, submission, comment thread) versus Farcaster/X. |
| `RoomView.svelte` / `RoomsView.svelte` | `BlockheadRoom`: realtime multiplayer session (`Local_Internal`), framed apart from Reddit, XMTP, Swarm; `RoomsView` uses `RoomView` rows. |
| `charts/Market_TimeInterval_Timestamp.svelte` | Candlesticks over `EntityType.Market_TimeInterval_Timestamp` OHLC points; callers choose `title` / interval framing—surface that linkage in muted chrome so charts stay tied to Market interval semantics. |
