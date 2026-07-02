<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Coin_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Coin_Timestamp>>
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

	const coinTimestamp = $derived(selection({
		fields: {
			marketCap: true,
			marketCapUsd: true,
			change24hPercent: true,
			marketCapRank: true,
			totalSupply: true,
			transport: true,
			providerAssetId: true,
		},
	}))
	const titleFallback = $derived('coin timestamp')
	const viewDomId = $derived('coin-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/coin/[coinId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			coinId: String(({ ...selection.entitySelector, ...prefetched }).$coin.coinId),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<CoinView
				selection={select(EntityType.Coin, selection.entitySelector.$coin)}
				href={
						resolve('/(assets)/coin/[coinId]', {
							coinId: String(selection.entitySelector.$coin.coinId),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet Pending()}
					<CoinView
						selection={select(EntityType.Coin, selection.entitySelector.$coin)}
						href={
							resolve('/(assets)/coin/[coinId]', {
								coinId: String(selection.entitySelector.$coin.coinId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<CoinView
						selection={select(EntityType.Coin, selection.entitySelector.$coin)}
						href={
							resolve('/(assets)/coin/[coinId]', {
								coinId: String(selection.entitySelector.$coin.coinId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).marketCap) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).marketCapUsd) ?? '')].filter(Boolean).join(' ') || title || 'coin timestamp'}
		{:else}
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).marketCap) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).marketCapUsd) ?? '')].filter(Boolean).join(' ') || title || 'coin timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.marketCap) ?? ''), String((entity.marketCapUsd) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const change24hPercent0 = prefetched.change24hPercent}
			{#if change24hPercent0 !== undefined && change24hPercent0 !== null}
				<span data-text="muted">
					{String((change24hPercent0) ?? '')}
					<span>%</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet Pending()}
					{@const change24hPercent0 = prefetched.change24hPercent}
					{#if change24hPercent0 !== undefined && change24hPercent0 !== null}
						<span data-text="muted">
							{String((change24hPercent0) ?? '')}
							<span>%</span>
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const change24hPercent0 = entity.change24hPercent}
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
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet Pending()}
					{@const marketCapRank = prefetched.marketCapRank ?? selection.entitySelector.marketCapRank}
					{#if marketCapRank !== undefined && marketCapRank !== null}
						<div>
							<dt>Market cap rank</dt>
							<dd>
								{String((marketCapRank) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const marketCapRank = entity.marketCapRank ?? selection.entitySelector.marketCapRank ?? prefetched.marketCapRank}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={coinTimestamp}>
				{#snippet Pending()}
					{@const totalSupply = prefetched.totalSupply ?? selection.entitySelector.totalSupply}
					{#if totalSupply !== undefined && totalSupply !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{String((totalSupply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const totalSupply = entity.totalSupply ?? selection.entitySelector.totalSupply ?? prefetched.totalSupply}
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

			<ResourceBoundary resource={coinTimestamp}>
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

			<ResourceBoundary resource={coinTimestamp}>
				{#snippet Pending()}
					{@const providerAssetId = prefetched.providerAssetId ?? selection.entitySelector.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const providerAssetId = entity.providerAssetId ?? selection.entitySelector.providerAssetId ?? prefetched.providerAssetId}
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
					<ResourceBoundary resource={coinTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={coinTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
