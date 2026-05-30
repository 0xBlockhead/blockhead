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
		title = 'Sync committees',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconSyncCommittee>
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
				$limit: 4,
			},
		},
	)

	const committees = derive(
		parent,
		(parent): Entity<typeof schema, EntityType.BeaconSyncCommittee>[] => (
			parent[entityFieldReference.fieldName]
			?? []
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSyncCommittee}
	{title}
	bind:open
	getKey={(committee) => String(committee[EntityMetaKey.Id].period)}
	resource={committees}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">No sync committee loaded yet.</p>
	{/snippet}

	{#snippet Item({ item: committee })}
		<div class="entity-details">
			<dl data-column-item="center">
				<div>
					<dt>Period</dt>
					<dd>{String(committee[EntityMetaKey.Id].period)}</dd>
				</div>
			</dl>
		</div>
	{/snippet}
</EntitiesList>
