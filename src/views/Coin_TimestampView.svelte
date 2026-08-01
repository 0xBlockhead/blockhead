<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.Coin_Timestamp> = $props()

	const coinTimestamp = $derived(selection({
		fields: {
			marketCap: true,
			marketCapUsd: true,
			change24hPercent: true,
		},
	}))
	const titleFallback = 'coin timestamp'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					coinId: selection.entitySelector.$coin.coinId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<CoinView
			selection={select(EntityType.Coin, selection.entitySelector.$coin)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={coinTimestamp}>
			{#snippet children(entity)}
				{[String(entity.marketCap ?? ''), String(entity.marketCapUsd ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={coinTimestamp}>
			{#snippet children(entity)}
				{@const change24hPercent = entity.change24hPercent}
				{#if change24hPercent != null}
					<span data-text="muted">
						{change24hPercent}
						<span>%</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							marketCapRank: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const marketCapRank = entity.marketCapRank}
					{#if marketCapRank != null}
						<div>
							<dt>Market cap rank</dt>
							<dd>
								{marketCapRank}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={coinTimestamp}
			>
				{#snippet children(entity)}
					{@const marketCap = entity.marketCap}
					{#if marketCap != null}
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
				resource={coinTimestamp}
			>
				{#snippet children(entity)}
					{@const marketCapUsd = entity.marketCapUsd}
					{#if marketCapUsd != null}
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
				resource={coinTimestamp}
			>
				{#snippet children(entity)}
					{@const change24hPercent = entity.change24hPercent}
					{#if change24hPercent != null}
						<div>
							<dt>24h change</dt>
							<dd>
								{change24hPercent}
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
						fields: {
							totalSupply: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSupply = entity.totalSupply}
					{#if totalSupply != null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{totalSupply}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerAssetId = entity.providerAssetId}
					{#if providerAssetId != null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{providerAssetId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Coin</dt>
				<dd>
					<CoinView
						selection={select(EntityType.Coin, selection.entitySelector.$coin)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
