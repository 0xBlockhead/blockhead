<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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
		>
	> = $props()

	const blockIdKey = $derived(
		stringify(entityId),
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
				(r) => r.row[EntityMetaKey.Source] === Source.Blockscout_Rest,
			)?.row
			?? blockQuery.data?.[0]?.row
		)
	)

	const blockField = $derived(
		(() => {
			const bag = blockRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				extraData: typeof b.extraData === 'string' && b.extraData.length ? b.extraData : undefined,
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

	const hasSummaryDetails = $derived(
		blockField?.transactionCount !== undefined
		|| blockField?.extraData !== undefined
		|| (blockField?.timestamp !== undefined && Number.isFinite(blockField.timestamp)),
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	{entityId}
	title={blockTitle}
	{href}
	idDragPlainText={String(entityId.blockNumber)}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-row="inline align-center gap-2 wrap">
			<span
				data-badge="small"
				data-text="font-monospace"
				data-block-number={String(entityId.blockNumber)}
			>
				{String(entityId.blockNumber)}
			</span>
			{#if typeof blockHash === 'string'}
				<small>
					<TruncatedValue
						value={blockHash}
						format={TruncatedValueFormat.Abbr}
					/>
				</small>
			{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		{#if hasSummaryDetails}
			<dl data-definition-list="vertical">
				{#if blockField?.transactionCount !== undefined}
					<div>
						<dt>Transactions</dt>
						<dd>
							<NumberValue value={blockField.transactionCount} />
						</dd>
					</div>
				{/if}
				{#if blockField?.extraData !== undefined}
					<div>
						<dt>Extra Data (graffiti)</dt>
						<dd>{blockField.extraData}</dd>
					</div>
				{/if}
				{#if blockField?.timestamp !== undefined && Number.isFinite(blockField.timestamp)}
					<div>
						<dt>Timestamp</dt>
						<dd>
							<Timestamp
								timestamp={blockField.timestamp}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				{/if}
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
						(r) => r.row[EntityMetaKey.Source] === Source.Blockscout_Rest,
					)?.row
					?? rows?.[0]?.row
				)}
				{#if blockRow === undefined}
					<p data-text="muted">
						No block data for this chain yet. Try again shortly.
					</p>
				{:else}
					<dl>
						<div>
							<dt>Hash</dt>
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
						</div>
						{#if blockField?.timestamp !== undefined && Number.isFinite(blockField.timestamp)}
							<div>
								<dt>Timestamp</dt>
								<dd>
									<Timestamp
										timestamp={blockField.timestamp}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
						{#if blockField?.gasUsed !== undefined}
							<div>
								<dt>Gas used</dt>
								<dd>
									<NumberValue value={blockField.gasUsed} />
								</dd>
							</div>
						{/if}
						{#if blockField?.gasLimit !== undefined}
							<div>
								<dt>Gas limit</dt>
								<dd>
									<NumberValue value={blockField.gasLimit} />
								</dd>
							</div>
						{/if}
						{#if blockField?.baseFeePerGas !== undefined}
							<div>
								<dt>Base fee</dt>
								<dd>
									<NumberValue value={blockField.baseFeePerGas} />
								</dd>
							</div>
						{/if}
						{#if blockField?.transactionCount !== undefined}
							<div>
								<dt>Transactions</dt>
								<dd>
									<NumberValue value={blockField.transactionCount} />
								</dd>
							</div>
						{/if}
					</dl>
				{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<EvmTransactionsView
			entityFieldReference={{
				entityType: EntityType.EvmBlock,
				entityId,
				fieldName: '$$evmTransactions',
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/transactions',
				{
					networkId: String(entityId.$network.chainId),
					blockNumber: String(entityId.blockNumber),
				},
			)}
			id="transactions"
			open={false}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
