<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
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
	const evmTxListLink = (id: unknown) => {
		if (typeof id !== 'object' || id === null) return undefined
		if (!('$network' in id) || !('txHash' in id)) return undefined
		const nw = Reflect.get(id, '$network')
		if (typeof nw !== 'object' || nw === null || !('chainId' in nw)) return undefined
		const chainId = Reflect.get(nw, 'chainId')
		const txHash = Reflect.get(id, 'txHash')
		return (
			typeof chainId === 'number'
			&& typeof txHash === 'string'
			&& txHash.startsWith('0x') ?
				{ chainId, txHash }
			:
				undefined
		)
	}

	const evmTxRowSortKey = (row: { [EntityMetaKey.Id]: unknown }) => (
		evmTxListLink(row[EntityMetaKey.Id])?.txHash
		?? stringify(row[EntityMetaKey.Id])
		?? ''
	)


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'


	// Props
	let {
		entityId,

		title = 'Transactions',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Network> | EntityId<typeof schema, EntityType.EvmBlock>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const parentKey = $derived(
		stringify(entityId),
	)

	const parentIsBlock = $derived(
		'blockNumber' in entityId,
	)

	const transactionsQuery = useLiveQuery(
		(queryBuilder) => (
			parentIsBlock ?
				queryBuilder
					.from({ $$evmTransactions: entityFieldCollections[EntityType.EvmBlock]['$$evmTransactions']! })
					.where(({ $$evmTransactions }) => (
						eq(
							$$evmTransactions[EntityMetaKey.ParentIdKey],
							parentKey,
						)
					))
					.where(({ $$evmTransactions }) => (
						eq(
							$$evmTransactions[EntityMetaKey.Source],
							Source.Blockscout,
						)
					))
					.select(({ $$evmTransactions }) => ({
						[EntityMetaKey.Id]: (
							$$evmTransactions[EntityMetaKey.Value][EntityMetaKey.Id]
						),
					}))
			:
				queryBuilder
					.from({ $$evmTransactions: entityFieldCollections[EntityType.Network]['$$evmTransactions']! })
					.where(({ $$evmTransactions }) => (
						eq(
							$$evmTransactions[EntityMetaKey.ParentIdKey],
							parentKey,
						)
					))
					.where(({ $$evmTransactions }) => (
						eq(
							$$evmTransactions[EntityMetaKey.Source],
							Source.Blockscout,
						)
					))
					.select(({ $$evmTransactions }) => ({
						[EntityMetaKey.Id]: (
							$$evmTransactions[EntityMetaKey.Value][EntityMetaKey.Id]
						),
					}))
		),
		[() => parentKey, () => parentIsBlock],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTransaction}
	{title}
	bind:open
	query={transactionsQuery}
	items={new SvelteSet(transactionsQuery.data ?? [])}
	getKey={(row) => stringify(row[EntityMetaKey.Id]) ?? ''}
	getSortValue={evmTxRowSortKey}
	placeholderKeys={new SvelteSet()}
	unorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No transactions in collections for this scope (resolve Blockscout / RPC).
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const link = evmTxListLink(row[EntityMetaKey.Id])}
			{#if link != null}
				<EvmTransactionView
					entityId={{
						$network: { chainId: link.chainId },
						txHash: link.txHash,
					}}
					href={resolve(
						'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
						{
							networkId: String(link.chainId),
							transactionId: link.txHash,
						},
					)}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{:else}
				<span data-text="muted">
					<code data-text="font-monospace">
						{String(row[EntityMetaKey.Id])}
					</code>
				</span>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
