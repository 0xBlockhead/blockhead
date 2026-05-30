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
		title = 'Slashings',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconSlashing>
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

	const slashings = derive(
		parent,
		(parent): Entity<typeof schema, EntityType.BeaconSlashing>[] => (
			parent[entityFieldReference.fieldName]
			?? []
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSlashing}
	{title}
	bind:open
	getKey={(slashing) => `${String(slashing[EntityMetaKey.Id].slot)}:${slashing[EntityMetaKey.Id].kind}:${String(slashing[EntityMetaKey.Id].index)}`}
	resource={slashings}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">No slashings in the loaded slot.</p>
	{/snippet}

	{#snippet Item({ item: slashing })}
		<div class="entity-details">
			<dl data-column-item="center">
				<div>
					<dt>Kind</dt>
					<dd>{slashing[EntityMetaKey.Id].kind}</dd>
				</div>

				<div>
					<dt>Slot</dt>
					<dd>{String(slashing[EntityMetaKey.Id].slot)}</dd>
				</div>
			</dl>
		</div>
	{/snippet}
</EntitiesList>
