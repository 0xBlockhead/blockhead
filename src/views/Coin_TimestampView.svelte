<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.Coin_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Coin_Timestamp>>
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
	const coinTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			marketCap: true,
			marketCapUsd: true,
			change24hPercent: true,
		},
	}))
	const titleFallback = $derived('coin timestamp')
	const viewDomId = $derived('coin-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$coin !== undefined && pendingEntity.$coin.coinId !== undefined ? resolve('/coin/[coinId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			coinId: String(pendingEntity.$coin.coinId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<CoinView
						selection={select(EntityType.Coin, selection.entitySelector.$coin)}
						href={
						(selection.entitySelector.$coin.coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
							coinId: String(selection.entitySelector.$coin.coinId ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<CoinView
						selection={select(EntityType.Coin, selection.entitySelector.$coin)}
						href={
						(selection.entitySelector.$coin.coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
							coinId: String(selection.entitySelector.$coin.coinId ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.marketCap) ?? ''), String((pendingEntity.marketCapUsd) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.marketCap) ?? ''), String((resolvedEntity.marketCapUsd) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const change24hPercent0 = pendingEntity.change24hPercent}
			{#if change24hPercent0 !== undefined && change24hPercent0 !== null}
				<span data-text="muted">
					{String((change24hPercent0) ?? '')}
					<span>%</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const change24hPercent0 = resolvedEntity.change24hPercent}
					{#if change24hPercent0 !== undefined && change24hPercent0 !== null}
						<span data-text="muted">
							{String((change24hPercent0) ?? '')}
							<span>%</span>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							marketCapRank: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const marketCapRank = resolvedEntity.marketCapRank}
					{#if marketCapRank !== undefined && marketCapRank !== null}
						<div>
							<dt>Market cap rank</dt>
							<dd>
								{String((marketCapRank) ?? '')}
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
							marketCap: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const marketCap = resolvedEntity.marketCap}
					{#if marketCap !== undefined && marketCap !== null}
						<div>
							<dt>Market cap</dt>
							<dd>
								<NumberValue
									value={Number(marketCap)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
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
									value={Number(marketCapUsd)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
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
							change24hPercent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const change24hPercent = resolvedEntity.change24hPercent}
					{#if change24hPercent !== undefined && change24hPercent !== null}
						<div>
							<dt>24h change</dt>
							<dd>
								{String((change24hPercent) ?? '')}
								<span>%</span>
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
							totalSupply: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupply = resolvedEntity.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{String((totalSupply) ?? '')}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerAssetId = resolvedEntity.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Coin</dt>
				<dd>
					<CoinView
						selection={select(EntityType.Coin, selection.entitySelector.$coin, {})}
						href={
							(selection.entitySelector.$coin.coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
								coinId: String(selection.entitySelector.$coin.coinId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
