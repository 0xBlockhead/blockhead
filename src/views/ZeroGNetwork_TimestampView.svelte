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
		entityId: EntityId<typeof schema, EntityType.ZeroGNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = useEntity(entityCollectionsContext, EntityType.ZeroGNetwork_Timestamp,
		entityId,
		({ sources: [
				Source.ZeroGChain_JsonRpc,
				Source.ZeroGStorageScan_Rest,
			], fields: { headBlockNumber: true, headBlockHash: true, headTimestampMs: true, transactionCount: true, gasUsed: true, gasLimit: true, baseFeePerGas: true, storageLogSyncHeight: true, storageLayer1LogSyncHeight: true, storageTransactionCount: true, latestDataRoot: true, latestDataSizeBytes: true, latestStorageTxHash: true, storageMinerCount: true, latestStorageMiner: true, storageFeeTotal: true, storageRewardTotal: true, storageTotalWinCount: true, expiredFileCount: true, prunedFileCount: true } }),
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
				{#if snapshot.fields.headBlockNumber !== undefined}
					<NumberValue value={snapshot.fields.headBlockNumber} />
				{:else if snapshot.fields.storageTransactionCount !== undefined}
					<NumberValue value={snapshot.fields.storageTransactionCount} />
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
					{#if snapshot.fields.headBlockNumber !== undefined}
						<div>
							<dt>Head block</dt>
							<dd>#<NumberValue value={snapshot.fields.headBlockNumber} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.transactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.fields.transactionCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.storageTransactionCount !== undefined}
						<div>
							<dt>Storage logs</dt>
							<dd><NumberValue value={snapshot.fields.storageTransactionCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.storageMinerCount !== undefined}
						<div>
							<dt>Storage miners</dt>
							<dd><NumberValue value={snapshot.fields.storageMinerCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.headBlockHash != null}
						<div>
							<dt>Head hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.headBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.gasUsed !== undefined}
						<div>
							<dt>Gas used</dt>
							<dd><NumberValue value={snapshot.fields.gasUsed} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.gasLimit !== undefined}
						<div>
							<dt>Gas limit</dt>
							<dd><NumberValue value={snapshot.fields.gasLimit} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.baseFeePerGas !== undefined}
						<div>
							<dt>Base fee</dt>
							<dd><NumberValue value={snapshot.fields.baseFeePerGas} /> wei</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.storageLogSyncHeight !== undefined}
						<div>
							<dt>Storage sync</dt>
							<dd><NumberValue value={snapshot.fields.storageLogSyncHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.storageLayer1LogSyncHeight !== undefined}
						<div>
							<dt>L1 log sync</dt>
							<dd><NumberValue value={snapshot.fields.storageLayer1LogSyncHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.storageFeeTotal != null}
						<div>
							<dt>Storage fees</dt>
							<dd>{snapshot.fields.storageFeeTotal}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestDataRoot != null}
						<div>
							<dt>Latest data root</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.latestDataRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestDataSizeBytes !== undefined}
						<div>
							<dt>Latest data size</dt>
							<dd><NumberValue value={snapshot.fields.latestDataSizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestStorageTxHash != null}
						<div>
							<dt>Latest storage tx</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.latestStorageTxHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestStorageMiner != null}
						<div>
							<dt>Latest miner</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.latestStorageMiner}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.storageRewardTotal != null}
						<div>
							<dt>Storage rewards</dt>
							<dd>{snapshot.fields.storageRewardTotal}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.storageTotalWinCount !== undefined}
						<div>
							<dt>Storage wins</dt>
							<dd><NumberValue value={snapshot.fields.storageTotalWinCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.expiredFileCount !== undefined}
						<div>
							<dt>Expired files</dt>
							<dd><NumberValue value={snapshot.fields.expiredFileCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.prunedFileCount !== undefined}
						<div>
							<dt>Pruned files</dt>
							<dd><NumberValue value={snapshot.fields.prunedFileCount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
