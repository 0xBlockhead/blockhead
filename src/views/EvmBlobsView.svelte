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

		title = 'Blobs',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlob>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight })
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
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
		],
	)

	const blobsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$blobs: entityFieldCollections[EntityType.Network]['$$blobs'] })
				.where(({ $$blobs }) => (
					eq(
						$$blobs[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ $$blobs }) => (
					eq(
						$$blobs[EntityMetaKey.Source],
						Source.Voltaire_JsonRpc,
					)
				))
				.orderBy(({ $$blobs }) => (
					$$blobs[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(32)
				.select(({ $$blobs }) => (
					{ value: $$blobs[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => blockHeightQuery.data?.height,
		],
	)


	// Components
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmBlob}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			query={blobsQuery}
			placeholderText="Loading blobs…"
		>
			<div data-e2e="network-blobs-list">
				<OrderedList
					items={blobsQuery.data?.map(({ value }) => value) ?? []}
					getKey={(row) => (
						row[EntityMetaKey.IdKey]
					)}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No EIP-4844 blobs in the sampled recent blocks for this network (or the RPC did
							not return full transactions).
						</p>
					{/snippet}

					{#snippet Item({ item: row, isPlaceholder })}
						{#if isPlaceholder}
							<span data-placeholder>
								…
							</span>
						{:else if row}
							<EvmBlobView
								entityId={row[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(blobs)/blob/[transactionId]/[blobIndex]',
									{
										networkId: String(
											row[EntityMetaKey.Id].$network.chainId,
										),
										transactionId: row[EntityMetaKey.Id].txHash,
										blobIndex: String(row[EntityMetaKey.Id].blobIndex),
									},
								)}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</OrderedList>
			</div>
		</QueryBoundary>
	{/snippet}
</EntitiesList>
