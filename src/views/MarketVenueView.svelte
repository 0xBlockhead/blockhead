<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { marketVenueById } from '$/constants/MarketVenue.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.MarketVenue>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'title'
			| 'open'
			| 'layout'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	useEntity(
		EntityType.MarketVenue,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			...(open && {
				label: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	{entityId}
	{href}
	title={marketVenueById[entityId.marketVenueId].label}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.MarketVenue}
			{entityId}
		/>

		<MarketsView
			entityFieldReference={{
				entityType: EntityType._Global,
				entityId: {},
				fieldName: '$$markets',
			}}
			filterMarketVenueId={entityId.marketVenueId}
			href={resolve('/markets')}
			open={false}
			title="Markets"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
