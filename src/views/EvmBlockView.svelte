<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmBlock>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Summary'
		>
	> = $props()


	const blockIdKey = $derived(
		stringify(entityId),
	)

	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
	)

	const blockHash = $derived(
		entityId.hash,
	)

	const blockQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EvmBlock] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						blockIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => blockIdKey],
	)

	const blockRow = $derived(
		(
			blockQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Blockscout,
			)?.row
			?? blockQuery.data?.[0]?.row
		)
	)

	const blockField = $derived(
		(() => {
			const bag = blockRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				timestamp: typeof b.timestamp === 'number' ? b.timestamp : undefined,
				gasUsed: typeof b.gasUsed === 'bigint' ? b.gasUsed : undefined,
				gasLimit: typeof b.gasLimit === 'bigint' ? b.gasLimit : undefined,
				baseFeePerGas: typeof b.baseFeePerGas === 'bigint' ? b.baseFeePerGas : undefined,
				transactionCount: typeof b.transactionCount === 'number' ? b.transactionCount : undefined,
			}
		})(),
	)

	const blockTitle = $derived(
		`Block ${entityId.blockNumber}`,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	{entityId}
	title={blockTitle}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet SummaryContent()}
		{#if chainId != null}
			<dl data-definition-list="vertical">
				<div>
					<dt>Chain ID</dt>
					<dd>{String(chainId)}</dd>
				</div>
				<div>
					<dt>Number</dt>
					<dd>{String(entityId.blockNumber)}</dd>
				</div>
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.EvmBlock}
			{entityId}
		>
			<QueryBoundary
				query={blockQuery}
			>

				{#snippet children(rows)}
				{@const blockRow = (
					rows?.find(
						(r) => r.row[EntityMetaKey.Source] === Source.Blockscout,
					)?.row
					?? rows?.[0]?.row
				)}
				{#if blockRow == null}
					<p data-text="muted">
						No block row in collections yet (resolve Blockscout / RPC for this chain).
					</p>
				{:else}
					<dl>
						{#if blockField?.timestamp != null}
							<div>
								<dt>Timestamp</dt>
								<dd>{String(blockField.timestamp)}</dd>
							</div>
						{/if}
						{#if blockField?.gasUsed != null}
							<div>
								<dt>Gas used</dt>
								<dd>{String(blockField.gasUsed)}</dd>
							</div>
						{/if}
						{#if blockField?.gasLimit != null}
							<div>
								<dt>Gas limit</dt>
								<dd>{String(blockField.gasLimit)}</dd>
							</div>
						{/if}
						{#if blockField?.baseFeePerGas != null}
							<div>
								<dt>Base fee</dt>
								<dd>{String(blockField.baseFeePerGas)}</dd>
							</div>
						{/if}
						{#if blockField?.transactionCount != null}
							<div>
								<dt>Transactions</dt>
								<dd>{String(blockField.transactionCount)}</dd>
							</div>
						{/if}
					</dl>
				{/if}
				{/snippet}
			</QueryBoundary>

			<dl data-column>
				<dt>
					Hash
				</dt>
				<dd>
					{#if typeof blockHash === 'string'}
						<TruncatedValue
							value={blockHash}
							format={TruncatedValueFormat.Abbr}
						/>
					{:else}
						–
					{/if}
				</dd>
			</dl>
		</EntityDetails>

		{#if chainId != null}
			<EvmTransactionsView
				entityId={{
					$network: { chainId },
					blockNumber: entityId.blockNumber,
				}}
				href={resolve(
					'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/transactions',
					{
						networkId: String(chainId),
						blockNumber: String(entityId.blockNumber),
					},
				)}
				id={`${blockIdKey}:transactions`}
				open={false}
			/>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
