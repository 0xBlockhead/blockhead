<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.UtxoNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.Blockchair_Rest,
			],
			bestBlockHeight: {},
			bestBlockHash: {},
			bestBlockTimeMs: {},
			blockCount: {},
			transactionCount: {},
			blocks24h: {},
			transactions24h: {},
			mempoolTransactionCount: {},
			mempoolSizeBytes: {},
			mempoolTps: {},
			averageTransactionFee24hSats: {},
			medianTransactionFee24hSats: {},
			suggestedTransactionFeePerByteSats: {},
			blockchainSizeBytes: {},
		},
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
	{#snippet Title()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading UTXO network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.bestBlockHeight !== undefined}
						<div>
							<dt>Best block</dt>
							<dd><NumberValue value={snapshot.bestBlockHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.mempoolTransactionCount !== undefined}
						<div>
							<dt>Mempool transactions</dt>
							<dd><NumberValue value={snapshot.mempoolTransactionCount} /></dd>
						</div>
					{/if}

					{#if snapshot.suggestedTransactionFeePerByteSats !== undefined}
						<div>
							<dt>Suggested fee</dt>
							<dd><NumberValue value={snapshot.suggestedTransactionFeePerByteSats} /> sat/vB</dd>
						</div>
					{/if}

					{#if snapshot.bestBlockTimeMs !== undefined}
						<div>
							<dt>Best block time</dt>
							<dd><Timestamp timestamp={snapshot.bestBlockTimeMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.bestBlockHash != null}
						<div>
							<dt>Best block hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.bestBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.blockCount !== undefined}
						<div>
							<dt>Blocks</dt>
							<dd><NumberValue value={snapshot.blockCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.transactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.transactionCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.blocks24h !== undefined}
						<div>
							<dt>Blocks 24h</dt>
							<dd><NumberValue value={snapshot.blocks24h} /></dd>
						</div>
					{/if}

					{#if open && snapshot.transactions24h !== undefined}
						<div>
							<dt>Transactions 24h</dt>
							<dd><NumberValue value={snapshot.transactions24h} /></dd>
						</div>
					{/if}

					{#if open && snapshot.mempoolSizeBytes !== undefined}
						<div>
							<dt>Mempool size</dt>
							<dd><NumberValue value={snapshot.mempoolSizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if open && snapshot.mempoolTps !== undefined}
						<div>
							<dt>Mempool TPS</dt>
							<dd><NumberValue value={snapshot.mempoolTps} /></dd>
						</div>
					{/if}

					{#if open && snapshot.averageTransactionFee24hSats !== undefined}
						<div>
							<dt>Average fee 24h</dt>
							<dd><NumberValue value={snapshot.averageTransactionFee24hSats} /> sats</dd>
						</div>
					{/if}

					{#if open && snapshot.medianTransactionFee24hSats !== undefined}
						<div>
							<dt>Median fee 24h</dt>
							<dd><NumberValue value={snapshot.medianTransactionFee24hSats} /> sats</dd>
						</div>
					{/if}

					{#if open && snapshot.blockchainSizeBytes !== undefined}
						<div>
							<dt>Chain size</dt>
							<dd><NumberValue value={snapshot.blockchainSizeBytes} /> bytes</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
