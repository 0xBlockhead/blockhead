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
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Slots',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconSlot>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id'
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			entityFieldReference.entityType === EntityType.EvmNetwork ?
				{
					blockHeight: { $: [Source.Voltaire_JsonRpc] },
					[entityFieldReference.fieldName]: { $: [Source.Beacon_Rest] },
				}
			:
				{
					[entityFieldReference.fieldName]: { $: [Source.Beacon_Rest] },
				}
		),
	)

	const slots = derive(
		parent,
		(parent): Entity<typeof schema, EntityType.BeaconSlot>[] => (
			(parent[entityFieldReference.fieldName] ?? []).slice(0, 32)
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSlot}
	{title}
	bind:open
	getKey={(slot) => stringify(slot[EntityMetaKey.Id])}
	getSortValue={(slot) => -slot[EntityMetaKey.Id].slot}
	resource={slots}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon consensus slots ordered in time; proposer duties and attestations are scheduled per slot.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No slots yet.
		</p>
	{/snippet}

	{#snippet Item({ item: slot })}
		<BeaconSlotView
			entityId={slot[EntityMetaKey.Id]}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
