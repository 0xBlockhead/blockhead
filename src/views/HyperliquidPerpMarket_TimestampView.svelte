<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidPerpMarket_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HyperliquidPerpMarketView from '$/views/HyperliquidPerpMarketView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidPerpMarket_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxLeverage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxLeverage = entity.maxLeverage}
					{#if maxLeverage != null}
						<div>
							<dt>max leverage</dt>
							<dd>
								{maxLeverage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
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
