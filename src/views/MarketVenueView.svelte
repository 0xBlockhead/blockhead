<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(marketVenues)/market-venue/[marketVenueId]',
			{
				marketVenueId: entityId.marketVenueId,
			},
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MarketVenue>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const marketVenue = useEntity(
		EntityType.MarketVenue,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			label: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	{entityId}
	href={href}
	title={marketVenue.label ?? entityId.marketVenueId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={marketVenue}
			placeholderText="Loading market venue…"
		>
			{#snippet children(loadedMarketVenue)}
				{loadedMarketVenue.label ?? entityId.marketVenueId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.MarketVenue}
			{entityId}
		/>
		<MarketsView
			href={resolve('/markets')}
			entityFieldReference={{
				entityType: EntityType.MarketVenue,
				entityId,
				fieldName: '$$markets',
			}}
			open={false}
			title="Markets"
		/>
	{/snippet}
</EntityView>
