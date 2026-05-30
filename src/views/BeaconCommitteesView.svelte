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
		title = 'Committees',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconCommittee>
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

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Beacon_Rest,
				],
				$limit: 16,
			},
		},
	)

	const committees = derive(
		parent,
		(parent): Entity<typeof schema, EntityType.BeaconCommittee>[] => (
			parent[entityFieldReference.fieldName]
			?? []
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconCommittee}
	{title}
	bind:open
	getKey={(committee) => `${String(committee[EntityMetaKey.Id].slot)}:${String(committee[EntityMetaKey.Id].index)}`}
	resource={committees}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">No committees loaded yet.</p>
	{/snippet}

	{#snippet Item({ item: committee })}
		<div class="entity-details">
			<dl data-column-item="center">
				<div>
					<dt>Slot</dt>
					<dd>{String(committee[EntityMetaKey.Id].slot)}</dd>
				</div>

				<div>
					<dt>Committee index</dt>
					<dd>{String(committee[EntityMetaKey.Id].index)}</dd>
				</div>
			</dl>
		</div>
	{/snippet}
</EntitiesList>
