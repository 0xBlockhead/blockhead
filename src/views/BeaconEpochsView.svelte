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

		title = 'Epochs',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconEpoch>
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
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight })
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

	const beaconEpochsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$beaconEpochs: entityFieldCollections[EntityType.Network]['$$beaconEpochs'] })
				.where(({ $$beaconEpochs }) => (
					eq(
						$$beaconEpochs[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ $$beaconEpochs }) => (
					eq(
						$$beaconEpochs[EntityMetaKey.Source],
						Source.Beacon_Rest,
					)
				))
				.orderBy(({ $$beaconEpochs }) => (
					$$beaconEpochs[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(16)
				.select(({ $$beaconEpochs }) => (
					{ value: $$beaconEpochs[EntityMetaKey.Value] }
				))
				.distinct()
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
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconEpoch}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			placeholderText="Loading epochs…"
			query={beaconEpochsQuery}
		>
			<OrderedList
				items={beaconEpochsQuery.data?.map(({ value }) => value) ?? []}
				getKey={(row) => (
					row[EntityMetaKey.Id].epoch
				)}
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
						<BeaconEpochView
							entityId={row[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
								{
									networkId: String(
										row[EntityMetaKey.Id].$network.chainId,
									),
									epochNumber: String(
										row[EntityMetaKey.Id].epoch,
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
