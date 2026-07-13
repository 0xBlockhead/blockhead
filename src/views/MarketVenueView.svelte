<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const marketVenue = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue')
	const viewDomId = $derived('market-venue-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketVenue}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									marketVenueId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const marketVenueId = pendingEntity.marketVenueId}
							{#if marketVenueId !== undefined && marketVenueId !== null}
								{String((marketVenueId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const marketVenueId = resolvedEntity.marketVenueId}
							{#if marketVenueId !== undefined && marketVenueId !== null}
								{String((marketVenueId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<MarketsView
				selection={
						selection.$$markets({
							sources: [
								Source.Constants_Internal,
							],
						})
					}
				title='Markets'
				href={resolve('/markets')}
				id='MarketsView-markets'
			/>
		{/if}
	{/snippet}
</EntityView>
