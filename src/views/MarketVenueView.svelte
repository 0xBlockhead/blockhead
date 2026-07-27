<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.MarketVenue> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const marketVenue = $derived(viewSelection({
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.label ?? '') || (pendingEntity.marketVenueId ?? '') || 'Market venue')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]',
			{
				marketVenueId: String(selection.entitySelector.marketVenueId),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketVenue}>
			{#snippet children(entity)}
				{entity.label || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A curated exchange or venue identifier used to group markets.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Market venue ID</dt>
				<dd>
					{pendingEntity.marketVenueId}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const marketVenueMarketsViewMarketsResource = selection.$$markets}
		<ResourceBoundary
			resource={marketVenueMarketsViewMarketsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MarketsView
						selection={marketVenueMarketsViewMarketsResource}
						countResource={marketVenueMarketsViewMarketsResource.count}
						title='Markets'
						href={resolve('/(assets)/markets')}
						id='markets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
