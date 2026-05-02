<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { ethereumExecutionForkByChainIdAndForkId } from '$/constants/EthereumExecutionForks.ts'
	import { schema, type EntityFieldReference } from '$/schema/index.ts'
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
		const slug = typeof catalog?.slug === 'string' && catalog.slug.length > 0 ? catalog.slug : undefined
		return { chainId, forkId, slug }
	}

	const forkSortKey = (row: { [EntityMetaKey.Id]: EntityId<typeof schema, EntityType.NetworkFork> }) => {
		const { chainId, forkId } = forkListLink(
			row[EntityMetaKey.Id],
		)
		const catalog = ethereumExecutionForkByChainIdAndForkId[`${chainId}:${forkId}`]
		if (catalog === undefined) {
			return 0
		}
		const block = catalog.activationBlock
		const ts = catalog.activationTimestamp
		const epoch = catalog.activationEpoch
		return (
			typeof block === 'number' ? block
			: typeof ts === 'number' ? ts
			: typeof epoch === 'number' ? epoch
			: 0
		)
	}

	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,

		title = 'Forks',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof EntityType.NetworkFork>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// @ts-expect-error  useLiveQuery infers a single from(); two branch aliases
	const forksQuery = useLiveQuery(
		(queryBuilder) => {
			const pk = stringify(entityFieldReference.entityId)
			if (entityFieldReference.fieldName === '$$networkForks') {
				return (
					queryBuilder
						.from({ $$networkForks: entityFieldCollections[EntityType._Global]['$$networkForks']! })
						.where(({ $$networkForks }) => (
							eq(
								$$networkForks[EntityMetaKey.ParentIdKey],
								pk,
							)
						))
						.where(({ $$networkForks }) => (
							eq(
								$$networkForks[EntityMetaKey.Source],
								Source.Constants_Internal,
							)
						))
						.select(({ $$networkForks }) => ({
							[EntityMetaKey.Id]: (
								$$networkForks[EntityMetaKey.Value][EntityMetaKey.Id]
							),
						}))
				)
			}
			return (
				queryBuilder
					.from({ $$forks: entityFieldCollections[EntityType.Network]['$$forks']! })
					.where(({ $$forks }) => (
						eq(
							$$forks[EntityMetaKey.ParentIdKey],
							pk,
						)
					))
					.where(({ $$forks }) => (
						eq(
							$$forks[EntityMetaKey.Source],
							Source.Constants_Internal,
						)
					))
					.select(({ $$forks }) => ({
						[EntityMetaKey.Id]: (
							$$forks[EntityMetaKey.Value][EntityMetaKey.Id]
						),
					}))
			)
		},
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
					items={new SvelteSet(forks)}
					getKey={forkSortKey}
					getStableItemKey={(row) => stringify(row[EntityMetaKey.Id])}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No execution forks cataloged for this chain yet.
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
