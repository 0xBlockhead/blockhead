<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LiquidityPool_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const liquidityPoolTimestamp = $derived(selection({
		sources: [
			Source.Dexscreener_OpenApi,
		],
		fields: {
			baseTokenSymbol: true,
			quoteTokenSymbol: true,
			priceUsd: true,
			liquidityUsd: true,
			transport: true,
			baseTokenDecimals: true,
			quoteTokenDecimals: true,
			pairCreatedAtMs: true,
			dexId: true,
			dexscreenerPairUrl: true,
			priceNative: true,
			volumeUsd24h: true,
			priceChangePercent24h: true,
			transactionBuys24h: true,
			transactionSells24h: true,
			marketCapUsd: true,
			fdvUsd: true,
			dexscreenerLabels: true,
			$parentLiquidityPool: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).baseTokenSymbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp')
	const viewDomId = $derived('liquidity-pool-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).baseTokenSymbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || 'liquidity pool timestamp'}
		{:else}
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).baseTokenSymbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || 'liquidity pool timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.baseTokenSymbol) ?? ''), String((entity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).priceUsd) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).liquidityUsd) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).baseTokenSymbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || 'liquidity pool timestamp'}
		{:else}
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).priceUsd) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).liquidityUsd) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).baseTokenSymbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || 'liquidity pool timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.priceUsd) ?? ''), String((entity.liquidityUsd) ?? '')].filter(Boolean).join(' ') || [String((entity.baseTokenSymbol) ?? ''), String((entity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = prefetched.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = prefetched.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = entity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Liquidity pool</dt>
				<dd>
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						href={
							resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference),
								poolId: String(selection.entitySelector.$liquidityPool.id),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Feed key</dt>
				<dd>
					<ResourceBoundary resource={liquidityPoolTimestamp}>
						{#snippet Pending()}
							{@const feedKey = prefetched.feedKey ?? selection.entitySelector.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const feedKey = entity.feedKey ?? selection.entitySelector.feedKey ?? prefetched.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const transport = prefetched.transport ?? selection.entitySelector.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transport = entity.transport ?? selection.entitySelector.transport ?? prefetched.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const baseTokenDecimals = prefetched.baseTokenDecimals ?? selection.entitySelector.baseTokenDecimals}
					{#if baseTokenDecimals !== undefined && baseTokenDecimals !== null}
						<div>
							<dt>Base token decimals</dt>
							<dd>
								<NumberValue value={Number(baseTokenDecimals)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const baseTokenDecimals = entity.baseTokenDecimals ?? selection.entitySelector.baseTokenDecimals ?? prefetched.baseTokenDecimals}
					{#if baseTokenDecimals !== undefined && baseTokenDecimals !== null}
						<div>
							<dt>Base token decimals</dt>
							<dd>
								<NumberValue value={Number(baseTokenDecimals)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const quoteTokenDecimals = prefetched.quoteTokenDecimals ?? selection.entitySelector.quoteTokenDecimals}
					{#if quoteTokenDecimals !== undefined && quoteTokenDecimals !== null}
						<div>
							<dt>Quote token decimals</dt>
							<dd>
								<NumberValue value={Number(quoteTokenDecimals)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const quoteTokenDecimals = entity.quoteTokenDecimals ?? selection.entitySelector.quoteTokenDecimals ?? prefetched.quoteTokenDecimals}
					{#if quoteTokenDecimals !== undefined && quoteTokenDecimals !== null}
						<div>
							<dt>Quote token decimals</dt>
							<dd>
								<NumberValue value={Number(quoteTokenDecimals)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const pairCreatedAtMs = prefetched.pairCreatedAtMs ?? selection.entitySelector.pairCreatedAtMs}
					{#if pairCreatedAtMs !== undefined && pairCreatedAtMs !== null}
						<div>
							<dt>Pair created</dt>
							<dd>
								<Timestamp timestamp={Number(pairCreatedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const pairCreatedAtMs = entity.pairCreatedAtMs ?? selection.entitySelector.pairCreatedAtMs ?? prefetched.pairCreatedAtMs}
					{#if pairCreatedAtMs !== undefined && pairCreatedAtMs !== null}
						<div>
							<dt>Pair created</dt>
							<dd>
								<Timestamp timestamp={Number(pairCreatedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const dexId = prefetched.dexId ?? selection.entitySelector.dexId}
					{#if dexId !== undefined && dexId !== null}
						<div>
							<dt>DEX</dt>
							<dd>
								{String((dexId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const dexId = entity.dexId ?? selection.entitySelector.dexId ?? prefetched.dexId}
					{#if dexId !== undefined && dexId !== null}
						<div>
							<dt>DEX</dt>
							<dd>
								{String((dexId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const dexscreenerPairUrl = prefetched.dexscreenerPairUrl ?? selection.entitySelector.dexscreenerPairUrl}
					{#if dexscreenerPairUrl !== undefined && dexscreenerPairUrl !== null}
						<div>
							<dt>Dexscreener</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(dexscreenerPairUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(dexscreenerPairUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const dexscreenerPairUrl = entity.dexscreenerPairUrl ?? selection.entitySelector.dexscreenerPairUrl ?? prefetched.dexscreenerPairUrl}
					{#if dexscreenerPairUrl !== undefined && dexscreenerPairUrl !== null}
						<div>
							<dt>Dexscreener</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(dexscreenerPairUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(dexscreenerPairUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const priceNative = prefetched.priceNative ?? selection.entitySelector.priceNative}
					{#if priceNative !== undefined && priceNative !== null}
						<div>
							<dt>Price native</dt>
							<dd>
								{String((priceNative) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const priceNative = entity.priceNative ?? selection.entitySelector.priceNative ?? prefetched.priceNative}
					{#if priceNative !== undefined && priceNative !== null}
						<div>
							<dt>Price native</dt>
							<dd>
								{String((priceNative) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const volumeUsd24h = prefetched.volumeUsd24h ?? selection.entitySelector.volumeUsd24h}
					{#if volumeUsd24h !== undefined && volumeUsd24h !== null}
						<div>
							<dt>Volume USD 24h</dt>
							<dd>
								<NumberValue value={Number(volumeUsd24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const volumeUsd24h = entity.volumeUsd24h ?? selection.entitySelector.volumeUsd24h ?? prefetched.volumeUsd24h}
					{#if volumeUsd24h !== undefined && volumeUsd24h !== null}
						<div>
							<dt>Volume USD 24h</dt>
							<dd>
								<NumberValue value={Number(volumeUsd24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const priceChangePercent24h = prefetched.priceChangePercent24h ?? selection.entitySelector.priceChangePercent24h}
					{#if priceChangePercent24h !== undefined && priceChangePercent24h !== null}
						<div>
							<dt>Price change 24h</dt>
							<dd>
								<NumberValue value={Number(priceChangePercent24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const priceChangePercent24h = entity.priceChangePercent24h ?? selection.entitySelector.priceChangePercent24h ?? prefetched.priceChangePercent24h}
					{#if priceChangePercent24h !== undefined && priceChangePercent24h !== null}
						<div>
							<dt>Price change 24h</dt>
							<dd>
								<NumberValue value={Number(priceChangePercent24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const transactionBuys24h = prefetched.transactionBuys24h ?? selection.entitySelector.transactionBuys24h}
					{#if transactionBuys24h !== undefined && transactionBuys24h !== null}
						<div>
							<dt>Buys 24h</dt>
							<dd>
								<NumberValue value={Number(transactionBuys24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionBuys24h = entity.transactionBuys24h ?? selection.entitySelector.transactionBuys24h ?? prefetched.transactionBuys24h}
					{#if transactionBuys24h !== undefined && transactionBuys24h !== null}
						<div>
							<dt>Buys 24h</dt>
							<dd>
								<NumberValue value={Number(transactionBuys24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const transactionSells24h = prefetched.transactionSells24h ?? selection.entitySelector.transactionSells24h}
					{#if transactionSells24h !== undefined && transactionSells24h !== null}
						<div>
							<dt>Sells 24h</dt>
							<dd>
								<NumberValue value={Number(transactionSells24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionSells24h = entity.transactionSells24h ?? selection.entitySelector.transactionSells24h ?? prefetched.transactionSells24h}
					{#if transactionSells24h !== undefined && transactionSells24h !== null}
						<div>
							<dt>Sells 24h</dt>
							<dd>
								<NumberValue value={Number(transactionSells24h)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const marketCapUsd = prefetched.marketCapUsd ?? selection.entitySelector.marketCapUsd}
					{#if marketCapUsd !== undefined && marketCapUsd !== null}
						<div>
							<dt>Market cap USD</dt>
							<dd>
								<NumberValue value={Number(marketCapUsd)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const marketCapUsd = entity.marketCapUsd ?? selection.entitySelector.marketCapUsd ?? prefetched.marketCapUsd}
					{#if marketCapUsd !== undefined && marketCapUsd !== null}
						<div>
							<dt>Market cap USD</dt>
							<dd>
								<NumberValue value={Number(marketCapUsd)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet Pending()}
					{@const fdvUsd = prefetched.fdvUsd ?? selection.entitySelector.fdvUsd}
					{#if fdvUsd !== undefined && fdvUsd !== null}
						<div>
							<dt>FDV USD</dt>
							<dd>
								<NumberValue value={Number(fdvUsd)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fdvUsd = entity.fdvUsd ?? selection.entitySelector.fdvUsd ?? prefetched.fdvUsd}
					{#if fdvUsd !== undefined && fdvUsd !== null}
						<div>
							<dt>FDV USD</dt>
							<dd>
								<NumberValue value={Number(fdvUsd)} />
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
					<ResourceBoundary resource={liquidityPoolTimestamp}>
						{#snippet Pending()}
							{@const dexscreenerLabels = prefetched.dexscreenerLabels ?? selection.entitySelector.dexscreenerLabels}
							{#if dexscreenerLabels !== undefined && dexscreenerLabels !== null}
								{String((dexscreenerLabels) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const dexscreenerLabels = entity.dexscreenerLabels ?? selection.entitySelector.dexscreenerLabels ?? prefetched.dexscreenerLabels}
							{#if dexscreenerLabels !== undefined && dexscreenerLabels !== null}
								{String((dexscreenerLabels) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Parent liquidity pool</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.LiquidityPool, false>('$parentLiquidityPool')}
					>
						{#snippet children(liquidityPool)}
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, liquidityPool.entitySelector)}
								prefetched={liquidityPool}
								href={
									resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
										chainId: String(liquidityPool.entitySelector.$network.caip2.reference),
										poolId: String(liquidityPool.entitySelector.id),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
