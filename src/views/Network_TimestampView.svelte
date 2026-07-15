<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Network_Timestamp>>
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
	const networkTimestamp = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Network timestamp')
	const viewDomId = $derived('network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={networkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={networkTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'Network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									ledgerModels: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerModels = pendingEntity.ledgerModels}
							{#if ledgerModels !== undefined && ledgerModels !== null}
								{ledgerModels.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

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
								fields: {
									executionModels: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const executionModels = pendingEntity.executionModels}
							{#if executionModels !== undefined && executionModels !== null}
								{executionModels.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

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
						resource={
							projection.latestBlockHeight({
								fields: {
									latestBlockHeight: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(latestBlockHeight)}
							{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
								<div>
									<dt>Latest block height</dt>
									<dd>
										<NumberValue value={Number(latestBlockHeight)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.latestBlockHash({
								fields: {
									latestBlockHash: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.latestBlockTimeMs({
								fields: {
									latestBlockTimeMs: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.latestBlockTransactionCount({
								fields: {
									latestBlockTransactionCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(latestBlockTransactionCount)}
							{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
								<div>
									<dt>Latest block transactions</dt>
									<dd>
										<NumberValue value={Number(latestBlockTransactionCount)} />
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
						resource={
							projection.chainId({
								fields: {
									chainId: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.nodeNetwork({
								fields: {
									nodeNetwork: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.applicationName({
								fields: {
									applicationName: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.applicationVersion({
								fields: {
									applicationVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.cosmosSdkVersion({
								fields: {
									cosmosSdkVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.isSyncing({
								fields: {
									isSyncing: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.bondedValidatorCount({
								fields: {
									bondedValidatorCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.bondedTokens({
								fields: {
									bondedTokens: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.notBondedTokens({
								fields: {
									notBondedTokens: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.finalizedBlockNumber({
								fields: {
									finalizedBlockNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(finalizedBlockNumber)}
							{#if finalizedBlockNumber !== undefined && finalizedBlockNumber !== null}
								<div>
									<dt>Finalized block number</dt>
									<dd>
										<NumberValue value={Number(finalizedBlockNumber)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.finalizedBlockHash({
								fields: {
									finalizedBlockHash: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.finalizedExtrinsicCount({
								fields: {
									finalizedExtrinsicCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(finalizedExtrinsicCount)}
							{#if finalizedExtrinsicCount !== undefined && finalizedExtrinsicCount !== null}
								<div>
									<dt>Finalized extrinsics</dt>
									<dd>
										<NumberValue value={Number(finalizedExtrinsicCount)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.runtimeSpecName({
								fields: {
									runtimeSpecName: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.runtimeSpecVersion({
								fields: {
									runtimeSpecVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.transactionVersion({
								fields: {
									transactionVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.stateVersion({
								fields: {
									stateVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.peerCount({
								fields: {
									peerCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.isSyncing({
								fields: {
									isSyncing: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.shouldHavePeers({
								fields: {
									shouldHavePeers: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.health({
								fields: {
									health: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.absoluteSlot({
								fields: {
									absoluteSlot: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(absoluteSlot)}
							{#if absoluteSlot !== undefined && absoluteSlot !== null}
								<div>
									<dt>Absolute slot</dt>
									<dd>
										<NumberValue value={Number(absoluteSlot)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.blockHeight({
								fields: {
									blockHeight: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(blockHeight)}
							{#if blockHeight !== undefined && blockHeight !== null}
								<div>
									<dt>Block height</dt>
									<dd>
										<NumberValue value={Number(blockHeight)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.epoch({
								fields: {
									epoch: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.slotIndex({
								fields: {
									slotIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.slotsInEpoch({
								fields: {
									slotsInEpoch: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.transactionCount({
								fields: {
									transactionCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(transactionCount)}
							{#if transactionCount !== undefined && transactionCount !== null}
								<div>
									<dt>Transaction count</dt>
									<dd>
										<NumberValue value={Number(transactionCount)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.currentValidatorCount({
								fields: {
									currentValidatorCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.delinquentValidatorCount({
								fields: {
									delinquentValidatorCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.totalActivatedStakeLamports({
								fields: {
									totalActivatedStakeLamports: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.solanaCoreVersion({
								fields: {
									solanaCoreVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.featureSet({
								fields: {
									featureSet: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.bestBlockHeight({
								fields: {
									bestBlockHeight: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(bestBlockHeight)}
							{#if bestBlockHeight !== undefined && bestBlockHeight !== null}
								<div>
									<dt>Best block height</dt>
									<dd>
										<NumberValue value={Number(bestBlockHeight)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.bestBlockHash({
								fields: {
									bestBlockHash: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.bestBlockTimeMs({
								fields: {
									bestBlockTimeMs: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.blockCount({
								fields: {
									blockCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.transactionCount({
								fields: {
									transactionCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.blocks24h({
								fields: {
									blocks24h: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.transactions24h({
								fields: {
									transactions24h: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.mempoolTransactionCount({
								fields: {
									mempoolTransactionCount: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.mempoolSizeBytes({
								fields: {
									mempoolSizeBytes: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.mempoolTps({
								fields: {
									mempoolTps: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.averageTransactionFee24hSats({
								fields: {
									averageTransactionFee24hSats: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.medianTransactionFee24hSats({
								fields: {
									medianTransactionFee24hSats: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.suggestedTransactionFeePerByteSats({
								fields: {
									suggestedTransactionFeePerByteSats: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
						resource={
							projection.blockchainSizeBytes({
								fields: {
									blockchainSizeBytes: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
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
