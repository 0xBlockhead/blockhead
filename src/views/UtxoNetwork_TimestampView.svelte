<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.UtxoNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = useEntity(entityCollectionsContext, EntityType.UtxoNetwork_Timestamp,
		entityId,
		({ sources: [
				Source.Blockchair_Rest,
			], fields: { bestBlockHeight: true, bestBlockHash: true, bestBlockTimeMs: true, blockCount: true, transactionCount: true, blocks24h: true, transactions24h: true, mempoolTransactionCount: true, mempoolSizeBytes: true, mempoolTps: true, averageTransactionFee24hSats: true, medianTransactionFee24hSats: true, suggestedTransactionFeePerByteSats: true, blockchainSizeBytes: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading UTXO network snapshot…"
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.bestBlockHeight !== undefined}
					<NumberValue value={snapshot.fields.bestBlockHeight} />
				{:else if snapshot.fields.mempoolTransactionCount !== undefined}
					<NumberValue value={snapshot.fields.mempoolTransactionCount} />
					in mempool
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading UTXO network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.bestBlockHeight !== undefined}
						<div>
							<dt>Best block</dt>
							<dd><NumberValue value={snapshot.fields.bestBlockHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.mempoolTransactionCount !== undefined}
						<div>
							<dt>Mempool transactions</dt>
							<dd><NumberValue value={snapshot.fields.mempoolTransactionCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.suggestedTransactionFeePerByteSats !== undefined}
						<div>
							<dt>Suggested fee</dt>
							<dd><NumberValue value={snapshot.fields.suggestedTransactionFeePerByteSats} /> sat/vB</dd>
						</div>
					{/if}

					{#if snapshot.fields.bestBlockTimeMs !== undefined}
						<div>
							<dt>Best block time</dt>
							<dd><Timestamp timestamp={snapshot.fields.bestBlockTimeMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.bestBlockHash != null}
						<div>
							<dt>Best block hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.bestBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.blockCount !== undefined}
						<div>
							<dt>Blocks</dt>
							<dd><NumberValue value={snapshot.fields.blockCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.transactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.fields.transactionCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.blocks24h !== undefined}
						<div>
							<dt>Blocks 24h</dt>
							<dd><NumberValue value={snapshot.fields.blocks24h} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.transactions24h !== undefined}
						<div>
							<dt>Transactions 24h</dt>
							<dd><NumberValue value={snapshot.fields.transactions24h} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.mempoolSizeBytes !== undefined}
						<div>
							<dt>Mempool size</dt>
							<dd><NumberValue value={snapshot.fields.mempoolSizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.mempoolTps !== undefined}
						<div>
							<dt>Mempool TPS</dt>
							<dd><NumberValue value={snapshot.fields.mempoolTps} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.averageTransactionFee24hSats !== undefined}
						<div>
							<dt>Average fee 24h</dt>
							<dd><NumberValue value={snapshot.fields.averageTransactionFee24hSats} /> sats</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.medianTransactionFee24hSats !== undefined}
						<div>
							<dt>Median fee 24h</dt>
							<dd><NumberValue value={snapshot.fields.medianTransactionFee24hSats} /> sats</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.blockchainSizeBytes !== undefined}
						<div>
							<dt>Chain size</dt>
							<dd><NumberValue value={snapshot.fields.blockchainSizeBytes} /> bytes</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
