<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		type EntityId,
		schema,
	} from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const evmBlockListLink = (id: unknown) => {
		if (typeof id !== 'object' || id === null) return undefined
		if (!('$network' in id) || !('blockNumber' in id)) return undefined
		const nw = Reflect.get(id, '$network')
		if (typeof nw !== 'object' || nw === null || !('chainId' in nw)) return undefined
		const chainId = Reflect.get(nw, 'chainId')
		const blockNumber = Reflect.get(id, 'blockNumber')
		return (
			typeof chainId === 'number'
			&& typeof blockNumber === 'bigint' ?
				{ chainId, blockNumber }
			:
				undefined
		)
	}

	const evmBlockRowNumberKey = (row: { [EntityMetaKey.Id]: unknown }) => {
		const link = evmBlockListLink(row[EntityMetaKey.Id])
		return link != null ? Number(link.blockNumber) : 0
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'


	// Props
	let {
		entityId,

		title = 'Blocks',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Network>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// (Derived)
	const networkIdKey = $derived(
		stringify(entityId),
	)


	const blocksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$evmBlocks: entityFieldCollections[EntityType.Network]['$$evmBlocks']! })
				.where(({ $$evmBlocks }) => (
					eq(
						$$evmBlocks[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ $$evmBlocks }) => (
					eq(
						$$evmBlocks[EntityMetaKey.Source],
						Source.Blockscout,
					)
				))
				.select(({ $$evmBlocks }) => ({
					[EntityMetaKey.Id]: (
						$$evmBlocks[EntityMetaKey.Value][EntityMetaKey.Id]
					),
				}))
		),
		[() => networkIdKey],
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

			{#snippet children(blockRows)}
				<OrderedList
					items={new SvelteSet(blockRows ?? [])}
					getKey={evmBlockRowNumberKey}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No recent blocks in collections for this network (resolve Blockscout / RPC).
						</p>
					{/snippet}

					{#snippet Item({ item: row, isPlaceholder })}
						{#if isPlaceholder}
							<span data-placeholder>
								…
							</span>
						{:else if row}
							{@const link = evmBlockListLink(row[EntityMetaKey.Id])}
							{#if link != null}
								<EvmBlockView
									entityId={{
										$network: { chainId: link.chainId },
										blockNumber: link.blockNumber,
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
										{
											networkId: String(link.chainId),
											blockNumber: String(link.blockNumber),
										},
									)}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{:else}
								<span data-text="muted">
									{String(row[EntityMetaKey.Id])}
								</span>
							{/if}
						{/if}
					{/snippet}
				</OrderedList>
			{/snippet}
		</QueryBoundary>
	{/snippet}
</EntitiesList>
