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
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainMarket_Timestamp>, 'prefetched'> = $props()

	const market = $derived(selection.entitySelector.$market)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer,
			Source.KingnodesDydxNode,
		],
	}))
	const dydxChainMarketTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import DydxChainMarketView from '$/views/DydxChainMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainMarket_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(dydx)/market/[ticker=stringSegment]/(dydxChainMarket)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in market.$network.$network ?
							caip2StringFromValue(market.$network.$network.caip2)
						:
							market.$network.$network.slug
					),
					ticker: market.ticker,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dydxChainMarketTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>market</dt>
				<dd>
					<DydxChainMarketView
						selection={select(EntityType.DydxChainMarket, selection.entitySelector.$market)}
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

			<ResourceBoundary
				resource={dydxChainMarketTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							oraclePrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const oraclePrice = entity.oraclePrice}
					{#if oraclePrice != null}
						<div>
							<dt>oracle price</dt>
							<dd>
								{oraclePrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fundingRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fundingRate = entity.fundingRate}
					{#if fundingRate != null}
						<div>
							<dt>funding rate</dt>
							<dd>
								{fundingRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							openInterest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const openInterest = entity.openInterest}
					{#if openInterest != null}
						<div>
							<dt>open interest</dt>
							<dd>
								{openInterest}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nextFundingAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextFundingAtMs = entity.nextFundingAtMs}
					{#if nextFundingAtMs != null}
						<div>
							<dt>next funding at ms</dt>
							<dd>
								<Timestamp timestamp={nextFundingAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
