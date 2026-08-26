<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainMarket_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer,
		],
	}))
	const dydxChainMarketTimestamp = $derived(viewSelection({
		fields: {
			fundingRate: true,
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
				{(entity.fundingRate ?? '') || String(selection.entitySelector.timestampMs)}
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
		</dl>
	{/snippet}
</EntityView>
