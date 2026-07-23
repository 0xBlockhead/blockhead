<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.LiquidityPool_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LiquidityPool_Timestamp>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const liquidityPoolTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			baseTokenSymbol: true,
			quoteTokenSymbol: true,
			priceUsd: true,
			liquidityUsd: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			baseTokenSymbol: true,
			quoteTokenSymbol: true,
			priceUsd: true,
			liquidityUsd: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.baseTokenSymbol) ?? ''), String((pendingEntity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp')
	const viewDomId = $derived('liquidity-pool-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'feedKey' in selection.entitySelector
			&& selection.entitySelector.feedKey != null
			&& selection.entitySelector != null && '$liquidityPool' in selection.entitySelector
			&& selection.entitySelector.$liquidityPool != null && '$network' in selection.entitySelector.$liquidityPool
			&& selection.entitySelector.$liquidityPool.$network != null && 'caip2' in selection.entitySelector.$liquidityPool.$network
			&& selection.entitySelector.$liquidityPool.$network.caip2 != null && 'reference' in selection.entitySelector.$liquidityPool.$network.caip2
			&& selection.entitySelector.$liquidityPool.$network.caip2.reference != null
			&& selection.entitySelector.$liquidityPool != null && 'id' in selection.entitySelector.$liquidityPool
			&& selection.entitySelector.$liquidityPool.id != null ?
				resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			feedKey: encodeURIComponent(String(selection.entitySelector.feedKey ?? '')),
			chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
			poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'baseTokenSymbol') && Object.hasOwn(prefetched, 'quoteTokenSymbol') && Object.hasOwn(prefetched, 'priceUsd') && Object.hasOwn(prefetched, 'liquidityUsd')}
			{[String((pendingEntity.baseTokenSymbol) ?? ''), String((pendingEntity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.baseTokenSymbol) ?? ''), String((resolvedEntity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'baseTokenSymbol') && Object.hasOwn(prefetched, 'quoteTokenSymbol') && Object.hasOwn(prefetched, 'priceUsd') && Object.hasOwn(prefetched, 'liquidityUsd')}
			{[String((pendingEntity.priceUsd) ?? ''), String((pendingEntity.liquidityUsd) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.baseTokenSymbol) ?? ''), String((pendingEntity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.priceUsd) ?? ''), String((resolvedEntity.liquidityUsd) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.baseTokenSymbol) ?? ''), String((resolvedEntity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'baseTokenSymbol') && Object.hasOwn(prefetched, 'quoteTokenSymbol') && Object.hasOwn(prefetched, 'priceUsd') && Object.hasOwn(prefetched, 'liquidityUsd')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPoolTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
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
							(
								selection.entitySelector.$liquidityPool != null && 'id' in selection.entitySelector.$liquidityPool
								&& selection.entitySelector.$liquidityPool.id != null
								&& selection.entitySelector.$liquidityPool != null && '$network' in selection.entitySelector.$liquidityPool
								&& selection.entitySelector.$liquidityPool.$network != null && 'caip2' in selection.entitySelector.$liquidityPool.$network
								&& selection.entitySelector.$liquidityPool.$network.caip2 != null && 'reference' in selection.entitySelector.$liquidityPool.$network.caip2
								&& selection.entitySelector.$liquidityPool.$network.caip2.reference != null ?
									resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
								poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Feed key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									feedKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feedKey = resolvedEntity.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transport = resolvedEntity.transport}
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
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							baseTokenSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseTokenSymbol = resolvedEntity.baseTokenSymbol}
					{#if baseTokenSymbol !== undefined && baseTokenSymbol !== null}
						<div>
							<dt>Base token symbol</dt>
							<dd>
								{String((baseTokenSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							quoteTokenSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteTokenSymbol = resolvedEntity.quoteTokenSymbol}
					{#if quoteTokenSymbol !== undefined && quoteTokenSymbol !== null}
						<div>
							<dt>Quote token symbol</dt>
							<dd>
								{String((quoteTokenSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							baseTokenDecimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseTokenDecimals = resolvedEntity.baseTokenDecimals}
					{#if baseTokenDecimals !== undefined && baseTokenDecimals !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							quoteTokenDecimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteTokenDecimals = resolvedEntity.quoteTokenDecimals}
					{#if quoteTokenDecimals !== undefined && quoteTokenDecimals !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							pairCreatedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pairCreatedAtMs = resolvedEntity.pairCreatedAtMs}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							dexId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dexId = resolvedEntity.dexId}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							dexscreenerPairUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dexscreenerPairUrl = resolvedEntity.dexscreenerPairUrl}
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
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							priceUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priceUsd = resolvedEntity.priceUsd}
					{#if priceUsd !== undefined && priceUsd !== null}
						<div>
							<dt>Price USD</dt>
							<dd>
								{String((priceUsd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							priceNative: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priceNative = resolvedEntity.priceNative}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							liquidityUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liquidityUsd = resolvedEntity.liquidityUsd}
					{#if liquidityUsd !== undefined && liquidityUsd !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							volumeUsd24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const volumeUsd24h = resolvedEntity.volumeUsd24h}
					{#if volumeUsd24h !== undefined && volumeUsd24h !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							priceChangePercent24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priceChangePercent24h = resolvedEntity.priceChangePercent24h}
					{#if priceChangePercent24h !== undefined && priceChangePercent24h !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							transactionBuys24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionBuys24h = resolvedEntity.transactionBuys24h}
					{#if transactionBuys24h !== undefined && transactionBuys24h !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							transactionSells24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionSells24h = resolvedEntity.transactionSells24h}
					{#if transactionSells24h !== undefined && transactionSells24h !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							marketCapUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const marketCapUsd = resolvedEntity.marketCapUsd}
					{#if marketCapUsd !== undefined && marketCapUsd !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							fdvUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fdvUsd = resolvedEntity.fdvUsd}
					{#if fdvUsd !== undefined && fdvUsd !== null}
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
							selection({
								sources: selection.sources,
								fields: {
									dexscreenerLabels: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dexscreenerLabels = resolvedEntity.dexscreenerLabels}
							{#if dexscreenerLabels !== undefined && dexscreenerLabels !== null}
								{dexscreenerLabels.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Parent liquidity pool</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
								.$parentLiquidityPool({
									sources: [
										Source.Dexscreener_OpenApi,
									],
								})
						}
					>
						{#snippet children(liquidityPool)}
							{#if liquidityPool != null && liquidityPool[EntityMetaKey.Selector] != null}
								<LiquidityPoolView
									selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
									prefetched={liquidityPool}
									href={
										(
											liquidityPool[EntityMetaKey.Selector] != null && 'id' in liquidityPool[EntityMetaKey.Selector]
											&& liquidityPool[EntityMetaKey.Selector].id != null
											&& liquidityPool[EntityMetaKey.Selector] != null && '$network' in liquidityPool[EntityMetaKey.Selector]
											&& liquidityPool[EntityMetaKey.Selector].$network != null && 'caip2' in liquidityPool[EntityMetaKey.Selector].$network
											&& liquidityPool[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in liquidityPool[EntityMetaKey.Selector].$network.caip2
											&& liquidityPool[EntityMetaKey.Selector].$network.caip2.reference != null ?
												resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
											poolId: String(liquidityPool[EntityMetaKey.Selector].id ?? ''),
											chainId: String(liquidityPool[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
