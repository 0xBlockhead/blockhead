<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.MarketVenue>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MarketVenue>>
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

	const marketVenue = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue')
	const viewDomId = $derived('market-venue-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue'}
		{:else}
			<ResourceBoundary resource={marketVenue}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A curated exchange or venue identifier used to group markets.
		</p>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<MarketsView
				selection={selection[EntityProxyField]<EntityType.Market>('$$markets')}
				title='Markets'
				href={resolve('/(assets)/markets')}
				id='MarketsView-$$markets'
			/>
		{/if}
	{/snippet}
</EntityView>
