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
		title = 'Builders',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MevBuilder>
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
	entityType={EntityType.MevBuilder}
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
							Source.MevRelay_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const builders = derive(
				network,
				(network): Entity<typeof schema, EntityType.MevBuilder>[] => (
					network[entityFieldReference.fieldName]
					?? []
				),
			)}
			<ResourceBoundary
				placeholderText="Loading builders…"
				resource={builders}
			>
				{#snippet children(builders)}
					<OrderedList
						getKey={(row) => row[EntityMetaKey.Id].builderPubkey}
						items={builders}
						orientation={ListOrientation.Column}
						placeholderRanges={[]}
					>
						{#snippet Empty()}
							<p data-text="muted">No MEV builders loaded yet.</p>
						{/snippet}

						{#snippet Item({ item: builder })}
							<div class="entity-details">
								<dl data-column-item="center">
									<div>
										<dt>Builder pubkey</dt>
										<dd><code>{builder[EntityMetaKey.Id].builderPubkey}</code></dd>
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
