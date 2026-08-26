<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LiquidityPool_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Dexscreener_Rest,
		],
	}))
	const liquidityPoolTimestamp = $derived(viewSelection({
		fields: {
			baseTokenSymbol: true,
			quoteTokenSymbol: true,
			priceUsd: true,
			liquidityUsd: true,
		},
	}))
	const titleFallback = $derived([(prefetched.baseTokenSymbol ?? ''), (prefetched.quoteTokenSymbol ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={liquidityPoolTimestamp}>
			{#snippet children(entity)}
				{[(entity.baseTokenSymbol ?? ''), (entity.quoteTokenSymbol ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={liquidityPoolTimestamp}>
			{#snippet children(entity)}
				{[(entity.priceUsd ?? ''), String(entity.liquidityUsd ?? '')].filter(Boolean).join(' ') || [(entity.baseTokenSymbol ?? ''), (entity.quoteTokenSymbol ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Liquidity pool</dt>
				<dd>
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Feed key</dt>
				<dd>
					{selection.entitySelector.feedKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transport = entity.transport}
					{#if transport != null}
						<div>
							<dt>Transport</dt>
							<dd>
								{transport}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={liquidityPoolTimestamp}
			>
				{#snippet children(entity)}
					{@const baseTokenSymbol = entity.baseTokenSymbol}
					{#if baseTokenSymbol != null}
						<div>
							<dt>Base token symbol</dt>
							<dd>
								{baseTokenSymbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={liquidityPoolTimestamp}
			>
				{#snippet children(entity)}
					{@const quoteTokenSymbol = entity.quoteTokenSymbol}
					{#if quoteTokenSymbol != null}
						<div>
							<dt>Quote token symbol</dt>
							<dd>
								{quoteTokenSymbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							baseTokenDecimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseTokenDecimals = entity.baseTokenDecimals}
					{#if baseTokenDecimals != null}
						<div>
							<dt>Base token decimals</dt>
							<dd>
								<NumberValue
									value={baseTokenDecimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quoteTokenDecimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quoteTokenDecimals = entity.quoteTokenDecimals}
					{#if quoteTokenDecimals != null}
						<div>
							<dt>Quote token decimals</dt>
							<dd>
								<NumberValue
									value={quoteTokenDecimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pairCreatedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pairCreatedAtMs = entity.pairCreatedAtMs}
					{#if pairCreatedAtMs != null}
						<div>
							<dt>Pair created</dt>
							<dd>
								<Timestamp timestamp={pairCreatedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							dexId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dexId = entity.dexId}
					{#if dexId != null}
						<div>
							<dt>DEX</dt>
							<dd>
								{dexId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							dexscreenerPairUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dexscreenerPairUrl = entity.dexscreenerPairUrl}
					{#if dexscreenerPairUrl != null}
						<div>
							<dt>Dexscreener</dt>
							<dd>
								<a
									href={dexscreenerPairUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={dexscreenerPairUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={liquidityPoolTimestamp}
			>
				{#snippet children(entity)}
					{@const priceUsd = entity.priceUsd}
					{#if priceUsd != null}
						<div>
							<dt>Price USD</dt>
							<dd>
								{priceUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							priceNative: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceNative = entity.priceNative}
					{#if priceNative != null}
						<div>
							<dt>Price native</dt>
							<dd>
								{priceNative}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={liquidityPoolTimestamp}
			>
				{#snippet children(entity)}
					{@const liquidityUsd = entity.liquidityUsd}
					{#if liquidityUsd != null}
						<div>
							<dt>Liquidity USD</dt>
							<dd>
								<NumberValue
									value={liquidityUsd}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							volumeUsd24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const volumeUsd24h = entity.volumeUsd24h}
					{#if volumeUsd24h != null}
						<div>
							<dt>Volume USD 24h</dt>
							<dd>
								<NumberValue
									value={volumeUsd24h}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							priceChangePercent24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceChangePercent24h = entity.priceChangePercent24h}
					{#if priceChangePercent24h != null}
						<div>
							<dt>Price change 24h</dt>
							<dd>
								<NumberValue
									value={priceChangePercent24h}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactionBuys24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionBuys24h = entity.transactionBuys24h}
					{#if transactionBuys24h != null}
						<div>
							<dt>Buys 24h</dt>
							<dd>
								<NumberValue
									value={transactionBuys24h}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactionSells24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionSells24h = entity.transactionSells24h}
					{#if transactionSells24h != null}
						<div>
							<dt>Sells 24h</dt>
							<dd>
								<NumberValue
									value={transactionSells24h}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							marketCapUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const marketCapUsd = entity.marketCapUsd}
					{#if marketCapUsd != null}
						<div>
							<dt>Market cap USD</dt>
							<dd>
								<NumberValue
									value={marketCapUsd}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fdvUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fdvUsd = entity.fdvUsd}
					{#if fdvUsd != null}
						<div>
							<dt>FDV USD</dt>
							<dd>
								<NumberValue
									value={fdvUsd}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Dexscreener labels</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									dexscreenerLabels: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.dexscreenerLabels.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Parent liquidity pool</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$parentLiquidityPool}
					>
						{#snippet children(liquidityPool)}
							{@const liquidityPoolInitial = untrack(() => liquidityPool)}
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, (liquidityPool ?? liquidityPoolInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
