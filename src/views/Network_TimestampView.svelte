<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Network_Timestamp> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Network_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.source || String(selection.entitySelector.timestampMs)}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Ledger models</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerModels: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.ledgerModels.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution models</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									executionModels: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.executionModels.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ProjectionBoundary
			resource={selection.Cosmos}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.latestBlockHeight}
					>
						{#snippet children(latestBlockHeight)}
							{#if latestBlockHeight != null}
								<div>
									<dt>Latest block height</dt>
									<dd>
										<NumberValue
											value={latestBlockHeight}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.latestBlockHash}
					>
						{#snippet children(latestBlockHash)}
							{#if latestBlockHash != null}
								<div>
									<dt>Latest block hash</dt>
									<dd>
										<TruncatedValue value={latestBlockHash} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.latestBlockTimeMs}
					>
						{#snippet children(latestBlockTimeMs)}
							{#if latestBlockTimeMs != null}
								<div>
									<dt>Latest block time</dt>
									<dd>
										<Timestamp timestamp={latestBlockTimeMs} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.latestBlockTransactionCount}
					>
						{#snippet children(latestBlockTransactionCount)}
							{#if latestBlockTransactionCount != null}
								<div>
									<dt>Latest block transactions</dt>
									<dd>
										<NumberValue
											value={latestBlockTransactionCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.chainId}
					>
						{#snippet children(chainId)}
							{#if chainId != null}
								<div>
									<dt>Chain ID</dt>
									<dd>
										{chainId}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.nodeNetwork}
					>
						{#snippet children(nodeNetwork)}
							{#if nodeNetwork != null}
								<div>
									<dt>Node network</dt>
									<dd>
										{nodeNetwork}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.applicationName}
					>
						{#snippet children(applicationName)}
							{#if applicationName != null}
								<div>
									<dt>Application name</dt>
									<dd>
										{applicationName}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.applicationVersion}
					>
						{#snippet children(applicationVersion)}
							{#if applicationVersion != null}
								<div>
									<dt>Application version</dt>
									<dd>
										{applicationVersion}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.cosmosSdkVersion}
					>
						{#snippet children(cosmosSdkVersion)}
							{#if cosmosSdkVersion != null}
								<div>
									<dt>Cosmos SDK version</dt>
									<dd>
										{cosmosSdkVersion}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.isSyncing}
					>
						{#snippet children(isSyncing)}
							{#if isSyncing != null}
								<div>
									<dt>Syncing</dt>
									<dd>
										{isSyncing ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.bondedValidatorCount}
					>
						{#snippet children(bondedValidatorCount)}
							{#if bondedValidatorCount != null}
								<div>
									<dt>Bonded validators</dt>
									<dd>
										{bondedValidatorCount}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.bondedTokens}
					>
						{#snippet children(bondedTokens)}
							{#if bondedTokens != null}
								<div>
									<dt>Bonded tokens</dt>
									<dd>
										{bondedTokens}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.notBondedTokens}
					>
						{#snippet children(notBondedTokens)}
							{#if notBondedTokens != null}
								<div>
									<dt>Not bonded tokens</dt>
									<dd>
										{notBondedTokens}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Polkadot}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.finalizedBlockNumber}
					>
						{#snippet children(finalizedBlockNumber)}
							{#if finalizedBlockNumber != null}
								<div>
									<dt>Finalized block number</dt>
									<dd>
										<NumberValue
											value={finalizedBlockNumber}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.finalizedBlockHash}
					>
						{#snippet children(finalizedBlockHash)}
							{#if finalizedBlockHash != null}
								<div>
									<dt>Finalized block hash</dt>
									<dd>
										<TruncatedValue value={finalizedBlockHash} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.finalizedExtrinsicCount}
					>
						{#snippet children(finalizedExtrinsicCount)}
							{#if finalizedExtrinsicCount != null}
								<div>
									<dt>Finalized extrinsics</dt>
									<dd>
										<NumberValue
											value={finalizedExtrinsicCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.runtimeSpecName}
					>
						{#snippet children(runtimeSpecName)}
							{#if runtimeSpecName != null}
								<div>
									<dt>Runtime spec name</dt>
									<dd>
										{runtimeSpecName}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.runtimeSpecVersion}
					>
						{#snippet children(runtimeSpecVersion)}
							{#if runtimeSpecVersion != null}
								<div>
									<dt>Runtime spec version</dt>
									<dd>
										{runtimeSpecVersion}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactionVersion}
					>
						{#snippet children(transactionVersion)}
							{#if transactionVersion != null}
								<div>
									<dt>Transaction version</dt>
									<dd>
										{transactionVersion}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.stateVersion}
					>
						{#snippet children(stateVersion)}
							{#if stateVersion != null}
								<div>
									<dt>State version</dt>
									<dd>
										{stateVersion}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.peerCount}
					>
						{#snippet children(peerCount)}
							{#if peerCount != null}
								<div>
									<dt>Peers</dt>
									<dd>
										{peerCount}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.isSyncing}
					>
						{#snippet children(isSyncing)}
							{#if isSyncing != null}
								<div>
									<dt>Syncing</dt>
									<dd>
										{isSyncing ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.shouldHavePeers}
					>
						{#snippet children(shouldHavePeers)}
							{#if shouldHavePeers != null}
								<div>
									<dt>Should have peers</dt>
									<dd>
										{shouldHavePeers ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Solana}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.health}
					>
						{#snippet children(health)}
							{#if health != null}
								<div>
									<dt>Health</dt>
									<dd>
										{health}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.absoluteSlot}
					>
						{#snippet children(absoluteSlot)}
							{#if absoluteSlot != null}
								<div>
									<dt>Absolute slot</dt>
									<dd>
										<NumberValue
											value={absoluteSlot}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.blockHeight}
					>
						{#snippet children(blockHeight)}
							{#if blockHeight != null}
								<div>
									<dt>Block height</dt>
									<dd>
										<NumberValue
											value={blockHeight}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.epoch}
					>
						{#snippet children(epoch)}
							{#if epoch != null}
								<div>
									<dt>Epoch</dt>
									<dd>
										{epoch}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.slotIndex}
					>
						{#snippet children(slotIndex)}
							{#if slotIndex != null}
								<div>
									<dt>Slot index</dt>
									<dd>
										{slotIndex}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.slotsInEpoch}
					>
						{#snippet children(slotsInEpoch)}
							{#if slotsInEpoch != null}
								<div>
									<dt>Slots in epoch</dt>
									<dd>
										{slotsInEpoch}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactionCount}
					>
						{#snippet children(transactionCount)}
							{#if transactionCount != null}
								<div>
									<dt>Transaction count</dt>
									<dd>
										<NumberValue
											value={transactionCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.currentValidatorCount}
					>
						{#snippet children(currentValidatorCount)}
							{#if currentValidatorCount != null}
								<div>
									<dt>Current validator count</dt>
									<dd>
										{currentValidatorCount}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.delinquentValidatorCount}
					>
						{#snippet children(delinquentValidatorCount)}
							{#if delinquentValidatorCount != null}
								<div>
									<dt>Delinquent validator count</dt>
									<dd>
										{delinquentValidatorCount}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.totalActivatedStakeLamports}
					>
						{#snippet children(totalActivatedStakeLamports)}
							{#if totalActivatedStakeLamports != null}
								<div>
									<dt>Total activated stake</dt>
									<dd>
										{totalActivatedStakeLamports}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.solanaCoreVersion}
					>
						{#snippet children(solanaCoreVersion)}
							{#if solanaCoreVersion != null}
								<div>
									<dt>Solana core version</dt>
									<dd>
										{solanaCoreVersion}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.featureSet}
					>
						{#snippet children(featureSet)}
							{#if featureSet != null}
								<div>
									<dt>Feature set</dt>
									<dd>
										{featureSet}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Utxo}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.bestBlockHeight}
					>
						{#snippet children(bestBlockHeight)}
							{#if bestBlockHeight != null}
								<div>
									<dt>Best block height</dt>
									<dd>
										<NumberValue
											value={bestBlockHeight}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.bestBlockHash}
					>
						{#snippet children(bestBlockHash)}
							{#if bestBlockHash != null}
								<div>
									<dt>Best block hash</dt>
									<dd>
										<TruncatedValue value={bestBlockHash} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.bestBlockTimeMs}
					>
						{#snippet children(bestBlockTimeMs)}
							{#if bestBlockTimeMs != null}
								<div>
									<dt>Best block time</dt>
									<dd>
										<Timestamp timestamp={bestBlockTimeMs} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.blockCount}
					>
						{#snippet children(blockCount)}
							{#if blockCount != null}
								<div>
									<dt>Block count</dt>
									<dd>
										{blockCount}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactionCount}
					>
						{#snippet children(transactionCount)}
							{#if transactionCount != null}
								<div>
									<dt>Transaction count</dt>
									<dd>
										{transactionCount}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.blocks24h}
					>
						{#snippet children(blocks24h)}
							{#if blocks24h != null}
								<div>
									<dt>Blocks 24h</dt>
									<dd>
										{blocks24h}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactions24h}
					>
						{#snippet children(transactions24h)}
							{#if transactions24h != null}
								<div>
									<dt>Transactions 24h</dt>
									<dd>
										{transactions24h}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.mempoolTransactionCount}
					>
						{#snippet children(mempoolTransactionCount)}
							{#if mempoolTransactionCount != null}
								<div>
									<dt>Mempool transaction count</dt>
									<dd>
										{mempoolTransactionCount}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.mempoolSizeBytes}
					>
						{#snippet children(mempoolSizeBytes)}
							{#if mempoolSizeBytes != null}
								<div>
									<dt>Mempool size</dt>
									<dd>
										{mempoolSizeBytes}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.mempoolTps}
					>
						{#snippet children(mempoolTps)}
							{#if mempoolTps != null}
								<div>
									<dt>Mempool TPS</dt>
									<dd>
										{mempoolTps}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.averageTransactionFee24hSats}
					>
						{#snippet children(averageTransactionFee24hSats)}
							{#if averageTransactionFee24hSats != null}
								<div>
									<dt>Average transaction fee 24h</dt>
									<dd>
										{averageTransactionFee24hSats}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.medianTransactionFee24hSats}
					>
						{#snippet children(medianTransactionFee24hSats)}
							{#if medianTransactionFee24hSats != null}
								<div>
									<dt>Median transaction fee 24h</dt>
									<dd>
										{medianTransactionFee24hSats}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.suggestedTransactionFeePerByteSats}
					>
						{#snippet children(suggestedTransactionFeePerByteSats)}
							{#if suggestedTransactionFeePerByteSats != null}
								<div>
									<dt>Suggested fee per byte</dt>
									<dd>
										{suggestedTransactionFeePerByteSats}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.blockchainSizeBytes}
					>
						{#snippet children(blockchainSizeBytes)}
							{#if blockchainSizeBytes != null}
								<div>
									<dt>Blockchain size</dt>
									<dd>
										{blockchainSizeBytes}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
