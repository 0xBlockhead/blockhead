<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { NetworkExecutionModel, NetworkLedgerModel } from '$/constants/Network.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.Network_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Network_Timestamp>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const networkTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Network timestamp')
	const viewDomId = $derived('network-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Network_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: String(selection.entitySelector.timestampMs ?? ''),
				source: String(selection.entitySelector.source ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(selection.entitySelector.timestampMs ?? ''),
					source: String(selection.entitySelector.source ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={networkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={networkTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A point-in-time observation of network status or metrics.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Ledger models</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerModels: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerModels = resolvedEntity.ledgerModels}
							{#if ledgerModels !== undefined && ledgerModels !== null}
								{ledgerModels.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
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
								sources: selection.sources,
								fields: {
									executionModels: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const executionModels = resolvedEntity.executionModels}
							{#if executionModels !== undefined && executionModels !== null}
								{executionModels.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Cosmos}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.latestBlockHeight}
					>
						{#snippet children(latestBlockHeight)}
							{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
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
							{#if latestBlockHash !== undefined && latestBlockHash !== null}
								<div>
									<dt>Latest block hash</dt>
									<dd>
										<TruncatedValue value={String((latestBlockHash) ?? '')} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.latestBlockTimeMs}
					>
						{#snippet children(latestBlockTimeMs)}
							{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
								<div>
									<dt>Latest block time</dt>
									<dd>
										<Timestamp timestamp={Number(latestBlockTimeMs)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.latestBlockTransactionCount}
					>
						{#snippet children(latestBlockTransactionCount)}
							{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
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
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Cosmos}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.chainId}
					>
						{#snippet children(chainId)}
							{#if chainId !== undefined && chainId !== null}
								<div>
									<dt>Chain ID</dt>
									<dd>
										{String((chainId) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.nodeNetwork}
					>
						{#snippet children(nodeNetwork)}
							{#if nodeNetwork !== undefined && nodeNetwork !== null}
								<div>
									<dt>Node network</dt>
									<dd>
										{String((nodeNetwork) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.applicationName}
					>
						{#snippet children(applicationName)}
							{#if applicationName !== undefined && applicationName !== null}
								<div>
									<dt>Application name</dt>
									<dd>
										{String((applicationName) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.applicationVersion}
					>
						{#snippet children(applicationVersion)}
							{#if applicationVersion !== undefined && applicationVersion !== null}
								<div>
									<dt>Application version</dt>
									<dd>
										{String((applicationVersion) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.cosmosSdkVersion}
					>
						{#snippet children(cosmosSdkVersion)}
							{#if cosmosSdkVersion !== undefined && cosmosSdkVersion !== null}
								<div>
									<dt>Cosmos SDK version</dt>
									<dd>
										{String((cosmosSdkVersion) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.isSyncing}
					>
						{#snippet children(isSyncing)}
							{#if isSyncing !== undefined && isSyncing !== null}
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
							{#if bondedValidatorCount !== undefined && bondedValidatorCount !== null}
								<div>
									<dt>Bonded validators</dt>
									<dd>
										{String((bondedValidatorCount) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.bondedTokens}
					>
						{#snippet children(bondedTokens)}
							{#if bondedTokens !== undefined && bondedTokens !== null}
								<div>
									<dt>Bonded tokens</dt>
									<dd>
										{String((bondedTokens) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.notBondedTokens}
					>
						{#snippet children(notBondedTokens)}
							{#if notBondedTokens !== undefined && notBondedTokens !== null}
								<div>
									<dt>Not bonded tokens</dt>
									<dd>
										{String((notBondedTokens) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Polkadot}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.finalizedBlockNumber}
					>
						{#snippet children(finalizedBlockNumber)}
							{#if finalizedBlockNumber !== undefined && finalizedBlockNumber !== null}
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
							{#if finalizedBlockHash !== undefined && finalizedBlockHash !== null}
								<div>
									<dt>Finalized block hash</dt>
									<dd>
										<TruncatedValue value={String((finalizedBlockHash) ?? '')} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.finalizedExtrinsicCount}
					>
						{#snippet children(finalizedExtrinsicCount)}
							{#if finalizedExtrinsicCount !== undefined && finalizedExtrinsicCount !== null}
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
							{#if runtimeSpecName !== undefined && runtimeSpecName !== null}
								<div>
									<dt>Runtime spec name</dt>
									<dd>
										{String((runtimeSpecName) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.runtimeSpecVersion}
					>
						{#snippet children(runtimeSpecVersion)}
							{#if runtimeSpecVersion !== undefined && runtimeSpecVersion !== null}
								<div>
									<dt>Runtime spec version</dt>
									<dd>
										{String((runtimeSpecVersion) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactionVersion}
					>
						{#snippet children(transactionVersion)}
							{#if transactionVersion !== undefined && transactionVersion !== null}
								<div>
									<dt>Transaction version</dt>
									<dd>
										{String((transactionVersion) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.stateVersion}
					>
						{#snippet children(stateVersion)}
							{#if stateVersion !== undefined && stateVersion !== null}
								<div>
									<dt>State version</dt>
									<dd>
										{String((stateVersion) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.peerCount}
					>
						{#snippet children(peerCount)}
							{#if peerCount !== undefined && peerCount !== null}
								<div>
									<dt>Peers</dt>
									<dd>
										{String((peerCount) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.isSyncing}
					>
						{#snippet children(isSyncing)}
							{#if isSyncing !== undefined && isSyncing !== null}
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
							{#if shouldHavePeers !== undefined && shouldHavePeers !== null}
								<div>
									<dt>Should have peers</dt>
									<dd>
										{shouldHavePeers ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Solana}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.health}
					>
						{#snippet children(health)}
							{#if health !== undefined && health !== null}
								<div>
									<dt>Health</dt>
									<dd>
										{String((health) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.absoluteSlot}
					>
						{#snippet children(absoluteSlot)}
							{#if absoluteSlot !== undefined && absoluteSlot !== null}
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
							{#if blockHeight !== undefined && blockHeight !== null}
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
							{#if epoch !== undefined && epoch !== null}
								<div>
									<dt>Epoch</dt>
									<dd>
										{String((epoch) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.slotIndex}
					>
						{#snippet children(slotIndex)}
							{#if slotIndex !== undefined && slotIndex !== null}
								<div>
									<dt>Slot index</dt>
									<dd>
										{String((slotIndex) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.slotsInEpoch}
					>
						{#snippet children(slotsInEpoch)}
							{#if slotsInEpoch !== undefined && slotsInEpoch !== null}
								<div>
									<dt>Slots in epoch</dt>
									<dd>
										{String((slotsInEpoch) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactionCount}
					>
						{#snippet children(transactionCount)}
							{#if transactionCount !== undefined && transactionCount !== null}
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
							{#if currentValidatorCount !== undefined && currentValidatorCount !== null}
								<div>
									<dt>Current validator count</dt>
									<dd>
										{String((currentValidatorCount) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.delinquentValidatorCount}
					>
						{#snippet children(delinquentValidatorCount)}
							{#if delinquentValidatorCount !== undefined && delinquentValidatorCount !== null}
								<div>
									<dt>Delinquent validator count</dt>
									<dd>
										{String((delinquentValidatorCount) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.totalActivatedStakeLamports}
					>
						{#snippet children(totalActivatedStakeLamports)}
							{#if totalActivatedStakeLamports !== undefined && totalActivatedStakeLamports !== null}
								<div>
									<dt>Total activated stake</dt>
									<dd>
										{String((totalActivatedStakeLamports) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.solanaCoreVersion}
					>
						{#snippet children(solanaCoreVersion)}
							{#if solanaCoreVersion !== undefined && solanaCoreVersion !== null}
								<div>
									<dt>Solana core version</dt>
									<dd>
										{String((solanaCoreVersion) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.featureSet}
					>
						{#snippet children(featureSet)}
							{#if featureSet !== undefined && featureSet !== null}
								<div>
									<dt>Feature set</dt>
									<dd>
										{String((featureSet) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Utxo}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.bestBlockHeight}
					>
						{#snippet children(bestBlockHeight)}
							{#if bestBlockHeight !== undefined && bestBlockHeight !== null}
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
							{#if bestBlockHash !== undefined && bestBlockHash !== null}
								<div>
									<dt>Best block hash</dt>
									<dd>
										<TruncatedValue value={String((bestBlockHash) ?? '')} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.bestBlockTimeMs}
					>
						{#snippet children(bestBlockTimeMs)}
							{#if bestBlockTimeMs !== undefined && bestBlockTimeMs !== null}
								<div>
									<dt>Best block time</dt>
									<dd>
										<Timestamp timestamp={Number(bestBlockTimeMs)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.blockCount}
					>
						{#snippet children(blockCount)}
							{#if blockCount !== undefined && blockCount !== null}
								<div>
									<dt>Block count</dt>
									<dd>
										{String((blockCount) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactionCount}
					>
						{#snippet children(transactionCount)}
							{#if transactionCount !== undefined && transactionCount !== null}
								<div>
									<dt>Transaction count</dt>
									<dd>
										{String((transactionCount) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.blocks24h}
					>
						{#snippet children(blocks24h)}
							{#if blocks24h !== undefined && blocks24h !== null}
								<div>
									<dt>Blocks 24h</dt>
									<dd>
										{String((blocks24h) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.transactions24h}
					>
						{#snippet children(transactions24h)}
							{#if transactions24h !== undefined && transactions24h !== null}
								<div>
									<dt>Transactions 24h</dt>
									<dd>
										{String((transactions24h) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.mempoolTransactionCount}
					>
						{#snippet children(mempoolTransactionCount)}
							{#if mempoolTransactionCount !== undefined && mempoolTransactionCount !== null}
								<div>
									<dt>Mempool transaction count</dt>
									<dd>
										{String((mempoolTransactionCount) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.mempoolSizeBytes}
					>
						{#snippet children(mempoolSizeBytes)}
							{#if mempoolSizeBytes !== undefined && mempoolSizeBytes !== null}
								<div>
									<dt>Mempool size</dt>
									<dd>
										{String((mempoolSizeBytes) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.mempoolTps}
					>
						{#snippet children(mempoolTps)}
							{#if mempoolTps !== undefined && mempoolTps !== null}
								<div>
									<dt>Mempool TPS</dt>
									<dd>
										{String((mempoolTps) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.averageTransactionFee24hSats}
					>
						{#snippet children(averageTransactionFee24hSats)}
							{#if averageTransactionFee24hSats !== undefined && averageTransactionFee24hSats !== null}
								<div>
									<dt>Average transaction fee 24h</dt>
									<dd>
										{String((averageTransactionFee24hSats) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.medianTransactionFee24hSats}
					>
						{#snippet children(medianTransactionFee24hSats)}
							{#if medianTransactionFee24hSats !== undefined && medianTransactionFee24hSats !== null}
								<div>
									<dt>Median transaction fee 24h</dt>
									<dd>
										{String((medianTransactionFee24hSats) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.suggestedTransactionFeePerByteSats}
					>
						{#snippet children(suggestedTransactionFeePerByteSats)}
							{#if suggestedTransactionFeePerByteSats !== undefined && suggestedTransactionFeePerByteSats !== null}
								<div>
									<dt>Suggested fee per byte</dt>
									<dd>
										{String((suggestedTransactionFeePerByteSats) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.blockchainSizeBytes}
					>
						{#snippet children(blockchainSizeBytes)}
							{#if blockchainSizeBytes !== undefined && blockchainSizeBytes !== null}
								<div>
									<dt>Blockchain size</dt>
									<dd>
										{String((blockchainSizeBytes) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}
</EntityView>
