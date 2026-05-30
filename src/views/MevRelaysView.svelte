<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Relays',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MevRelay>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntitiesList
	entityType={EntityType.MevRelay}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet body({})}
		{#if open}
			{@const network = useEntity(
				EntityType.EvmNetwork,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Constants_Internal,
						],
						$limit: 16,
					},
				},
			)}
			{@const relays = derive(
				network,
				(network): Entity<typeof schema, EntityType.MevRelay>[] => (
					network[entityFieldReference.fieldName]
					?? []
				),
			)}
			<ResourceBoundary
				placeholderText="Loading relays…"
				resource={relays}
			>
				{#snippet children(relays)}
					<OrderedList
						getKey={(row) => row[EntityMetaKey.Id].host}
						items={relays}
						orientation={ListOrientation.Column}
						placeholderRanges={[]}
					>
						{#snippet Empty()}
							<p data-text="muted">No MEV relays mapped for this network.</p>
						{/snippet}

						{#snippet Item({ item: relay })}
							<div class="entity-details">
								<dl data-column-item="center">
									<div>
										<dt>Host</dt>
										<dd><code>{relay[EntityMetaKey.Id].host}</code></dd>
									</div>
								</dl>
							</div>
						{/snippet}
					</OrderedList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
