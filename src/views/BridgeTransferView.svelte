<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BridgeTransfer> = $props()

	const sourceTx = $derived(selection.entitySelector.$sourceTx)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Across_Rest,
			Source.Allium_Rest,
			Source.Axelarscan_Rest,
			Source.Dune_Rest,
			Source.LayerZeroScan_Rest,
			Source.Lifi_Rest,
			Source.Voltaire_JsonRpc,
			Source.Wormholescan,
		],
	}))
	const bridgeTransfer = $derived(viewSelection({
		fields: {
			transferId: true,
			source: true,
			railId: true,
		},
	}))
	const titleFallback = $derived((prefetched.transferId ?? '') || 'bridge transfer')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BridgeTransfer_TimestampsView from '$/views/BridgeTransfer_TimestampsView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'source' in selection.entitySelector
				&& 'logIndex' in selection.entitySelector
				&& '$sourceTx' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/bridge-transfer/[source=stringSegment]/[logIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in sourceTx.$network ?
									caip2StringFromValue(sourceTx.$network.caip2)
								:
									sourceTx.$network.slug
							),
							transactionId: sourceTx.txHash,
							source: selection.entitySelector.source,
							logIndex: String(selection.entitySelector.logIndex),
						}
					)
				:
					'originChainId' in selection.entitySelector
					&& 'depositId' in selection.entitySelector ?
						resolve(
							'/~/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]',
							{
								originChainId: String(selection.entitySelector.originChainId),
								depositId: String(selection.entitySelector.depositId),
							}
						)
					:
						'source' in selection.entitySelector
						&& 'transferId' in selection.entitySelector ?
							resolve(
								'/~/bridge/transfer/[source=stringSegment]/[transferId=stringSegment]',
								{
									source: selection.entitySelector.source,
									transferId: selection.entitySelector.transferId,
								}
							)
						:
							undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bridgeTransfer}>
			{#snippet children(entity)}
				{entity.transferId || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bridgeTransfer}>
			{#snippet children(entity)}
				{[entity.source, (entity.railId ?? '')].filter(Boolean).join(' ') || entity.transferId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transfer ID</dt>
				<dd>
					<ResourceBoundary
						resource={bridgeTransfer}
					>
						{#snippet children(entity)}
							{entity.transferId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={bridgeTransfer}
					>
						{#snippet children(entity)}
							{entity.source}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$sourceTx}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null}
						<div>
							<dt>source tx</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							logIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const logIndex = entity.logIndex}
					{#if logIndex != null}
						<div>
							<dt>log index</dt>
							<dd>
								{logIndex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$destinationTx}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null}
						<div>
							<dt>destination tx</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							originChainId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const originChainId = entity.originChainId}
					{#if originChainId != null}
						<div>
							<dt>origin chain ID</dt>
							<dd>
								<NumberValue
									value={originChainId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							depositId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depositId = entity.depositId}
					{#if depositId != null}
						<div>
							<dt>deposit ID</dt>
							<dd>
								<NumberValue
									value={depositId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$sender}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>sender</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$recipient}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>recipient</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fromNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>from network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$toNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>to network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fromToken}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>from token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$toToken}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>to token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							amountIn: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountIn = entity.amountIn}
					{#if amountIn != null}
						<div>
							<dt>amount in</dt>
							<dd>
								<NumberValue
									value={amountIn}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							amountOut: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountOut = entity.amountOut}
					{#if amountOut != null}
						<div>
							<dt>amount out</dt>
							<dd>
								<NumberValue
									value={amountOut}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bridgeTransfer}
			>
				{#snippet children(entity)}
					{@const railId = entity.railId}
					{#if railId != null}
						<div>
							<dt>rail ID</dt>
							<dd>
								{railId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							settlementModel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const settlementModel = entity.settlementModel}
					{#if settlementModel != null}
						<div>
							<dt>settlement model</dt>
							<dd>
								{settlementModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verificationModel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationModel = entity.verificationModel}
					{#if verificationModel != null}
						<div>
							<dt>verification model</dt>
							<dd>
								{verificationModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							assetOutcome: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetOutcome = entity.assetOutcome}
					{#if assetOutcome != null}
						<div>
							<dt>asset outcome</dt>
							<dd>
								{assetOutcome}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							bridgeFeeUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bridgeFeeUsd = entity.bridgeFeeUsd}
					{#if bridgeFeeUsd != null}
						<div>
							<dt>bridge fee USD</dt>
							<dd>
								{bridgeFeeUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							exclusiveRelayer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exclusiveRelayer = entity.exclusiveRelayer}
					{#if exclusiveRelayer != null}
						<div>
							<dt>exclusive relayer</dt>
							<dd>
								{exclusiveRelayer}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceTransactionAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceTransactionAtMs = entity.sourceTransactionAtMs}
					{#if sourceTransactionAtMs != null}
						<div>
							<dt>source transaction at</dt>
							<dd>
								<Timestamp timestamp={sourceTransactionAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							destinationTransactionAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationTransactionAtMs = entity.destinationTransactionAtMs}
					{#if destinationTransactionAtMs != null}
						<div>
							<dt>destination transaction at</dt>
							<dd>
								<Timestamp timestamp={destinationTransactionAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactionLatencyMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionLatencyMs = entity.transactionLatencyMs}
					{#if transactionLatencyMs != null}
						<div>
							<dt>transaction latency ms</dt>
							<dd>
								<NumberValue
									value={transactionLatencyMs}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BridgeTransfer_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
