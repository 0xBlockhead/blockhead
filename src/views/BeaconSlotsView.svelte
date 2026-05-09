<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


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


	const parentIdKey = $derived(
		stringify(entityFieldReference.entityId),
	)

	const chainId = $derived(
		entityFieldReference.entityType === EntityType.Network ?
			entityFieldReference.entityId.chainId
		:
			entityFieldReference.entityId.$network.chainId,
	)

	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight })
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.ParentIdKey],
						parentIdKey,
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
			() => parentIdKey,
		],
	)

	const beaconSlotsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					$$beaconSlots: (
						entityFieldReference.entityType === EntityType.BeaconEpoch ?
							entityFieldCollections[EntityType.BeaconEpoch]['$$beaconSlots']!
						:
							entityFieldCollections[EntityType.Network]['$$beaconSlots']!
					),
				})
				.where(({ $$beaconSlots }) => (
					eq(
						$$beaconSlots[EntityMetaKey.ParentIdKey],
						parentIdKey,
					)
				))
				.where(({ $$beaconSlots }) => (
					eq(
						$$beaconSlots[EntityMetaKey.Source],
						Source.Beacon_Rest,
					)
				))
				.orderBy(({ $$beaconSlots }) => (
					$$beaconSlots[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(32)
				.select(({ $$beaconSlots }) => (
					{ value: $$beaconSlots[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => parentIdKey,
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
			<OrderedList
				items={beaconSlotsQuery.data?.map(({ value }) => value) ?? []}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortKey={(row) => row[EntityMetaKey.Id].slot}
				placeholderRanges={[]}
				orientation={ListOrientation.Column}
			>
				{#snippet Empty()}{/snippet}

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
		</QueryBoundary>
	{/snippet}
</EntitiesList>
