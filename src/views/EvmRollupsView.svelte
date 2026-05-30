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
		title = 'Rollups',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmRollup>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmRollup}
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
							Source.L2Beat_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const rollups = derive(
				network,
				(network): Entity<typeof schema, EntityType.EvmRollup>[] => (
					network[entityFieldReference.fieldName]
					?? []
				),
			)}
			<ResourceBoundary
				placeholderText="Loading rollups…"
				resource={rollups}
			>
				{#snippet children(rollups)}
					<OrderedList
						getKey={(row) => row[EntityMetaKey.Id].projectId}
						items={rollups}
						orientation={ListOrientation.Column}
						placeholderRanges={[]}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No rollups mapped here yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<EvmRollupView
								entityId={item[EntityMetaKey.Id]}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</OrderedList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
