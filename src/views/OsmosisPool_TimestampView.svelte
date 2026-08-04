<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.OsmosisPool_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Osmosis_LCD_Rest,
		],
	}))
	const osmosisPoolTimestamp = $derived(viewSelection({
		fields: {
			spotPrice: true,
		},
	}))
	const titleFallback = $derived([selection.entitySelector.baseAssetDenom, selection.entitySelector.quoteAssetDenom].filter(Boolean).join(' ') || 'Osmosis pool timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import OsmosisPoolView from '$/views/OsmosisPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.OsmosisPool_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={osmosisPoolTimestamp}>
			{#snippet children(entity)}
				{entity.spotPrice || [selection.entitySelector.baseAssetDenom, selection.entitySelector.quoteAssetDenom].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<OsmosisPoolView
						selection={select(EntityType.OsmosisPool, selection.entitySelector.$pool)}
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
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.source}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Base asset denom</dt>
				<dd>
					{selection.entitySelector.baseAssetDenom}
				</dd>
			</div>

			<div>
				<dt>Quote asset denom</dt>
				<dd>
					{selection.entitySelector.quoteAssetDenom}
				</dd>
			</div>

			<div>
				<dt>Spot price</dt>
				<dd>
					<ResourceBoundary
						resource={osmosisPoolTimestamp}
					>
						{#snippet children(entity)}
							{entity.spotPrice}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
