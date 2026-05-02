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

		title = 'Epochs',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof EntityType.BeaconEpoch>
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

	const beaconEpochsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$beaconEpochs: entityFieldCollections[EntityType.Network]['$$beaconEpochs']! })
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
					$$beaconEpochs[EntityMetaKey.IdKey]
				), 'desc')
				.limit(16)
				.select(({ $$beaconEpochs }) => (
					{
						[EntityMetaKey.Id]: (
							$$beaconEpochs[EntityMetaKey.Value][EntityMetaKey.Id]
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
			{#snippet children(epochs)}
				<OrderedList
					items={new SvelteSet(epochs ?? [])}
					getKey={(row) => (
						row[EntityMetaKey.Id].epoch
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
									'No consensus epochs for this network yet. Try again shortly.'
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
			{/snippet}
		</QueryBoundary>
	{/snippet}
</EntitiesList>
