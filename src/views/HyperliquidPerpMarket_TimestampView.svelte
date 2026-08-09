<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidPerpMarket_Timestamp>, 'prefetched'> = $props()

	const perpMarket = $derived(selection.entitySelector.$perpMarket)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Hyperliquid,
		],
	}))
	const hyperliquidPerpMarketTimestamp = $derived(viewSelection({
		fields: {
			maxLeverage: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HyperliquidPerpMarketView from '$/views/HyperliquidPerpMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidPerpMarket_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'hyperliquid perp market timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/perp-market/[coin=stringSegment]/(hyperliquidPerpMarket)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in perpMarket.$network ?
							caip2StringFromValue(perpMarket.$network.caip2)
						:
							perpMarket.$network.slug
					),
					coin: perpMarket.coin,
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
		<HyperliquidPerpMarketView
			selection={select(EntityType.HyperliquidPerpMarket, selection.entitySelector.$perpMarket)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hyperliquidPerpMarketTimestamp}>
			{#snippet children(entity)}
				{@const maxLeverage = entity.maxLeverage}
				{#if maxLeverage != null}
					<NumberValue
						value={maxLeverage}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>perp market</dt>
				<dd>
					<HyperliquidPerpMarketView
						selection={select(EntityType.HyperliquidPerpMarket, selection.entitySelector.$perpMarket)}
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
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={hyperliquidPerpMarketTimestamp}
			>
				{#snippet children(entity)}
					{@const maxLeverage = entity.maxLeverage}
					{#if maxLeverage != null}
						<div>
							<dt>max leverage</dt>
							<dd>
								<NumberValue
									value={maxLeverage}
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
							onlyIsolated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const onlyIsolated = entity.onlyIsolated}
					{#if onlyIsolated != null}
						<div>
							<dt>only isolated</dt>
							<dd>
								{onlyIsolated}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
