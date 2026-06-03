<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.ZeroGNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = useEntity(
		EntityType.ZeroGNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.ZeroGChain_JsonRpc,
				Source.ZeroGStorageScan_Rest,
			],
			headBlockNumber: {},
			headBlockHash: {},
			headTimestampMs: {},
			transactionCount: {},
			gasUsed: {},
			gasLimit: {},
			baseFeePerGas: {},
			storageLogSyncHeight: {},
			storageLayer1LogSyncHeight: {},
			storageTransactionCount: {},
			latestDataRoot: {},
			latestDataSizeBytes: {},
			latestStorageTxHash: {},
			storageMinerCount: {},
			latestStorageMiner: {},
			storageFeeTotal: {},
			storageRewardTotal: {},
			storageTotalWinCount: {},
			expiredFileCount: {},
			prunedFileCount: {},
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
	entityType={EntityType.ZeroGNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading 0G network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.headBlockNumber !== undefined}
					<NumberValue value={snapshot.headBlockNumber} />
				{:else if snapshot.storageTransactionCount !== undefined}
					<NumberValue value={snapshot.storageTransactionCount} />
					storage logs
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading 0G network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.headBlockNumber !== undefined}
						<div>
							<dt>Head block</dt>
							<dd>#<NumberValue value={snapshot.headBlockNumber} /></dd>
						</div>
					{/if}

					{#if snapshot.transactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.transactionCount} /></dd>
						</div>
					{/if}

					{#if snapshot.storageTransactionCount !== undefined}
						<div>
							<dt>Storage logs</dt>
							<dd><NumberValue value={snapshot.storageTransactionCount} /></dd>
						</div>
					{/if}

					{#if snapshot.storageMinerCount !== undefined}
						<div>
							<dt>Storage miners</dt>
							<dd><NumberValue value={snapshot.storageMinerCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.headBlockHash != null}
						<div>
							<dt>Head hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.headBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.gasUsed !== undefined}
						<div>
							<dt>Gas used</dt>
							<dd><NumberValue value={snapshot.gasUsed} /></dd>
						</div>
					{/if}

					{#if open && snapshot.gasLimit !== undefined}
						<div>
							<dt>Gas limit</dt>
							<dd><NumberValue value={snapshot.gasLimit} /></dd>
						</div>
					{/if}

					{#if open && snapshot.baseFeePerGas !== undefined}
						<div>
							<dt>Base fee</dt>
							<dd><NumberValue value={snapshot.baseFeePerGas} /> wei</dd>
						</div>
					{/if}

					{#if open && snapshot.storageLogSyncHeight !== undefined}
						<div>
							<dt>Storage sync</dt>
							<dd><NumberValue value={snapshot.storageLogSyncHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.storageLayer1LogSyncHeight !== undefined}
						<div>
							<dt>L1 log sync</dt>
							<dd><NumberValue value={snapshot.storageLayer1LogSyncHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.storageFeeTotal != null}
						<div>
							<dt>Storage fees</dt>
							<dd>{snapshot.storageFeeTotal}</dd>
						</div>
					{/if}

					{#if open && snapshot.latestDataRoot != null}
						<div>
							<dt>Latest data root</dt>
							<dd>
								<TruncatedValue
									value={snapshot.latestDataRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.latestDataSizeBytes !== undefined}
						<div>
							<dt>Latest data size</dt>
							<dd><NumberValue value={snapshot.latestDataSizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if open && snapshot.latestStorageTxHash != null}
						<div>
							<dt>Latest storage tx</dt>
							<dd>
								<TruncatedValue
									value={snapshot.latestStorageTxHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.latestStorageMiner != null}
						<div>
							<dt>Latest miner</dt>
							<dd>
								<TruncatedValue
									value={snapshot.latestStorageMiner}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.storageRewardTotal != null}
						<div>
							<dt>Storage rewards</dt>
							<dd>{snapshot.storageRewardTotal}</dd>
						</div>
					{/if}

					{#if open && snapshot.storageTotalWinCount !== undefined}
						<div>
							<dt>Storage wins</dt>
							<dd><NumberValue value={snapshot.storageTotalWinCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.expiredFileCount !== undefined}
						<div>
							<dt>Expired files</dt>
							<dd><NumberValue value={snapshot.expiredFileCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.prunedFileCount !== undefined}
						<div>
							<dt>Pruned files</dt>
							<dd><NumberValue value={snapshot.prunedFileCount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
