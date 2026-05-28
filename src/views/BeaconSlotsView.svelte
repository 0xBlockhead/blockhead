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
		collapsible = true,
				...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconSlot>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSlot}
	{title}
	bind:open	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon consensus slots ordered in time; proposer duties and attestations are scheduled per slot.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.EvmNetwork ?
						({
							blockHeight: { $: [Source.Voltaire_JsonRpc] },
							$$beaconSlots: { $: [Source.Beacon_Rest] },
						})
					:
						({
							$$beaconSlots: { $: [Source.Beacon_Rest] },
						})
				),
			)}
			{@const slots = derive(
				parent,
				(parent): Entity<typeof schema, EntityType.BeaconSlot>[] => (
					(parent.$$beaconSlots ?? []).slice(0, 32)
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<ResourceBoundary
					resource={slots}
					placeholderText="Loading slots…"
				>
					{#snippet children(slots)}
						<OrderedList
							items={slots}
							getKey={(slot) => stringify(slot[EntityMetaKey.Id])}
							getSortKey={(slot) => (
								-slot[EntityMetaKey.Id].slot
							)}
							placeholderRanges={[]}
							orientation={ListOrientation.Column}
						>
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
						</OrderedList>
					{/snippet}
				</ResourceBoundary>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
