<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { marketVenueById } from '$/constants/MarketVenue.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Market venues',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketVenue>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
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

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[fieldName]: {},
				},
			)}
			{@const marketVenues = derive(
				parent,
				(parent) => (
					parent[fieldName] ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...entitiesListRest}
				entityType={EntityType.MarketVenue}
				getKey={(row) => row[EntityMetaKey.Id].marketVenueId}
				getSortValue={(row) => (
					marketVenueById[row[EntityMetaKey.Id].marketVenueId].label
				)}
				placeholderKeys={new SvelteSet()}
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
					{#if item}
						<MarketVenueView
							entityId={item[EntityMetaKey.Id]}
							href={resolve(
								'/(assets)/(marketVenues)/market-venue/[marketVenueId]',
								{ marketVenueId: item[EntityMetaKey.Id].marketVenueId },
							)}
							id={item[EntityMetaKey.Id].marketVenueId}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
