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
		title = 'Withdrawals',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconWithdrawal>
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

	const withdrawals = derive(
		parent,
		(parent): Entity<typeof schema, EntityType.BeaconWithdrawal>[] => (
			parent[entityFieldReference.fieldName]
			?? []
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconWithdrawal}
	{title}
	bind:open
	getKey={(withdrawal) => `${String(withdrawal[EntityMetaKey.Id].slot)}:${String(withdrawal[EntityMetaKey.Id].index)}`}
	resource={withdrawals}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">No withdrawals loaded yet.</p>
	{/snippet}

	{#snippet Item({ item: withdrawal })}
		<div class="entity-details">
			<dl data-column-item="center">
				<div>
					<dt>Slot</dt>
					<dd>{String(withdrawal[EntityMetaKey.Id].slot)}</dd>
				</div>

				<div>
					<dt>Withdrawal index</dt>
					<dd>{String(withdrawal[EntityMetaKey.Id].index)}</dd>
				</div>
			</dl>
		</div>
	{/snippet}
</EntitiesList>
