<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Slots',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconSlot>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const beaconParent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		entityFieldReference.entityType === EntityType.Network ?
			({
				blockHeight: { $: [Source.Voltaire_JsonRpc] },
				$$beaconSlots: { $: [Source.Beacon_Rest] },
			})
		:
			({
				$$beaconSlots: { $: [Source.Beacon_Rest] },
			}),
	)

	const slots = derive(
		beaconParent,
		(merged): Entity<typeof schema, EntityType.BeaconSlot>[] => (
			(merged.$$beaconSlots ?? [])
				.toSorted((a, b) => (
					b[EntityMetaKey.Id].slot - a[EntityMetaKey.Id].slot
				))
				.slice(0, 32)
		),
	)
</script>


<EntitiesList
	entityType={EntityType.BeaconSlot}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<ResourceBoundary
				resource={slots}
				placeholderText="Loading slots…"
			>
				{#snippet children(loaded)}
					<OrderedList
						items={loaded}
						getKey={(slot) => stringify(slot[EntityMetaKey.Id])}
						getSortKey={(slot) => slot[EntityMetaKey.Id].slot}
						placeholderRanges={[]}
						orientation={ListOrientation.Column}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No recent slots for this network yet.
							</p>
						{/snippet}

						{#snippet Item({ item: slot, isPlaceholder })}
							{#if isPlaceholder === false}
								<BeaconSlotView
									entityId={slot[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
										{
											networkId: String(
												entityFieldReference.entityType === EntityType.Network ?
													entityFieldReference.entityId.chainId
												:
													entityFieldReference.entityId.$network.chainId,
											),
											slotNumber: String(
												slot[EntityMetaKey.Id].slot,
											),
										},
									)}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/if}
						{/snippet}
					</OrderedList>
				{/snippet}
			</ResourceBoundary>
		{/key}
	{/snippet}
</EntitiesList>
