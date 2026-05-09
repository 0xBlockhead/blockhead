<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { ethereumExecutionForkByChainIdAndForkId } from '$/constants/EthereumExecutionForks.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const forkListLink = (id: EntityId<typeof schema, EntityType.NetworkFork>) => {
		const chainId = id.$network.chainId
		const forkId = id.forkId
		const catalog = ethereumExecutionForkByChainIdAndForkId[`${chainId}:${forkId}`]
		return {
			chainId,
			forkId,
			slug: catalog?.slug,
		}
	}

	const forkSortKey = (row: { [EntityMetaKey.Id]: EntityId<typeof schema, EntityType.NetworkFork> }) => {
		const { chainId, forkId } = forkListLink(
			row[EntityMetaKey.Id],
		)
		const catalog = ethereumExecutionForkByChainIdAndForkId[`${chainId}:${forkId}`]
		if (catalog === undefined) {
			return 0
		}
		return (
			catalog.activationBlock != null ? catalog.activationBlock
			: catalog.activationTimestamp != null ? catalog.activationTimestamp
			: catalog.activationEpoch != null ? catalog.activationEpoch
			: 0
		)
	}

	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,

		title = 'Forks',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkFork>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const forksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					forkFieldRow: entityFieldCollections[EntityType.Network]['$$forks'],
				})
				.where(({ forkFieldRow }) => (
					eq(
						forkFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ forkFieldRow }) => (
					eq(
						forkFieldRow[EntityMetaKey.Source],
						Source.Constants_Internal,
					)
				))
				.select(({ forkFieldRow }) => (
					{ value: forkFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)


	// Components
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import NetworkForkView from '$/views/NetworkForkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkFork}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			query={forksQuery}
			placeholderText="Loading forks…"
		>

			{#snippet children(forks)}
				<OrderedList
					items={forksQuery.data?.map(({ value }) => value) ?? []}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortKey={forkSortKey}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No forks cataloged for this chain yet.
						</p>
					{/snippet}

					{#snippet Item({ item: row, isPlaceholder })}
						{#if isPlaceholder}
							<span data-placeholder>
								…
							</span>
						{:else if row}
							{@const link = forkListLink(row[EntityMetaKey.Id])}
							<NetworkForkView
								entityId={{
									$network: { chainId: link.chainId },
									forkId: link.forkId,
								}}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]',
									{
										networkId: String(link.chainId),
										forkSlug: link.slug ?? link.forkId,
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
