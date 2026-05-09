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

		title = 'Blocks',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlock>
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

	const blocksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$blocks: entityFieldCollections[EntityType.Network]['$$blocks'] })
				.where(({ $$blocks }) => (
					eq(
						$$blocks[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ $$blocks }) => (
					eq(
						$$blocks[EntityMetaKey.Source],
						Source.Voltaire_JsonRpc,
					)
				))
				.orderBy(({ $$blocks }) => (
					$$blocks[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(16)
				.select(({ $$blocks }) => (
					{ value: $$blocks[EntityMetaKey.Value] }
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
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmBlock}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			query={blocksQuery}
			placeholderText="Loading blocks…"
		>
			<div data-e2e="network-blocks-list">
				<OrderedList
					items={blocksQuery.data?.map(({ value }) => value) ?? []}
					getKey={(row) => (
						row[EntityMetaKey.Id].blockNumber
					)}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No recent blocks for this network yet. Try again shortly.
						</p>
					{/snippet}

					{#snippet Item({ item: row, isPlaceholder })}
						{#if isPlaceholder}
							<span data-placeholder>
								…
							</span>
						{:else if row}
							<EvmBlockView
								entityId={row[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
									{
										networkId: String(
											row[EntityMetaKey.Id].$network.chainId,
										),
										blockNumber: String(
											row[EntityMetaKey.Id].blockNumber,
										),
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
