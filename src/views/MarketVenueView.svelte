<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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

	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.marketVenueId || 'Market venue')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]',
				{
					marketVenueId: selection.entitySelector.marketVenueId,
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
		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources ?? [
						Source.Constants_Internal,
					],
				})({
					fields: {
						label: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{entity.label || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Market venue ID</dt>
				<dd>
					{selection.entitySelector.marketVenueId}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const marketsResource = selection.$$markets}
		<ResourceBoundary
			resource={marketsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MarketsView
						selection={marketsResource}
						countResource={marketsResource.count}
						title='Markets'
						href={resolve('/(assets)/markets')}
						id='markets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
