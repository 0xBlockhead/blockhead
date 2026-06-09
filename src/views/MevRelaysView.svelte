<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Relays',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MevRelay>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<EntitiesList
	entityType={EntityType.MevRelay}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet body()}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext, EntityType.EvmNetwork,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Constants_Internal,
						],
						limit: 16,
					},
				} }),
			)}
			{@const relays = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.MevRelay>[] => (
					parent.fields[entityFieldReference.fieldName]?.values
					?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.MevRelay}
				id={`${id}-items`}
				href={href}
				getKey={(relay) => relay[EntityMetaKey.Id].host}
				placeholderText="Loading relays…"
				resource={relays}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No MEV relays mapped for this network.</p>
				{/snippet}

				{#snippet Item({ item: relay })}
					<MevRelayView
						entityId={relay[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
