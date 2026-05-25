<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// State
	let {
		title = 'Market venues',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
				...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketVenue>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.MarketVenue}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Exchanges, DEX protocols, and index publishers that scope how market ids are formed and which feeds apply.
		</p>
		<p>
			Catalog markets reference a venue in their id (for example <code>Binance:ETH-USD</code>).
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No market venues in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[entityFieldReference.fieldName]: {
						label: {},
					},
				},
			)}
			{@const marketVenues = derive(
				parent,
				(parent) => (
					parent[entityFieldReference.fieldName] ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...EntitiesListProps}
				entityType={EntityType.MarketVenue}
				getKey={(row) => row[EntityMetaKey.Id].marketVenueId}
				getSortValue={(row) => (
					row.label ?? row[EntityMetaKey.Id].marketVenueId
				)}
				resource={marketVenues}
				{title}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No market venues in this context yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<MarketVenueView
						entityId={item[EntityMetaKey.Id]}
						id={item[EntityMetaKey.Id].marketVenueId}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
