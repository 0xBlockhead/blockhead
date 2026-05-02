<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { hasBeaconDataForChainId } from '$/constants/BeaconConsensus.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,

		title = 'Slots',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof EntityType.BeaconSlot>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const networkIdKey = $derived(
		stringify(entityFieldReference.entityId),
	)

	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight! })
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.Source],
						Source.Voltaire_JsonRpc,
					)
				))
				.select(({ blockHeight }) => ({
					height: blockHeight[EntityMetaKey.Value],
				}))
				.findOne()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => networkIdKey,
		],
	)

	const beaconSlotsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$beaconSlots: entityFieldCollections[EntityType.Network]['$$beaconSlots']! })
				.where(({ $$beaconSlots }) => (
					eq(
						$$beaconSlots[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ $$beaconSlots }) => (
					eq(
						$$beaconSlots[EntityMetaKey.Source],
						Source.Beacon_Rest,
					)
				))
				.orderBy(({ $$beaconSlots }) => (
					$$beaconSlots[EntityMetaKey.IdKey]
				), 'desc')
				.limit(32)
				.select(({ $$beaconSlots }) => (
					{
						[EntityMetaKey.Id]: (
							$$beaconSlots[EntityMetaKey.Value][EntityMetaKey.Id]
						),
					}
				))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => networkIdKey,
			() => blockHeightQuery.data?.height,
		],
	)


	// Components
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSlot}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			placeholderText="Loading slots…"
			query={beaconSlotsQuery}
		>
			{#snippet children(slots)}
				<OrderedList
					items={new SvelteSet(slots ?? [])}
					getKey={(row) => (
						row[EntityMetaKey.Id].slot
					)}
					getStableItemKey={(row) => (
						stringify(
							row[EntityMetaKey.Id],
						)
					)}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}
						<p data-text="muted">
							{(
								hasBeaconDataForChainId(
									entityFieldReference.entityId.chainId,
								) ?
									'No consensus slots for this network yet. Try again shortly.'
								:
									'This execution chain has no mapped beacon (consensus) network.'
							)}
						</p>
					{/snippet}

					{#snippet Item({ item: row, isPlaceholder })}
						{#if isPlaceholder}
							<span data-placeholder>
								…
							</span>
						{:else if row}
							<BeaconSlotView
								entityId={row[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
									{
										networkId: String(
											row[EntityMetaKey.Id].$network.chainId,
										),
										slotNumber: String(
											row[EntityMetaKey.Id].slot,
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
		</QueryBoundary>
	{/snippet}
</EntitiesList>
