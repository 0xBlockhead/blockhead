<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const liquidityPoolTimestamp = $derived(selection({
		sources: [
			Source.Dexscreener_OpenApi,
		],
		fields: {
			baseTokenSymbol: true,
			quoteTokenSymbol: true,
			priceUsd: true,
			liquidityUsd: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.baseTokenSymbol) ?? ''), String((prefetched.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp')
	const viewDomId = $derived('liquidity-pool-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={liquidityPoolTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.baseTokenSymbol) ?? ''), String((prefetched.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || 'liquidity pool timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.baseTokenSymbol) ?? ''), String((resolvedEntity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={liquidityPoolTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.priceUsd) ?? ''), String((prefetched.liquidityUsd) ?? '')].filter(Boolean).join(' ') || [String((prefetched.baseTokenSymbol) ?? ''), String((prefetched.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || title || 'liquidity pool timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.priceUsd) ?? ''), String((resolvedEntity.liquidityUsd) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.baseTokenSymbol) ?? ''), String((resolvedEntity.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={liquidityPoolTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Liquidity pool</dt>
				<dd>
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						href={
							(selection.entitySelector.$liquidityPool.$network !== undefined && selection.entitySelector.$liquidityPool.$network.caip2 !== undefined && selection.entitySelector.$liquidityPool.$network.caip2.reference !== undefined && selection.entitySelector.$liquidityPool.id !== undefined ? resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
								poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
							}) : undefined)
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									feedKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const feedKey = selection.entitySelector.feedKey ?? prefetched.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}

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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transport = prefetched.transport}
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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							baseTokenSymbol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseTokenSymbol = prefetched.baseTokenSymbol}
					{#if baseTokenSymbol !== undefined && baseTokenSymbol !== null}
						<div>
							<dt>Base token symbol</dt>
							<dd>
								{String((baseTokenSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							quoteTokenSymbol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quoteTokenSymbol = prefetched.quoteTokenSymbol}
					{#if quoteTokenSymbol !== undefined && quoteTokenSymbol !== null}
						<div>
							<dt>Quote token symbol</dt>
							<dd>
								{String((quoteTokenSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							baseTokenDecimals: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseTokenDecimals = prefetched.baseTokenDecimals}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseTokenDecimals = resolvedEntity.baseTokenDecimals}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							quoteTokenDecimals: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quoteTokenDecimals = prefetched.quoteTokenDecimals}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteTokenDecimals = resolvedEntity.quoteTokenDecimals}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							pairCreatedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pairCreatedAtMs = prefetched.pairCreatedAtMs}
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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							dexId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dexId = prefetched.dexId}
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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							dexscreenerPairUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dexscreenerPairUrl = prefetched.dexscreenerPairUrl}
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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							priceUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const priceUsd = prefetched.priceUsd}
					{#if priceUsd !== undefined && priceUsd !== null}
						<div>
							<dt>Price USD</dt>
							<dd>
								{String((priceUsd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							priceNative: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const priceNative = prefetched.priceNative}
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
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							liquidityUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const liquidityUsd = prefetched.liquidityUsd}
					{#if liquidityUsd !== undefined && liquidityUsd !== null}
						<div>
							<dt>Liquidity USD</dt>
							<dd>
								<NumberValue value={Number(liquidityUsd)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liquidityUsd = resolvedEntity.liquidityUsd}
					{#if liquidityUsd !== undefined && liquidityUsd !== null}
						<div>
							<dt>Liquidity USD</dt>
							<dd>
								<NumberValue value={Number(liquidityUsd)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							volumeUsd24h: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const volumeUsd24h = prefetched.volumeUsd24h}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const volumeUsd24h = resolvedEntity.volumeUsd24h}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							priceChangePercent24h: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const priceChangePercent24h = prefetched.priceChangePercent24h}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priceChangePercent24h = resolvedEntity.priceChangePercent24h}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							transactionBuys24h: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionBuys24h = prefetched.transactionBuys24h}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionBuys24h = resolvedEntity.transactionBuys24h}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							transactionSells24h: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionSells24h = prefetched.transactionSells24h}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionSells24h = resolvedEntity.transactionSells24h}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							marketCapUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const marketCapUsd = prefetched.marketCapUsd}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const marketCapUsd = resolvedEntity.marketCapUsd}
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

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Dexscreener_OpenApi,
						],
						fields: {
							fdvUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fdvUsd = prefetched.fdvUsd}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fdvUsd = resolvedEntity.fdvUsd}
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
					<ResourceBoundary
						resource={
							selection({
								sources: [
									Source.Dexscreener_OpenApi,
								],
								fields: {
									dexscreenerLabels: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const dexscreenerLabels = prefetched.dexscreenerLabels}
							{#if dexscreenerLabels !== undefined && dexscreenerLabels !== null}
								{(dexscreenerLabels?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dexscreenerLabels = resolvedEntity.dexscreenerLabels}
							{#if dexscreenerLabels !== undefined && dexscreenerLabels !== null}
								{(dexscreenerLabels?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
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
							selection[EntityProxyField]<EntityType.LiquidityPool, false>('$parentLiquidityPool', {
								sources: [
									Source.Dexscreener_OpenApi,
								],
							})
						}
					>
						{#snippet children(liquidityPool)}
							{#if liquidityPool[EntityMetaKey.Selector] != null}
								<LiquidityPoolView
									selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
									prefetched={liquidityPool}
									href={
										(liquidityPool[EntityMetaKey.Selector].$network !== undefined && liquidityPool[EntityMetaKey.Selector].$network.caip2 !== undefined && liquidityPool[EntityMetaKey.Selector].$network.caip2.reference !== undefined && liquidityPool[EntityMetaKey.Selector].id !== undefined ? resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
											chainId: String(liquidityPool[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											poolId: String(liquidityPool[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
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
