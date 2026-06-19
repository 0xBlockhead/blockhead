<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.UtxoNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const snapshot = $derived(selection({
			sources: [
				Source.Blockchair_Rest,
			],
		},
	))
	const bestBlockHeight = $derived(snapshot.bestBlockHeight)
	const bestBlockHash = $derived(snapshot.bestBlockHash)
	const bestBlockTimeMs = $derived(snapshot.bestBlockTimeMs)
	const blockCount = $derived(snapshot.blockCount)
	const transactionCount = $derived(snapshot.transactionCount)
	const blocks24h = $derived(snapshot.blocks24h)
	const transactions24h = $derived(snapshot.transactions24h)
	const mempoolTransactionCount = $derived(snapshot.mempoolTransactionCount)
	const mempoolSizeBytes = $derived(snapshot.mempoolSizeBytes)
	const mempoolTps = $derived(snapshot.mempoolTps)
	const averageTransactionFee24hSats = $derived(snapshot.averageTransactionFee24hSats)
	const medianTransactionFee24hSats = $derived(snapshot.medianTransactionFee24hSats)
	const suggestedTransactionFeePerByteSats = $derived(snapshot.suggestedTransactionFeePerByteSats)
	const blockchainSizeBytes = $derived(snapshot.blockchainSizeBytes)



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={bestBlockHeight}
			placeholderText="Loading UTXO network snapshot…"
		>
			{#snippet children(bestBlockHeight)}
				{#if bestBlockHeight !== undefined}
					<NumberValue value={bestBlockHeight} />
				{:else}
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={bestBlockHeight}
			placeholderText="Loading UTXO network snapshot…"
		>
			{#snippet children(bestBlockHeight)}
				<dl data-column-item="center">
					{#if bestBlockHeight !== undefined}
						<div>
							<dt>Best block</dt>
							<dd><NumberValue value={bestBlockHeight} /></dd>
						</div>
					{/if}

					{#if mempoolTransactionCount !== undefined}
						<div>
							<dt>Mempool transactions</dt>
							<dd><NumberValue resource={mempoolTransactionCount} /></dd>
						</div>
					{/if}

					{#if suggestedTransactionFeePerByteSats !== undefined}
						<div>
							<dt>Suggested fee</dt>
							<dd><NumberValue resource={suggestedTransactionFeePerByteSats} /> sat/vB</dd>
						</div>
					{/if}

					{#if bestBlockTimeMs !== undefined}
						<div>
							<dt>Best block time</dt>
							<dd>
								<ResourceBoundary
									resource={bestBlockTimeMs}
									placeholderText="Loading block time…"
								>
									{#snippet children(bestBlockTimeMs)}
										{#if bestBlockTimeMs !== undefined}
											<Timestamp timestamp={bestBlockTimeMs} />
										{/if}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/if}

					{#if open && bestBlockHash != null}
						<div>
							<dt>Best block hash</dt>
							<dd>
								<ResourceBoundary
									resource={bestBlockHash}
									placeholderText="Loading block hash…"
								>
									{#snippet children(bestBlockHash)}
										{#if bestBlockHash !== undefined}
											<TruncatedValue
												value={bestBlockHash}
												format={TruncatedValueFormat.Abbr}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/if}

					{#if open && blockCount !== undefined}
						<div>
							<dt>Blocks</dt>
							<dd><NumberValue resource={blockCount} /></dd>
						</div>
					{/if}

					{#if open && transactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue resource={transactionCount} /></dd>
						</div>
					{/if}

					{#if open && blocks24h !== undefined}
						<div>
							<dt>Blocks 24h</dt>
							<dd><NumberValue resource={blocks24h} /></dd>
						</div>
					{/if}

					{#if open && transactions24h !== undefined}
						<div>
							<dt>Transactions 24h</dt>
							<dd><NumberValue resource={transactions24h} /></dd>
						</div>
					{/if}

					{#if open && mempoolSizeBytes !== undefined}
						<div>
							<dt>Mempool size</dt>
							<dd><NumberValue resource={mempoolSizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if open && mempoolTps !== undefined}
						<div>
							<dt>Mempool TPS</dt>
							<dd><NumberValue resource={mempoolTps} /></dd>
						</div>
					{/if}

					{#if open && averageTransactionFee24hSats !== undefined}
						<div>
							<dt>Average fee 24h</dt>
							<dd><NumberValue resource={averageTransactionFee24hSats} /> sats</dd>
						</div>
					{/if}

					{#if open && medianTransactionFee24hSats !== undefined}
						<div>
							<dt>Median fee 24h</dt>
							<dd><NumberValue resource={medianTransactionFee24hSats} /> sats</dd>
						</div>
					{/if}

					{#if open && blockchainSizeBytes !== undefined}
						<div>
							<dt>Chain size</dt>
							<dd><NumberValue resource={blockchainSizeBytes} /> bytes</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
