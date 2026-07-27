<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { networkApplicableSources } from '$/sources/index.ts'
	import { beaconRestBaseByExecutionChainId } from '$/constants/BeaconConsensus.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { networkByCaip2, networkBySlug, NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.Network> = $props()

	const pendingEntity = $derived(
		(() => {
			const base = { ...selection.entitySelector, ...prefetched }
			const caip2Key = (
				base.caip2 == null ?
					undefined
				:
					`${base.caip2.namespace}:${base.caip2.reference}`
			)
			const catalog = (
				caip2Key != null ?
					networkByCaip2[caip2Key]
				: base.slug != null ?
					networkBySlug[base.slug]
				:
					undefined
			)
			const caip2 = base.caip2 ?? catalog?.caip2
			const beacon = (
				caip2 == null ?
					undefined
				:
					beaconRestBaseByExecutionChainId[Number(caip2.reference)]
			)

			return {
				...base,
				...(base.caip2 == null && caip2 != null && { caip2 }),
				...(base.name == null && catalog != null && { name: catalog.name }),
				...(base.namespace == null && catalog != null && { namespace: catalog.namespace }),
				...(base.environment == null && catalog != null && { environment: catalog.environment }),
				...(base.slug == null && catalog != null && { slug: catalog.slug }),
				...(base.executionModels == null && catalog != null && {
					executionModels: {
						values: catalog.executionModels,
					},
				}),
				...(base.ledgerModels == null && catalog != null && {
					ledgerModels: {
						values: catalog.ledgerModels,
					},
				}),
				...(base.consensusProtocol == null && beacon != null && {
					consensusProtocol: beacon.consensusProtocol,
				}),
				...(base.consensusEndpoints == null && beacon != null && {
					consensusEndpoints: {
						values: [
							{
								restBaseUrl: beacon.restBaseUrl,
								consensusProtocol: beacon.consensusProtocol,
							},
						],
					},
				}),
			}
		})()
	)
	const voltaireJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Voltaire_JsonRpc,
		], pendingEntity)
	)

	const blockscoutRestSources = $derived(
		networkApplicableSources([
			Source.Blockscout_Rest,
		], pendingEntity)
	)

	const beaconRestSources = $derived(
		networkApplicableSources([
			Source.Beacon_Rest,
		], pendingEntity)
	)

	const cosmosSdkRestSources = $derived(
		networkApplicableSources([
			Source.CosmosSdk_Rest,
		], pendingEntity)
	)

	const polkadotJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Polkadot_JsonRpc,
		], pendingEntity)
	)

	const solanaJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Solana_JsonRpc,
		], pendingEntity)
	)

	const mempoolSpaceRestAndBlockchairRestSources = $derived(
		networkApplicableSources([
			Source.MempoolSpace_Rest,
			Source.Blockchair_Rest,
		], pendingEntity)
	)

	const bittensorJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Bittensor_JsonRpc,
		], pendingEntity)
	)

	const nearRpcJsonRpcSources = $derived(
		networkApplicableSources([
			Source.NearRpc_JsonRpc,
		], pendingEntity)
	)

	const cardanoKoiosRestSources = $derived(
		networkApplicableSources([
			Source.CardanoKoios_Rest,
		], pendingEntity)
	)

	const tronGridRestSources = $derived(
		networkApplicableSources([
			Source.TronGrid_Rest,
		], pendingEntity)
	)

	const xrplRippledSources = $derived(
		networkApplicableSources([
			Source.Xrpl_Rippled,
		], pendingEntity)
	)

	const hederaMirrorNodeRestSources = $derived(
		networkApplicableSources([
			Source.HederaMirrorNode_Rest,
		], pendingEntity)
	)

	const hyperliquidJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Hyperliquid_JsonRpc,
		], pendingEntity)
	)

	const hyperliquidRestSources = $derived(
		networkApplicableSources([
			Source.Hyperliquid_Rest,
		], pendingEntity)
	)


	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const network = $derived(viewSelection({
		fields: {
			name: true,
			namespace: true,
			ledgerModels: true,
			executionModels: true,
			environment: true,
			caip2: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.name ?? '') || (pendingEntity.caip2 == null ? '' : `${pendingEntity.caip2.namespace}:${pendingEntity.caip2.reference}`) || 'Network')
	const viewDomId = $derived('network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
	import EvmNetwork_Txpool_TimestampView from '$/views/EvmNetwork_Txpool_TimestampView.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import EvmRollupsView from '$/views/EvmRollupsView.svelte'
	import EthereumExecutionUpgradesView from '$/views/EthereumExecutionUpgradesView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmNetwork_Txpool_TimestampsView from '$/views/EvmNetwork_Txpool_TimestampsView.svelte'
	import EvmNetwork_GasFee_BlocksView from '$/views/EvmNetwork_GasFee_BlocksView.svelte'
	import EvmNetwork_GasEstimate_TimestampsView from '$/views/EvmNetwork_GasEstimate_TimestampsView.svelte'
	import EthereumConsensusUpgradesView from '$/views/EthereumConsensusUpgradesView.svelte'
	import EthereumBeaconFinality_TimestampsView from '$/views/EthereumBeaconFinality_TimestampsView.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import BeaconSyncCommitteesView from '$/views/BeaconSyncCommitteesView.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
	import BeaconValidatorsView from '$/views/BeaconValidatorsView.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import MevRelaysView from '$/views/MevRelaysView.svelte'
	import MevBuildersView from '$/views/MevBuildersView.svelte'
	import MevRelay_ProposerPayloadDeliveredsView from '$/views/MevRelay_ProposerPayloadDeliveredsView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import Erc4337SmartAccountsView from '$/views/Erc4337SmartAccountsView.svelte'
	import Erc4337BundlersView from '$/views/Erc4337BundlersView.svelte'
	import Erc4337PaymastersView from '$/views/Erc4337PaymastersView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import Erc4337AccountFactoriesView from '$/views/Erc4337AccountFactoriesView.svelte'
	import EvmNetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import CosmosValidatorsView from '$/views/CosmosValidatorsView.svelte'
	import CosmosAccountsView from '$/views/CosmosAccountsView.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
	import PolkadotValidatorsView from '$/views/PolkadotValidatorsView.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaProgramsView from '$/views/SolanaProgramsView.svelte'
	import SolanaTokenAccountsView from '$/views/SolanaTokenAccountsView.svelte'
	import SolanaTokenMintsView from '$/views/SolanaTokenMintsView.svelte'
	import Network_TimestampsView from '$/views/Network_TimestampsView.svelte'
	import UtxoBlocksView from '$/views/UtxoBlocksView.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
	import ZcashShieldedPoolsView from '$/views/ZcashShieldedPoolsView.svelte'
	import BittensorNetwork_TimestampsView from '$/views/BittensorNetwork_TimestampsView.svelte'
	import BittensorBlocksView from '$/views/BittensorBlocksView.svelte'
	import BittensorSubnetsView from '$/views/BittensorSubnetsView.svelte'
	import ZeroGNetwork_TimestampsView from '$/views/ZeroGNetwork_TimestampsView.svelte'
	import ZeroGStorageNodesView from '$/views/ZeroGStorageNodesView.svelte'
	import ZeroGDataBlobsView from '$/views/ZeroGDataBlobsView.svelte'
	import ZeroGStorageLogEntriesView from '$/views/ZeroGStorageLogEntriesView.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import NearNetwork_TimestampsView from '$/views/NearNetwork_TimestampsView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import NearValidatorsView from '$/views/NearValidatorsView.svelte'
	import MoneroNetwork_TimestampsView from '$/views/MoneroNetwork_TimestampsView.svelte'
	import MoneroBlocksView from '$/views/MoneroBlocksView.svelte'
	import LightningNetwork_TimestampsView from '$/views/LightningNetwork_TimestampsView.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
	import CardanoNetwork_TimestampsView from '$/views/CardanoNetwork_TimestampsView.svelte'
	import CardanoBlocksView from '$/views/CardanoBlocksView.svelte'
	import CardanoTransactionsView from '$/views/CardanoTransactionsView.svelte'
	import CardanoStakePoolsView from '$/views/CardanoStakePoolsView.svelte'
	import CardanoDRepsView from '$/views/CardanoDRepsView.svelte'
	import CardanoGovernanceProposalsView from '$/views/CardanoGovernanceProposalsView.svelte'
	import CardanoCommittee_EpochsView from '$/views/CardanoCommittee_EpochsView.svelte'
	import CardanoNativeAssetsView from '$/views/CardanoNativeAssetsView.svelte'
	import CardanoProtocolParameters_EpochsView from '$/views/CardanoProtocolParameters_EpochsView.svelte'
	import TronNetwork_TimestampsView from '$/views/TronNetwork_TimestampsView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import TronWitnessesView from '$/views/TronWitnessesView.svelte'
	import TonNetwork_TimestampsView from '$/views/TonNetwork_TimestampsView.svelte'
	import XrplLedgersView from '$/views/XrplLedgersView.svelte'
	import XrplTransactionsView from '$/views/XrplTransactionsView.svelte'
	import XrplAccountsView from '$/views/XrplAccountsView.svelte'
	import XrplLedgerEntriesView from '$/views/XrplLedgerEntriesView.svelte'
	import XrplAmendmentsView from '$/views/XrplAmendmentsView.svelte'
	import XrplAmmsView from '$/views/XrplAmmsView.svelte'
	import HederaBlocksView from '$/views/HederaBlocksView.svelte'
	import HederaAccountsView from '$/views/HederaAccountsView.svelte'
	import HyperliquidNetwork_TimestampsView from '$/views/HyperliquidNetwork_TimestampsView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
	import HyperliquidValidatorsView from '$/views/HyperliquidValidatorsView.svelte'
	import HyperliquidPerpMarketsView from '$/views/HyperliquidPerpMarketsView.svelte'
	import HyperliquidSpotAssetsView from '$/views/HyperliquidSpotAssetsView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
			{
				network: (
					'caip2' in selection.entitySelector ?
						String(caip2StringFromValue(selection.entitySelector.caip2))
					:
						String(selection.entitySelector.slug)
				),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<IconComponent />
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={network}>
			{#snippet children(entity)}
				{@const caip20 = entity.caip2}
				{#if caip20 != null}
					<TruncatedValue value={`${caip20.namespace}:${caip20.reference}`} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A blockchain, ledger, or protocol network with its own identity and supporting metadata.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl class='network-summary-head' data-column-item="center">
			{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}
				<div>
					<dt>Upgrade</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection.Evm
									.$$upgrades({
										sources: [
											Source.Constants_Internal,
										],
										fields: {
											name: true,
											activationBlock: true,
										},
										limit: 1,
										orderBy: [
											[({ fieldRow }) => fieldRow[EntityMetaKey.Value].activationBlock ?? Number.NEGATIVE_INFINITY, 'desc'],
										],
									})
							}
						>
							{#snippet children(ethereumNetworkUpgrades)}
								{@const ethereumNetworkUpgrade = ethereumNetworkUpgrades.values[0]}
								{#if ethereumNetworkUpgrade != null}
									{@const ethereumNetworkUpgradeSelector = ethereumNetworkUpgrade[EntityMetaKey.Selector]}
									<EthereumNetworkUpgradeView
										selection={
											select(EntityType.EthereumNetworkUpgrade, ethereumNetworkUpgradeSelector, {
												sources: [
													Source.Constants_Internal,
												],
											})
										}
										prefetched={{ ...ethereumNetworkUpgradeSelector, ...ethereumNetworkUpgrade }}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<p data-text="muted" data-section-state="resolved-empty">No upgrade available.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}
				<div>
					<dt>Block</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection.Evm
									.$$blocks({
										sources: [
											Source.Voltaire_JsonRpc,
										],
										fields: {
											blockNumber: true,
										},
										limit: 1,
										orderBy: [
											[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].blockNumber ?? Number.NEGATIVE_INFINITY, 'desc'],
										],
									})
							}
						>
							{#snippet children(evmBlocks)}
								{@const evmBlock = evmBlocks.values[0]}
								{#if evmBlock != null}
									{@const evmBlockSelector = evmBlock[EntityMetaKey.Selector]}
									<EvmBlockView
										selection={
											select(EntityType.EvmBlock, evmBlockSelector, {
												sources: [
													Source.Voltaire_JsonRpc,
												],
											})
										}
										prefetched={{ ...evmBlockSelector, ...evmBlock }}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<p data-text="muted" data-section-state="resolved-empty">No block available.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}
				<div>
					<dt>Fee market</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection.Evm
									.$$gasFeeBlocks({
										sources: [
											Source.Voltaire_JsonRpc,
										],
										fields: {
											blockNumber: true,
											baseFeePerGas: true,
											gasUsedRatio: true,
										},
										limit: 1,
										orderBy: [
											[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].blockNumber ?? Number.NEGATIVE_INFINITY, 'desc'],
										],
									})
							}
						>
							{#snippet children(evmNetworkGasFeeBlocks)}
								{@const evmNetworkGasFeeBlock = evmNetworkGasFeeBlocks.values[0]}
								{#if evmNetworkGasFeeBlock != null}
									{@const evmNetworkGasFeeBlockSelector = evmNetworkGasFeeBlock[EntityMetaKey.Selector]}
									<EvmNetwork_GasFee_BlockView
										selection={
											select(EntityType.EvmNetwork_GasFee_Block, evmNetworkGasFeeBlockSelector, {
												sources: [
													Source.Voltaire_JsonRpc,
												],
											})
										}
										prefetched={{ ...evmNetworkGasFeeBlockSelector, ...evmNetworkGasFeeBlock }}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<p data-text="muted" data-section-state="resolved-empty">No fee market available.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}
				<div>
					<dt>Mempool</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection.Evm
									.$$txpoolTimestamps({
										sources: [
											Source.Voltaire_JsonRpc,
										],
										fields: {
											timestampMs: true,
											pendingCount: true,
											queuedCount: true,
										},
										limit: 1,
										orderBy: [
											[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
										],
									})
							}
						>
							{#snippet children(evmNetworkTxpoolTimestamps)}
								{@const evmNetworkTxpoolTimestamp = evmNetworkTxpoolTimestamps.values[0]}
								{#if evmNetworkTxpoolTimestamp != null}
									{@const evmNetworkTxpoolTimestampSelector = evmNetworkTxpoolTimestamp[EntityMetaKey.Selector]}
									<EvmNetwork_Txpool_TimestampView
										selection={
											select(EntityType.EvmNetwork_Txpool_Timestamp, evmNetworkTxpoolTimestampSelector, {
												sources: [
													Source.Voltaire_JsonRpc,
												],
											})
										}
										prefetched={{ ...evmNetworkTxpoolTimestampSelector, ...evmNetworkTxpoolTimestamp }}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<p data-text="muted" data-section-state="resolved-empty">No mempool available.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}
				<div>
					<dt>Epoch</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection.Evm
									.$$beaconEpochs({
										sources: [
											Source.Beacon_Rest,
										],
										fields: {
											epoch: true,
											startSlot: true,
											endSlot: true,
										},
										limit: 1,
										orderBy: [
											[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].epoch ?? Number.NEGATIVE_INFINITY, 'desc'],
										],
									})
							}
						>
							{#snippet children(beaconEpochs)}
								{@const beaconEpoch = beaconEpochs.values[0]}
								{#if beaconEpoch != null}
									{@const beaconEpochSelector = beaconEpoch[EntityMetaKey.Selector]}
									<BeaconEpochView
										selection={
											select(EntityType.BeaconEpoch, beaconEpochSelector, {
												sources: [
													Source.Beacon_Rest,
												],
											})
										}
										prefetched={{ ...beaconEpochSelector, ...beaconEpoch }}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<p data-text="muted" data-section-state="resolved-empty">No epoch available.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}
				<div>
					<dt>Slot</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection.Evm
									.$$beaconSlots({
										sources: [
											Source.Beacon_Rest,
										],
										fields: {
											slot: true,
											epoch: true,
										},
										limit: 1,
										orderBy: [
											[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].slot ?? Number.NEGATIVE_INFINITY, 'desc'],
										],
									})
							}
						>
							{#snippet children(beaconSlots)}
								{@const beaconSlot = beaconSlots.values[0]}
								{#if beaconSlot != null}
									{@const beaconSlotSelector = beaconSlot[EntityMetaKey.Selector]}
									<BeaconSlotView
										selection={
											select(EntityType.BeaconSlot, beaconSlotSelector, {
												sources: [
													Source.Beacon_Rest,
												],
											})
										}
										prefetched={{ ...beaconSlotSelector, ...beaconSlot }}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<p data-text="muted" data-section-state="resolved-empty">No slot available.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={network}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={network}
					>
						{#snippet children(entity)}
							{entity.namespace}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Ledger models</dt>
				<dd>
					<ResourceBoundary
						resource={network}
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
						resource={network}
					>
						{#snippet children(entity)}
							{entity.executionModels.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$networkStack}
			>
				{#snippet children(networkStack)}
					{#if networkStack != null}
						<div>
							<dt>Network stack</dt>
							<dd>
								<NetworkStackView
									selection={select(EntityType.NetworkStack, networkStack[EntityMetaKey.Selector])}
									prefetched={networkStack}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Environment</dt>
				<dd>
					<ResourceBoundary
						resource={network}
					>
						{#snippet children(entity)}
							{entity.environment}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={network}
			>
				{#snippet children(entity)}
					{@const caip2 = entity.caip2}
					{#if caip2 != null}
						<div>
							<dt>CAIP-2</dt>
							<dd>
								<TruncatedValue value={`${caip2.namespace}:${caip2.reference}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if pendingEntity.executionModels != null && pendingEntity.executionModels.values.includes('Evm')}
				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.consensusProtocol}
					>
						{#snippet children(consensusProtocol)}
							{#if consensusProtocol != null}
								<div>
									<dt>Consensus</dt>
									<dd>
										{String((consensusProtocolByProtocol[String(consensusProtocol)]?.label ?? (consensusProtocol)) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.registryStatus}
					>
						{#snippet children(registryStatus)}
							{#if registryStatus != null}
								<div>
									<dt>Registry name status</dt>
									<dd>
										{registryStatus}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.shortName}
					>
						{#snippet children(shortName)}
							{#if shortName != null}
								<div>
									<dt>Short name</dt>
									<dd>
										{shortName}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.peeringId}
					>
						{#snippet children(peeringId)}
							{#if peeringId != null}
								<div>
									<dt>Peering ID</dt>
									<dd>
										<NumberValue
											value={peeringId}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.slip44}
					>
						{#snippet children(slip44)}
							{#if slip44 != null}
								<div>
									<dt>SLIP-44</dt>
									<dd>
										<NumberValue
											value={slip44}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.$nativeCoinInstance}
					>
						{#snippet children(evmCoinInstance)}
							{#if evmCoinInstance != null}
								<div>
									<dt>Native currency</dt>
									<dd>
										<EvmCoinInstanceView
											selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
											prefetched={evmCoinInstance}
											layout={EntityLayout.Value}
											open={false}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.$nativeCoin}
					>
						{#snippet children(coin)}
							{#if coin != null}
								<div>
									<dt>Native coin</dt>
									<dd>
										<CoinView
											selection={select(EntityType.Coin, coin[EntityMetaKey.Selector])}
											prefetched={coin}
											layout={EntityLayout.Value}
											open={false}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.$parent}
					>
						{#snippet children(network)}
							{#if network != null}
								<div>
									<dt>Parent</dt>
									<dd>
										<NetworkView
											selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
											prefetched={network}
											layout={EntityLayout.Value}
											open={false}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}

				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Evm.$mainnet}
					>
						{#snippet children(network)}
							{#if network != null}
								<div>
									<dt>Mainnet</dt>
									<dd>
										<NetworkView
											selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
											prefetched={network}
											layout={EntityLayout.Value}
											open={false}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if pendingEntity.namespace != null && pendingEntity.namespace === 'ZeroG'}
				<ResourceBoundary
					resource={selection.ZeroG.chainId}
				>
					{#snippet children(chainId)}
						{#if chainId != null}
							<div>
								<dt>Chain ID</dt>
								<dd>
									<NumberValue
										value={chainId}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if pendingEntity.namespace != null && pendingEntity.namespace === 'Lightning'}
				{#if contentOpen}
					<ResourceBoundary
						resource={selection.Lightning.$settlementNetwork}
					>
						{#snippet children(network)}
							{#if network != null}
								<div>
									<dt>Settlement network</dt>
									<dd>
										<NetworkView
											selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
											prefetched={network}
											layout={EntityLayout.Value}
											open={false}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if pendingEntity.namespace != null && pendingEntity.namespace === 'Hedera'}
				<ResourceBoundary
					resource={selection.Hedera.shard}
				>
					{#snippet children(shard)}
						{#if shard != null}
							<div>
								<dt>Shard</dt>
								<dd>
									<NumberValue
										value={shard}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={selection.Hedera.realm}
				>
					{#snippet children(realm)}
						{#if realm != null}
							<div>
								<dt>Realm</dt>
								<dd>
									<NumberValue
										value={realm}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-network-assets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'network-assets-native-assets',
						label: 'Native assets',
					},
				]
			}
			data-card
			class='network-view-collapsible-assets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNetworkAssetsNativeAssets({ id, label, open })}
				<AssetInstancesView
					selection={
						selection
							.$$nativeAssets({
								sources: [
									Source.Constants_Internal,
								],
								limit: 16,
							})
					}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-network-resources'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'network-resources-faucets',
						label: 'Faucets',
					},
					{
						id: 'network-resources-block-explorers',
						label: 'Block explorers',
					},
				]
			}
			data-card
			class='network-view-collapsible-resources'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNetworkResourcesFaucets({ id, label, open })}
				<UrlsView
					selection={
						selection
							.$$faucetUrls({
								sources: [
									Source.Constants_Internal,
									Source.Chainlist_Rest,
								],
							})
					}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionNetworkResourcesBlockExplorers({ id, label, open })}
				<UrlsView
					selection={
						selection
							.$$blockExplorerUrls({
								sources: [
									Source.Constants_Internal,
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
									Source.Lifi_Rest,
								],
							})
					}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<ProjectionBoundary
			resource={selection.Evm}
		>
			{#snippet Applicable(projection)}
				{@const evmNetworkTopologyParentLayerResource = projection
				.$parent({
					sources: [
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
						Source.L2Beat_Rest,
					],
				})}

				{@const evmNetworkTopologyRollupResource = projection
				.$rollup({
					sources: [
						Source.L2Beat_Rest,
					],
				})}

				{@const evmNetworkTopologyMainnetResource = projection
				.$mainnet({
					sources: [
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
					],
				})}

				<CollapsibleTabs
					id={viewDomId + '-carousel-evm-network-topology'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'evm-network-topology-upgrades',
								label: 'Upgrades',
							},
							{
								id: 'evm-network-topology-parent-layer',
								label: 'Parent',
								ownsSection: true,
							},
							{
								id: 'evm-network-topology-rollup',
								label: 'Rollup',
								ownsSection: true,
							},
							{
								id: 'evm-network-topology-sibling-shards',
								label: 'Shards',
							},
							{
								id: 'evm-network-topology-testnets',
								label: 'Testnets',
							},
							{
								id: 'evm-network-topology-mainnet',
								label: 'Mainnet',
								ownsSection: true,
							},
							{
								id: 'evm-network-topology-child-layers',
								label: 'Layers',
							},
							{
								id: 'evm-network-topology-settled-rollups',
								label: 'Settled rollups',
							},
						]
					}
					data-card
					class='network-view-collapsible-network-relationships'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Topology</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionEvmNetworkTopologyUpgrades({ id, label, open })}
						<EthereumNetworkUpgradesView
							selection={projection.$$upgrades}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet MarkerEvmNetworkTopologyParentLayer(_context, Content)}
						<ResourceBoundary
							resource={evmNetworkTopologyParentLayerResource}
						>
							{#snippet children(_resolved)}
								{#if _resolved != null}
								{@render Content()}
								{/if}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionEvmNetworkTopologyParentLayer({ id, label, open, active })}
						<ResourceBoundary
							resource={evmNetworkTopologyParentLayerResource}
						>
							{#snippet children(network)}
								{#if network != null}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
															<article
																id={`${id}-list`}
																data-column-item="flexible"
																data-card
																data-scroll-container
															>
																<NetworkView
																	selection={select(EntityType.Network, network[EntityMetaKey.Selector], { sources: [
										Source.Chainlist_Rest,
										Source.EthereumLists_Rest,
										Source.L2Beat_Rest,
									] })}
																	prefetched={network}
																	layout={EntityLayout.SummaryInline}
																	open={false}
																/>
															</article>
								</section>
								{/if}
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerEvmNetworkTopologyRollup(_context, Content)}
						<ResourceBoundary
							resource={evmNetworkTopologyRollupResource}
						>
							{#snippet children(_resolved)}
								{#if _resolved != null}
								{@render Content()}
								{/if}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionEvmNetworkTopologyRollup({ id, label, open, active })}
						<ResourceBoundary
							resource={evmNetworkTopologyRollupResource}
						>
							{#snippet children(evmRollup)}
								{#if evmRollup != null}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
															<article
																id={`${id}-list`}
																data-column-item="flexible"
																data-card
																data-scroll-container
															>
																<EvmRollupView
																	selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector], { sources: [
										Source.L2Beat_Rest,
									] })}
																	prefetched={evmRollup}
																	layout={EntityLayout.SummaryInline}
																	open={false}
																/>
															</article>
								</section>
								{/if}
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionEvmNetworkTopologySiblingShards({ id, label, open })}
						<NetworksView
							selection={
								projection
									.$$siblingShardNetworks({
										sources: [
											Source.Chainlist_Rest,
											Source.EthereumLists_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							emptyText='No sibling shard networks listed for this network yet.'
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionEvmNetworkTopologyTestnets({ id, label, open })}
						<NetworksView
							selection={
								projection
									.$$testnets({
										sources: [
											Source.Chainlist_Rest,
											Source.EthereumLists_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							emptyText='No testnets listed for this network yet.'
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet MarkerEvmNetworkTopologyMainnet(_context, Content)}
						<ResourceBoundary
							resource={evmNetworkTopologyMainnetResource}
						>
							{#snippet children(_resolved)}
								{#if _resolved != null}
								{@render Content()}
								{/if}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionEvmNetworkTopologyMainnet({ id, label, open, active })}
						<ResourceBoundary
							resource={evmNetworkTopologyMainnetResource}
						>
							{#snippet children(network)}
								{#if network != null}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
															<article
																id={`${id}-list`}
																data-column-item="flexible"
																data-card
																data-scroll-container
															>
																<NetworkView
																	selection={select(EntityType.Network, network[EntityMetaKey.Selector], { sources: [
										Source.Chainlist_Rest,
										Source.EthereumLists_Rest,
									] })}
																	prefetched={network}
																	layout={EntityLayout.SummaryInline}
																	open={false}
																/>
															</article>
								</section>
								{/if}
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionEvmNetworkTopologyChildLayers({ id, label, open })}
						<NetworksView
							selection={
								projection
									.$$childLayers({
										sources: [
											Source.Chainlist_Rest,
											Source.EthereumLists_Rest,
											Source.L2Beat_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							emptyText='No child layer networks listed for this network yet.'
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionEvmNetworkTopologySettledRollups({ id, label, open })}
						<EvmRollupsView
							selection={
								projection
									.$$settledRollups({
										sources: [
											Source.L2Beat_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							emptyText='No settled rollups listed for this network yet.'
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Evm}
		>
			{#snippet Applicable(projection)}
				{@const evmExecutionGasEstimatesSources = networkApplicableSources([
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				], pendingEntity)}

				{@const evmExecutionSections = [
					{
						id: 'evm-execution-upgrades',
						label: 'Upgrades',
					},
					...(
						voltaireJsonRpcSources.length > 0 ?
							[
								{
									id: 'evm-execution-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-execution-transactions',
									label: 'Transactions',
								},
							]
						:
							[]
					),
					...(
						voltaireJsonRpcSources.length > 0 ?
							[
								{
									id: 'evm-execution-mempool',
									label: 'Mempool',
								},
							]
						:
							[]
					),
					...(
						voltaireJsonRpcSources.length > 0 ?
							[
								{
									id: 'evm-execution-gas-blocks',
									label: 'Fee market',
								},
							]
						:
							[]
					),
					...(
						evmExecutionGasEstimatesSources.length > 0 ?
							[
								{
									id: 'evm-execution-gas-estimates',
									label: 'Gas estimates',
								},
							]
						:
							[]
					),
					{
						id: 'evm-execution-endpoints',
						label: 'Endpoints',
					},
				]}

				{#if evmExecutionSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-execution'}
						sectionIdPrefix={viewDomId}
						sections={evmExecutionSections}
						data-card
						class='network-view-collapsible-execution'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Execution</HeadingComponent>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Blocks, transactions, mempool activity, fee markets, gas estimates, upgrades, and the RPC endpoints used to execute and inspect this EVM network.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='Execution help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionEvmExecutionUpgrades({ id, label, open })}
							<EthereumExecutionUpgradesView
								selection={
									projection
										.$$executionUpgrades({
											sources: [
												Source.Constants_Internal,
											],
											limit: 512,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionBlocks({ id, label, open })}
							<EvmBlocksView
								selection={
									projection
										.$$blocks({
											sources: voltaireJsonRpcSources,
											limit: 4,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionTransactions({ id, label, open })}
							<EvmTransactionsView
								selection={
									projection
										.$$transactions({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionMempool({ id, label, open })}
							<EvmNetwork_Txpool_TimestampsView
								selection={
									projection
										.$$txpoolTimestamps({
											sources: voltaireJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionGasBlocks({ id, label, open })}
							<EvmNetwork_GasFee_BlocksView
								selection={
									projection
										.$$gasFeeBlocks({
											sources: voltaireJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionGasEstimates({ id, label, open })}
							<EvmNetwork_GasEstimate_TimestampsView
								selection={
									projection
										.$$gasEstimateTimestamps({
											sources: evmExecutionGasEstimatesSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionEndpoints({ id, label, open })}
							<UrlsView
								selection={
									projection
										.$$rpcUrls({
											sources: [
												Source.Constants_Internal,
												Source.Chainlist_Rest,
												Source.EthereumLists_Rest,
												Source.Lifi_Rest,
											],
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Evm.EthereumBeacon}
		>
			{#snippet Applicable(projection)}
				{@const evmConsensusBlockProductionSections = [
					{
						id: 'evm-consensus-upgrades',
						label: 'Upgrades',
					},
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-finality',
									label: 'Finality',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-committees',
									label: 'Committees',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-sync-committees',
									label: 'Sync committees',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-attestations',
									label: 'Attestations',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-withdrawals',
									label: 'Withdrawals',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-slashings',
									label: 'Slashings',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-validators',
									label: 'Validators',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-epochs',
									label: 'Epochs',
								},
							]
						:
							[]
					),
					...(
						beaconRestSources.length > 0 ?
							[
								{
									id: 'evm-consensus-slots',
									label: 'Slots',
								},
							]
						:
							[]
					),
					{
						id: 'evm-consensus-mev-relays',
						label: 'Relays',
					},
					{
						id: 'evm-consensus-mev-builders',
						label: 'Builders',
					},
					{
						id: 'evm-consensus-mev-boost',
						label: 'MEV-Boost',
					},
					{
						id: 'evm-consensus-endpoints',
						label: 'Endpoints',
						ownsSection: true,
					},
				]}

				{#if evmConsensusBlockProductionSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-consensus-block-production'}
						sectionIdPrefix={viewDomId}
						sections={evmConsensusBlockProductionSections}
						data-card
						class='network-view-collapsible-consensus'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and block production</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionEvmConsensusUpgrades({ id, label, open })}
							<EthereumConsensusUpgradesView
								selection={
									selection.Evm
										.$$consensusUpgrades({
											sources: [
												Source.Constants_Internal,
											],
											limit: 512,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusFinality({ id, label, open })}
							<EthereumBeaconFinality_TimestampsView
								selection={
									selection.Evm
										.$$beaconFinalityTimestamps({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusCommittees({ id, label, open })}
							<BeaconCommitteesView
								selection={
									selection.Evm
										.$$beaconCommittees({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusSyncCommittees({ id, label, open })}
							<BeaconSyncCommitteesView
								selection={
									selection.Evm
										.$$beaconSyncCommittees({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusAttestations({ id, label, open })}
							<BeaconAttestationsView
								selection={
									selection.Evm
										.$$beaconAttestations({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusWithdrawals({ id, label, open })}
							<BeaconWithdrawalsView
								selection={
									selection.Evm
										.$$beaconWithdrawals({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusSlashings({ id, label, open })}
							<BeaconSlashingsView
								selection={
									selection.Evm
										.$$beaconSlashings({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusValidators({ id, label, open })}
							<BeaconValidatorsView
								selection={
									selection.Evm
										.$$beaconValidators({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusEpochs({ id, label, open })}
							<BeaconEpochsView
								selection={
									selection.Evm
										.$$beaconEpochs({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusSlots({ id, label, open })}
							<BeaconSlotsView
								selection={
									selection.Evm
										.$$beaconSlots({
											sources: beaconRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusMevRelays({ id, label, open })}
							<MevRelaysView
								selection={
									selection.Evm
										.$$mevRelays({
											sources: [
												Source.Constants_Internal,
											],
											limit: 64,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusMevBuilders({ id, label, open })}
							<MevBuildersView
								selection={
									selection.Evm
										.$$mevBuilders({
											sources: [
												Source.MevRelay_Rest,
											],
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusMevBoost({ id, label, open })}
							<MevRelay_ProposerPayloadDeliveredsView
								selection={
									selection.Evm
										.$$mevProposerPayloadDelivered({
											sources: [
												Source.MevRelay_Rest,
											],
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmConsensusEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={selection.Evm.consensusEndpoints}
							>
								{#snippet children(consensusEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if consensusEndpointsField.values.length === 0}
												<p data-text="muted">Consensus endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each consensusEndpointsField.values as consensusEndpoint, consensusEndpointIndex (consensusEndpointIndex)}
													{@const restBaseUrlValue = consensusEndpoint.restBaseUrl}
													{@const consensusProtocolValue = consensusEndpoint.consensusProtocol}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	{#if restBaseUrlValue != null}
																		{String(restBaseUrlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Protocol</dt>
																<dd>
																	{#if consensusProtocolValue != null}
																		{(consensusProtocolByProtocol[String(consensusProtocolValue)]?.label ?? (String(consensusProtocolValue)))}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Evm}
		>
			{#snippet Applicable(projection)}
				{@const evmContractsAccountsSections = [
					{
						id: 'evm-contracts-precompiles',
						label: 'Precompiles',
						description: 'Catalog precompiles active at the chain head according to the execution upgrade schedule.',
					},
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-contracts-verified',
									label: 'Verified contracts',
								},
							]
						:
							[]
					),
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-contracts-smart-accounts',
									label: 'Smart accounts',
								},
							]
						:
							[]
					),
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-contracts-bundlers',
									label: 'Bundlers',
								},
							]
						:
							[]
					),
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-contracts-paymasters',
									label: 'Paymasters',
								},
							]
						:
							[]
					),
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-contracts-user-operations',
									label: 'User operations',
								},
							]
						:
							[]
					),
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-contracts-factories',
									label: 'Factories',
								},
							]
						:
							[]
					),
				]}

				{#if evmContractsAccountsSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-contracts-accounts'}
						sectionIdPrefix={viewDomId}
						sections={evmContractsAccountsSections}
						data-card
						class='network-view-collapsible-contracts-accounts'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Contracts and accounts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionEvmContractsPrecompiles({ id, label, open })}
							<EvmContractsView
								selection={
									projection
										.$$precompiles({
											sources: [
												Source.Constants_Internal,
											],
											limit: 64,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsVerified({ id, label, open })}
							<EvmContractsView
								selection={
									projection
										.$$contracts({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsSmartAccounts({ id, label, open })}
							<Erc4337SmartAccountsView
								selection={
									projection
										.$$erc4337SmartAccounts({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsBundlers({ id, label, open })}
							<Erc4337BundlersView
								selection={
									projection
										.$$erc4337Bundlers({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsPaymasters({ id, label, open })}
							<Erc4337PaymastersView
								selection={
									projection
										.$$erc4337Paymasters({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsUserOperations({ id, label, open })}
							<EvmUserOperationsView
								selection={
									projection
										.$$userOperations({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsFactories({ id, label, open })}
							<Erc4337AccountFactoriesView
								selection={
									projection
										.$$erc4337AccountFactories({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Evm}
		>
			{#snippet Applicable(projection)}
				{@const evmAssetsNativeCoinResource = projection
				.$nativeCoin({
					sources: [
						Source.Constants_Internal,
					],
				})}

				{@const evmAssetsNativeInstanceResource = projection
				.$nativeCoinInstance({
					sources: [
						Source.Constants_Internal,
					],
				})}

				{@const evmAssetsSections = [
					{
						id: 'evm-assets-native-coin',
						label: 'Native coin',
						ownsSection: true,
					},
					{
						id: 'evm-assets-native-instance',
						label: 'Native coin instance',
						ownsSection: true,
					},
					{
						id: 'evm-assets-bridges',
						label: 'Bridges',
					},
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-assets-erc20-transfers',
									label: 'ERC-20 transfers',
								},
							]
						:
							[]
					),
					...(
						blockscoutRestSources.length > 0 ?
							[
								{
									id: 'evm-assets-nft-transfers',
									label: 'NFT transfers',
								},
							]
						:
							[]
					),
				]}

				{#if evmAssetsSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-assets'}
						sectionIdPrefix={viewDomId}
						sections={evmAssetsSections}
						data-card
						class='network-view-collapsible-assets'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet MarkerEvmAssetsNativeCoin(_context, Content)}
							<ResourceBoundary
								resource={evmAssetsNativeCoinResource}
							>
								{#snippet children(_resolved)}
									{#if _resolved != null}
									{@render Content()}
									{/if}
								{/snippet}

								{#snippet PendingContent()}
									{@render Content()}
								{/snippet}

								{#snippet FailedContent(_error, _retry)}
									{@render Content()}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionEvmAssetsNativeCoin({ id, label, open, active })}
							<ResourceBoundary
								resource={evmAssetsNativeCoinResource}
							>
								{#snippet children(coin)}
									{#if coin != null}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
																<article
																	id={`${id}-list`}
																	data-column-item="flexible"
																	data-card
																	data-scroll-container
																>
																	<CoinView
																		selection={select(EntityType.Coin, coin[EntityMetaKey.Selector], { sources: [
											Source.Constants_Internal,
										] })}
																		prefetched={coin}
																		layout={EntityLayout.SummaryInline}
																		open={false}
																	/>
																</article>
									</section>
									{/if}
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet MarkerEvmAssetsNativeInstance(_context, Content)}
							<ResourceBoundary
								resource={evmAssetsNativeInstanceResource}
							>
								{#snippet children(_resolved)}
									{#if _resolved != null}
									{@render Content()}
									{/if}
								{/snippet}

								{#snippet PendingContent()}
									{@render Content()}
								{/snippet}

								{#snippet FailedContent(_error, _retry)}
									{@render Content()}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionEvmAssetsNativeInstance({ id, label, open, active })}
							<ResourceBoundary
								resource={evmAssetsNativeInstanceResource}
							>
								{#snippet children(evmCoinInstance)}
									{#if evmCoinInstance != null}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
																<article
																	id={`${id}-list`}
																	data-column-item="flexible"
																	data-card
																	data-scroll-container
																>
																	<EvmCoinInstanceView
																		selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector], { sources: [
											Source.Constants_Internal,
										] })}
																		prefetched={evmCoinInstance}
																		layout={EntityLayout.SummaryInline}
																		open={false}
																	/>
																</article>
									</section>
									{/if}
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionEvmAssetsBridges({ id, label, open })}
							<EvmNetworkBridgesView
								selection={
									projection
										.$$bridges({
											sources: [
												Source.Chainlist_Rest,
												Source.EthereumLists_Rest,
												Source.Lifi_Rest,
											],
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmAssetsErc20Transfers({ id, label, open })}
							<EvmTokenTransfersView
								selection={
									projection
										.$$erc20TokenTransfers({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmAssetsNftTransfers({ id, label, open })}
							<EvmTokenTransfersView
								selection={
									projection
										.$$nftTokenTransfers({
											sources: blockscoutRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cosmos}
		>
			{#snippet Applicable(projection)}
				{@const cosmosConsensusBlockProductionSections = [
					...(
						cosmosSdkRestSources.length > 0 ?
							[
								{
									id: 'cosmos-consensus-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
					...(
						cosmosSdkRestSources.length > 0 ?
							[
								{
									id: 'cosmos-consensus-validators',
									label: 'Validators',
								},
							]
						:
							[]
					),
				]}

				{#if cosmosConsensusBlockProductionSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-consensus-block-production'}
						sectionIdPrefix={viewDomId}
						sections={cosmosConsensusBlockProductionSections}
						data-card
						class='network-view-collapsible-consensus'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and block production</HeadingComponent>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											CometBFT block production and validator state exposed by this Cosmos SDK network.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='Consensus and block production help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionCosmosConsensusBlocks({ id, label, open })}
							<CosmosBlocksView
								selection={
									projection
										.$$blocks({
											sources: cosmosSdkRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCosmosConsensusValidators({ id, label, open })}
							<CosmosValidatorsView
								selection={
									projection
										.$$validators({
											sources: cosmosSdkRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cosmos}
		>
			{#snippet Applicable(projection)}
				{@const cosmosContractsAccountsSections = [
					...(
						cosmosSdkRestSources.length > 0 ?
							[
								{
									id: 'cosmos-contracts-accounts-accounts',
									label: 'Accounts',
								},
							]
						:
							[]
					),
				]}

				{#if cosmosContractsAccountsSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-contracts-accounts'}
						sectionIdPrefix={viewDomId}
						sections={cosmosContractsAccountsSections}
						data-card
						class='network-view-collapsible-contracts-accounts'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Accounts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCosmosContractsAccountsAccounts({ id, label, open })}
							<CosmosAccountsView
								selection={
									projection
										.$$accounts({
											sources: cosmosSdkRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cosmos}
		>
			{#snippet Applicable(projection)}
				{@const cosmosGovernanceSections = [
					...(
						cosmosSdkRestSources.length > 0 ?
							[
								{
									id: 'cosmos-governance-proposals',
									label: 'Proposals',
								},
							]
						:
							[]
					),
				]}

				{#if cosmosGovernanceSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-governance'}
						sectionIdPrefix={viewDomId}
						sections={cosmosGovernanceSections}
						data-card
						class='network-view-collapsible-governance'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Governance</HeadingComponent>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											On-chain Cosmos SDK proposals and their current governance lifecycle.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='Governance help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionCosmosGovernanceProposals({ id, label, open })}
							<CosmosGovernanceProposalsView
								selection={
									projection
										.$$governanceProposals({
											sources: cosmosSdkRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cosmos}
		>
			{#snippet Applicable(projection)}
				{@const cosmosResourcesSections = [
					...(
						cosmosSdkRestSources.length > 0 ?
							[
								{
									id: 'cosmos-resources-endpoints',
									label: 'Endpoints',
									ownsSection: true,
								},
							]
						:
							[]
					),
				]}

				{#if cosmosResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-resources'}
						sectionIdPrefix={viewDomId}
						sections={cosmosResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCosmosResourcesEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={
									projection
										.restEndpoints({
											sources: cosmosSdkRestSources,
										})
								}
							>
								{#snippet children(restEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if restEndpointsField.values.length === 0}
												<p data-text="muted">REST endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each restEndpointsField.values as restEndpoint, restEndpointIndex (restEndpointIndex)}
													{@const urlValue = restEndpoint.url}
													{@const providerNameValue = restEndpoint.providerName}
													{@const transportTypeValue = restEndpoint.transportType}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	{#if urlValue != null}
																		{String(urlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{#if providerNameValue != null}
																		{String(providerNameValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{#if transportTypeValue != null}
																		{String(transportTypeValue)}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Polkadot}
		>
			{#snippet Applicable(projection)}
				{@const polkadotConsensusBlockProductionSections = [
					...(
						polkadotJsonRpcSources.length > 0 ?
							[
								{
									id: 'polkadot-consensus-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
					{
						id: 'polkadot-consensus-validators',
						label: 'Validators',
					},
				]}

				{#if polkadotConsensusBlockProductionSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-polkadot-consensus-block-production'}
						sectionIdPrefix={viewDomId}
						sections={polkadotConsensusBlockProductionSections}
						data-card
						class='network-view-collapsible-consensus'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and block production</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionPolkadotConsensusBlocks({ id, label, open })}
							<PolkadotBlocksView
								selection={
									projection
										.$$blocks({
											sources: polkadotJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionPolkadotConsensusValidators({ id, label, open })}
							<PolkadotValidatorsView
								selection={
									projection
										.$$validators({
											sources: [
												Source.SubstrateSidecar_Rest,
											],
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Polkadot}
		>
			{#snippet Applicable(projection)}
				{@const polkadotResourcesSections = [
					...(
						polkadotJsonRpcSources.length > 0 ?
							[
								{
									id: 'polkadot-resources-endpoints',
									label: 'Endpoints',
									ownsSection: true,
								},
							]
						:
							[]
					),
				]}

				{#if polkadotResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-polkadot-resources'}
						sectionIdPrefix={viewDomId}
						sections={polkadotResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionPolkadotResourcesEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={
									projection
										.rpcEndpoints({
											sources: polkadotJsonRpcSources,
										})
								}
							>
								{#snippet children(rpcEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if rpcEndpointsField.values.length === 0}
												<p data-text="muted">RPC endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each rpcEndpointsField.values as rpcEndpoint, rpcEndpointIndex (rpcEndpointIndex)}
													{@const urlValue = rpcEndpoint.url}
													{@const providerNameValue = rpcEndpoint.providerName}
													{@const transportTypeValue = rpcEndpoint.transportType}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>RPC</dt>
																<dd>
																	{#if urlValue != null}
																		{String(urlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{#if providerNameValue != null}
																		{String(providerNameValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{#if transportTypeValue != null}
																		{String(transportTypeValue)}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Solana}
		>
			{#snippet Applicable(projection)}
				{@const solanaExecutionSections = [
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-execution-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-execution-transactions',
									label: 'Transactions',
								},
							]
						:
							[]
					),
				]}

				{#if solanaExecutionSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-execution'}
						sectionIdPrefix={viewDomId}
						sections={solanaExecutionSections}
						data-card
						class='network-view-collapsible-execution'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Execution</HeadingComponent>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Recent slots, blocks, and transactions executed by the Solana runtime.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='Execution help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionSolanaExecutionBlocks({ id, label, open })}
							<SolanaBlocksView
								selection={
									projection
										.$$blocks({
											sources: solanaJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaExecutionTransactions({ id, label, open })}
							<SolanaTransactionsView
								selection={
									projection
										.$$transactions({
											sources: solanaJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Solana}
		>
			{#snippet Applicable(projection)}
				{@const solanaConsensusBlockProductionSections = [
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-consensus-validators',
									label: 'Validators',
								},
							]
						:
							[]
					),
				]}

				{#if solanaConsensusBlockProductionSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-consensus-block-production'}
						sectionIdPrefix={viewDomId}
						sections={solanaConsensusBlockProductionSections}
						data-card
						class='network-view-collapsible-consensus'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and block production</HeadingComponent>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Validator participation and block production for Solana's proof-of-history coordinated consensus.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='Consensus and block production help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionSolanaConsensusValidators({ id, label, open })}
							<SolanaValidatorsView
								selection={
									projection
										.$$validators({
											sources: solanaJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Solana}
		>
			{#snippet Applicable(projection)}
				{@const solanaContractsAccountsSections = [
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-contracts-accounts-accounts',
									label: 'Accounts',
								},
							]
						:
							[]
					),
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-contracts-accounts-programs',
									label: 'Programs',
								},
							]
						:
							[]
					),
				]}

				{#if solanaContractsAccountsSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-contracts-accounts'}
						sectionIdPrefix={viewDomId}
						sections={solanaContractsAccountsSections}
						data-card
						class='network-view-collapsible-contracts-accounts'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Contracts and accounts</HeadingComponent>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Executable programs and state-bearing accounts on the Solana virtual machine.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='Contracts and accounts help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionSolanaContractsAccountsAccounts({ id, label, open })}
							<SolanaAccountsView
								selection={
									projection
										.$$accounts({
											sources: solanaJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaContractsAccountsPrograms({ id, label, open })}
							<SolanaProgramsView
								selection={
									projection
										.$$programs({
											sources: solanaJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Solana}
		>
			{#snippet Applicable(projection)}
				{@const solanaAssetsSections = [
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-assets-token-accounts',
									label: 'Token accounts',
								},
							]
						:
							[]
					),
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-assets-token-mints',
									label: 'Token mints',
								},
							]
						:
							[]
					),
				]}

				{#if solanaAssetsSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-assets'}
						sectionIdPrefix={viewDomId}
						sections={solanaAssetsSections}
						data-card
						class='network-view-collapsible-assets'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSolanaAssetsTokenAccounts({ id, label, open })}
							<SolanaTokenAccountsView
								selection={
									projection
										.$$tokenAccounts({
											sources: solanaJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaAssetsTokenMints({ id, label, open })}
							<SolanaTokenMintsView
								selection={
									projection
										.$$tokenMints({
											sources: solanaJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Solana}
		>
			{#snippet Applicable(projection)}
				{@const solanaResourcesSections = [
					...(
						solanaJsonRpcSources.length > 0 ?
							[
								{
									id: 'solana-resources-endpoints',
									label: 'Endpoints',
									ownsSection: true,
								},
							]
						:
							[]
					),
				]}

				{#if solanaResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-resources'}
						sectionIdPrefix={viewDomId}
						sections={solanaResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSolanaResourcesEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={
									projection
										.rpcEndpoints({
											sources: solanaJsonRpcSources,
										})
								}
							>
								{#snippet children(rpcEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if rpcEndpointsField.values.length === 0}
												<p data-text="muted">RPC endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each rpcEndpointsField.values as rpcEndpoint, rpcEndpointIndex (rpcEndpointIndex)}
													{@const urlValue = rpcEndpoint.url}
													{@const providerNameValue = rpcEndpoint.providerName}
													{@const transportTypeValue = rpcEndpoint.transportType}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>RPC</dt>
																<dd>
																	{#if urlValue != null}
																		{String(urlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{#if providerNameValue != null}
																		{String(providerNameValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{#if transportTypeValue != null}
																		{String(transportTypeValue)}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Utxo}
		>
			{#snippet Applicable(projection)}
				{@const utxoChainActivitySections = [
					...(
						mempoolSpaceRestAndBlockchairRestSources.length > 0 ?
							[
								{
									id: 'utxo-consensus-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
					...(
						mempoolSpaceRestAndBlockchairRestSources.length > 0 ?
							[
								{
									id: 'utxo-consensus-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
				]}

				{#if utxoChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-utxo-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={utxoChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionUtxoConsensusObservations({ id, label, open })}
							<Network_TimestampsView
								selection={
									selection
										.$$timestamps({
											sources: mempoolSpaceRestAndBlockchairRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionUtxoConsensusBlocks({ id, label, open })}
							<UtxoBlocksView
								selection={
									projection
										.$$blocks({
											sources: mempoolSpaceRestAndBlockchairRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Utxo}
		>
			{#snippet Applicable(projection)}
				{@const utxoTransactionGraphUtxoExecutionMempoolSources = networkApplicableSources([
					Source.MempoolSpace_Rest,
				], pendingEntity)}

				{@const utxoTransactionGraphSections = [
					...(
						mempoolSpaceRestAndBlockchairRestSources.length > 0 ?
							[
								{
									id: 'utxo-execution-transactions',
									label: 'Transactions',
								},
							]
						:
							[]
					),
					...(
						utxoTransactionGraphUtxoExecutionMempoolSources.length > 0 ?
							[
								{
									id: 'utxo-execution-mempool',
									label: 'Mempool',
								},
							]
						:
							[]
					),
				]}

				{#if utxoTransactionGraphSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-utxo-transaction-graph'}
						sectionIdPrefix={viewDomId}
						sections={utxoTransactionGraphSections}
						data-card
						class='network-view-collapsible-transactions'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Transactions</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionUtxoExecutionTransactions({ id, label, open })}
							<UtxoTransactionsView
								selection={
									projection
										.$$transactions({
											sources: mempoolSpaceRestAndBlockchairRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionUtxoExecutionMempool({ id, label, open })}
							<UtxoTransactionsView
								selection={
									projection
										.$$transactions({
											sources: utxoTransactionGraphUtxoExecutionMempoolSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Zcash}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-zcash-shielded-protocol'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'zcash-shielded-pools',
								label: 'Shielded pools',
							},
						]
					}
					data-card
					class='network-view-collapsible-shielded-protocol'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Shielded protocol</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionZcashShieldedPools({ id, label, open })}
						<ZcashShieldedPoolsView
							selection={
								projection
									.$$shieldedPools({
										sources: [
											Source.Constants_Internal,
										],
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Bittensor}
		>
			{#snippet Applicable(projection)}
				{@const bittensorChainActivitySections = [
					...(
						bittensorJsonRpcSources.length > 0 ?
							[
								{
									id: 'bittensor-chain-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
					...(
						bittensorJsonRpcSources.length > 0 ?
							[
								{
									id: 'bittensor-chain-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
				]}

				{#if bittensorChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-bittensor-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={bittensorChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionBittensorChainObservations({ id, label, open })}
							<BittensorNetwork_TimestampsView
								selection={
									projection
										.$$timestamps({
											sources: bittensorJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionBittensorChainBlocks({ id, label, open })}
							<BittensorBlocksView
								selection={
									projection
										.$$blocks({
											sources: bittensorJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Bittensor}
		>
			{#snippet Applicable(projection)}
				{@const bittensorSubnetsSections = [
					...(
						bittensorJsonRpcSources.length > 0 ?
							[
								{
									id: 'bittensor-subnets-subnets',
									label: 'Subnets',
								},
							]
						:
							[]
					),
				]}

				{#if bittensorSubnetsSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-bittensor-subnets'}
						sectionIdPrefix={viewDomId}
						sections={bittensorSubnetsSections}
						data-card
						class='network-view-collapsible-subnets'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Subnets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionBittensorSubnetsSubnets({ id, label, open })}
							<BittensorSubnetsView
								selection={
									projection
										.$$subnets({
											sources: bittensorJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.ZeroG}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-zero-g-storage'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'zero-g-storage-observations',
								label: 'Observations',
							},
							{
								id: 'zero-g-storage-nodes',
								label: 'Storage nodes',
							},
							{
								id: 'zero-g-storage-data-blobs',
								label: 'Data blobs',
							},
							{
								id: 'zero-g-storage-log-entries',
								label: 'Storage log entries',
							},
						]
					}
					data-card
					class='network-view-collapsible-storage'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Storage</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionZeroGStorageObservations({ id, label, open })}
						<ZeroGNetwork_TimestampsView
							selection={
								projection
									.$$timestamps({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionZeroGStorageNodes({ id, label, open })}
						<ZeroGStorageNodesView
							selection={
								projection
									.$$storageNodes({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionZeroGStorageDataBlobs({ id, label, open })}
						<ZeroGDataBlobsView
							selection={
								projection
									.$$dataBlobs({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionZeroGStorageLogEntries({ id, label, open })}
						<ZeroGStorageLogEntriesView
							selection={
								projection
									.$$storageLogEntries({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Filecoin}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-filecoin-chain-activity'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'filecoin-chain-observations',
								label: 'Observations',
							},
							{
								id: 'filecoin-chain-tipsets',
								label: 'Tipsets',
							},
						]
					}
					data-card
					class='network-view-collapsible-chain-activity'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Chain activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionFilecoinChainObservations({ id, label, open })}
						<FilecoinNetwork_TimestampsView
							selection={
								projection
									.$$timestamps({
										sources: [
											Source.Lotus_JsonRpc,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionFilecoinChainTipsets({ id, label, open })}
						<FilecoinTipsetsView
							selection={
								projection
									.$$tipsets({
										sources: [
											Source.Lotus_JsonRpc,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Filecoin}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-filecoin-resources'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'filecoin-resources-endpoints',
								label: 'Endpoints',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-resources'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Resources</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionFilecoinResourcesEndpoints({ id, label, open, active })}
						<ResourceBoundary
							resource={projection.rpcEndpoints}
						>
							{#snippet children(rpcEndpointsField)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										{#if rpcEndpointsField.values.length === 0}
											<p data-text="muted">RPC endpoints are not listed for this network.</p>
										{/if}

										<ul data-column="gap-2" data-section-state="resolved-nonempty">
											{#each rpcEndpointsField.values as rpcEndpoint, rpcEndpointIndex (rpcEndpointIndex)}
												{@const urlValue = rpcEndpoint.url}
												{@const providerNameValue = rpcEndpoint.providerName}
												{@const transportTypeValue = rpcEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue != null}
																	{String(urlValue)}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue != null}
																	{String(providerNameValue)}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue != null}
																	{String(transportTypeValue)}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									</article>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Near}
		>
			{#snippet Applicable(projection)}
				{@const nearChainActivitySections = [
					...(
						nearRpcJsonRpcSources.length > 0 ?
							[
								{
									id: 'near-chain-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
					...(
						nearRpcJsonRpcSources.length > 0 ?
							[
								{
									id: 'near-chain-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
				]}

				{#if nearChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-near-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={nearChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionNearChainObservations({ id, label, open })}
							<NearNetwork_TimestampsView
								selection={
									projection
										.$$timestamps({
											sources: nearRpcJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionNearChainBlocks({ id, label, open })}
							<NearBlocksView
								selection={
									projection
										.$$blocks({
											sources: nearRpcJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Near}
		>
			{#snippet Applicable(projection)}
				{@const nearConsensusSections = [
					...(
						nearRpcJsonRpcSources.length > 0 ?
							[
								{
									id: 'near-consensus-validators',
									label: 'Validators',
								},
							]
						:
							[]
					),
				]}

				{#if nearConsensusSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-near-consensus'}
						sectionIdPrefix={viewDomId}
						sections={nearConsensusSections}
						data-card
						class='network-view-collapsible-consensus'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and validators</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionNearConsensusValidators({ id, label, open })}
							<NearValidatorsView
								selection={
									projection
										.$$validators({
											sources: nearRpcJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Near}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-near-resources'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'near-resources-endpoints',
								label: 'Endpoints',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-resources'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Resources</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionNearResourcesEndpoints({ id, label, open, active })}
						<ResourceBoundary
							resource={projection.rpcEndpoints}
						>
							{#snippet children(rpcEndpointsField)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										{#if rpcEndpointsField.values.length === 0}
											<p data-text="muted">RPC endpoints are not listed for this network.</p>
										{/if}

										<ul data-column="gap-2" data-section-state="resolved-nonempty">
											{#each rpcEndpointsField.values as rpcEndpoint, rpcEndpointIndex (rpcEndpointIndex)}
												{@const urlValue = rpcEndpoint.url}
												{@const providerNameValue = rpcEndpoint.providerName}
												{@const transportTypeValue = rpcEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue != null}
																	{String(urlValue)}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue != null}
																	{String(providerNameValue)}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue != null}
																	{String(transportTypeValue)}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									</article>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Monero}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-monero-chain-activity'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'monero-chain-observations',
								label: 'Observations',
							},
							{
								id: 'monero-chain-blocks',
								label: 'Blocks',
							},
						]
					}
					data-card
					class='network-view-collapsible-chain-activity'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Chain activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionMoneroChainObservations({ id, label, open })}
						<MoneroNetwork_TimestampsView
							selection={
								projection
									.$$timestamps({
										sources: [
											Source.MoneroDaemonRpc_JsonRpc,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionMoneroChainBlocks({ id, label, open })}
						<MoneroBlocksView
							selection={
								projection
									.$$blocks({
										sources: [
											Source.MoneroDaemonRpc_JsonRpc,
										],
										limit: 16,
									})
							}
							CollapsibleProps={{ canToggle: false }}
							collapsible={false}
							data-column-item="flexible"
							data-card
							data-scroll-container
							open={open}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Monero}
		>
			{#snippet Applicable(projection)}
				<CollapsibleTabs
					id={viewDomId + '-carousel-monero-resources'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'monero-resources-endpoints',
								label: 'Endpoints',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-resources'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Resources</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionMoneroResourcesEndpoints({ id, label, open, active })}
						<ResourceBoundary
							resource={projection.rpcEndpoints}
						>
							{#snippet children(rpcEndpointsField)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										{#if rpcEndpointsField.values.length === 0}
											<p data-text="muted">RPC endpoints are not listed for this network.</p>
										{/if}

										<ul data-column="gap-2" data-section-state="resolved-nonempty">
											{#each rpcEndpointsField.values as rpcEndpoint, rpcEndpointIndex (rpcEndpointIndex)}
												{@const urlValue = rpcEndpoint.url}
												{@const providerNameValue = rpcEndpoint.providerName}
												{@const transportTypeValue = rpcEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue != null}
																	{String(urlValue)}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue != null}
																	{String(providerNameValue)}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue != null}
																	{String(transportTypeValue)}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									</article>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Lightning}
		>
			{#snippet Applicable(projection)}
				{@const lightningNetworkGraphLightningNetworkObservationsSources = networkApplicableSources([
					Source.LightningMempoolSpace_Rest,
				], pendingEntity)}

				{@const lightningNetworkGraphLightningNetworkNodesSources = networkApplicableSources([
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				], pendingEntity)}

				{@const lightningNetworkGraphSections = [
					...(
						lightningNetworkGraphLightningNetworkObservationsSources.length > 0 ?
							[
								{
									id: 'lightning-network-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
					...(
						lightningNetworkGraphLightningNetworkNodesSources.length > 0 ?
							[
								{
									id: 'lightning-network-nodes',
									label: 'Nodes',
								},
							]
						:
							[]
					),
				]}

				{#if lightningNetworkGraphSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-lightning-network-graph'}
						sectionIdPrefix={viewDomId}
						sections={lightningNetworkGraphSections}
						data-card
						class='network-view-collapsible-network-graph'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Network graph</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionLightningNetworkObservations({ id, label, open })}
							<LightningNetwork_TimestampsView
								selection={
									projection
										.$$timestamps({
											sources: lightningNetworkGraphLightningNetworkObservationsSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionLightningNetworkNodes({ id, label, open })}
							<LightningNodesView
								selection={
									projection
										.$$nodes({
											sources: lightningNetworkGraphLightningNetworkNodesSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cardano}
		>
			{#snippet Applicable(projection)}
				{@const cardanoChainActivitySections = [
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-chain-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-chain-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-chain-transactions',
									label: 'Transactions',
								},
							]
						:
							[]
					),
				]}

				{#if cardanoChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={cardanoChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoChainObservations({ id, label, open })}
							<CardanoNetwork_TimestampsView
								selection={
									projection
										.$$timestamps({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoChainBlocks({ id, label, open })}
							<CardanoBlocksView
								selection={
									projection
										.$$blocks({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoChainTransactions({ id, label, open })}
							<CardanoTransactionsView
								selection={
									projection
										.$$transactions({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cardano}
		>
			{#snippet Applicable(projection)}
				{@const cardanoStakeDelegationSections = [
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-stake-pools',
									label: 'Stake pools',
								},
							]
						:
							[]
					),
				]}

				{#if cardanoStakeDelegationSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-stake-delegation'}
						sectionIdPrefix={viewDomId}
						sections={cardanoStakeDelegationSections}
						data-card
						class='network-view-collapsible-stake-delegation'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Stake and delegation</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoStakePools({ id, label, open })}
							<CardanoStakePoolsView
								selection={
									projection
										.$$stakePools({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cardano}
		>
			{#snippet Applicable(projection)}
				{@const cardanoGovernanceSections = [
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-governance-dreps',
									label: 'DReps',
								},
							]
						:
							[]
					),
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-governance-proposals',
									label: 'Proposals',
								},
							]
						:
							[]
					),
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-governance-committee',
									label: 'Committee epochs',
								},
							]
						:
							[]
					),
				]}

				{#if cardanoGovernanceSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-governance'}
						sectionIdPrefix={viewDomId}
						sections={cardanoGovernanceSections}
						data-card
						class='network-view-collapsible-governance'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Governance</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoGovernanceDreps({ id, label, open })}
							<CardanoDRepsView
								selection={
									projection
										.$$dReps({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoGovernanceProposals({ id, label, open })}
							<CardanoGovernanceProposalsView
								selection={
									projection
										.$$governanceProposals({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoGovernanceCommittee({ id, label, open })}
							<CardanoCommittee_EpochsView
								selection={
									projection
										.$$committeeEpochs({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cardano}
		>
			{#snippet Applicable(projection)}
				{@const cardanoAssetsProtocolSections = [
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-assets-native',
									label: 'Native assets',
								},
							]
						:
							[]
					),
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-protocol-parameters',
									label: 'Protocol parameters',
								},
							]
						:
							[]
					),
				]}

				{#if cardanoAssetsProtocolSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-assets-protocol'}
						sectionIdPrefix={viewDomId}
						sections={cardanoAssetsProtocolSections}
						data-card
						class='network-view-collapsible-assets'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets and protocol</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoAssetsNative({ id, label, open })}
							<CardanoNativeAssetsView
								selection={
									projection
										.$$assets({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoProtocolParameters({ id, label, open })}
							<CardanoProtocolParameters_EpochsView
								selection={
									projection
										.$$protocolParameterEpochs({
											sources: cardanoKoiosRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Cardano}
		>
			{#snippet Applicable(projection)}
				{@const cardanoResourcesSections = [
					...(
						cardanoKoiosRestSources.length > 0 ?
							[
								{
									id: 'cardano-resources-endpoints',
									label: 'Endpoints',
									ownsSection: true,
								},
							]
						:
							[]
					),
				]}

				{#if cardanoResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-resources'}
						sectionIdPrefix={viewDomId}
						sections={cardanoResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoResourcesEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={
									projection
										.restEndpoints({
											sources: cardanoKoiosRestSources,
										})
								}
							>
								{#snippet children(restEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if restEndpointsField.values.length === 0}
												<p data-text="muted">REST endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each restEndpointsField.values as restEndpoint, restEndpointIndex (restEndpointIndex)}
													{@const urlValue = restEndpoint.url}
													{@const providerNameValue = restEndpoint.providerName}
													{@const transportTypeValue = restEndpoint.transportType}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	{#if urlValue != null}
																		{String(urlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{#if providerNameValue != null}
																		{String(providerNameValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{#if transportTypeValue != null}
																		{String(transportTypeValue)}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Tron}
		>
			{#snippet Applicable(projection)}
				{@const tronChainActivitySections = [
					...(
						tronGridRestSources.length > 0 ?
							[
								{
									id: 'tron-chain-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
					...(
						tronGridRestSources.length > 0 ?
							[
								{
									id: 'tron-chain-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
					...(
						tronGridRestSources.length > 0 ?
							[
								{
									id: 'tron-chain-witnesses',
									label: 'Witnesses',
								},
							]
						:
							[]
					),
				]}

				{#if tronChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-tron-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={tronChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTronChainObservations({ id, label, open })}
							<TronNetwork_TimestampsView
								selection={
									projection
										.$$timestamps({
											sources: tronGridRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTronChainBlocks({ id, label, open })}
							<TronBlocksView
								selection={
									projection
										.$$blocks({
											sources: tronGridRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTronChainWitnesses({ id, label, open })}
							<TronWitnessesView
								selection={
									projection
										.$$witnesses({
											sources: tronGridRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Tron}
		>
			{#snippet Applicable(projection)}
				{@const tronResourcesSections = [
					...(
						tronGridRestSources.length > 0 ?
							[
								{
									id: 'tron-resources-endpoints',
									label: 'Endpoints',
									ownsSection: true,
								},
							]
						:
							[]
					),
				]}

				{#if tronResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-tron-resources'}
						sectionIdPrefix={viewDomId}
						sections={tronResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTronResourcesEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={
									projection
										.restEndpoints({
											sources: tronGridRestSources,
										})
								}
							>
								{#snippet children(restEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if restEndpointsField.values.length === 0}
												<p data-text="muted">REST endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each restEndpointsField.values as restEndpoint, restEndpointIndex (restEndpointIndex)}
													{@const urlValue = restEndpoint.url}
													{@const providerNameValue = restEndpoint.providerName}
													{@const transportTypeValue = restEndpoint.transportType}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	{#if urlValue != null}
																		{String(urlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{#if providerNameValue != null}
																		{String(providerNameValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{#if transportTypeValue != null}
																		{String(transportTypeValue)}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Ton}
		>
			{#snippet Applicable(projection)}
				{@const tonChainActivityTonChainObservationsSources = networkApplicableSources([
					Source.TonApi_Rest,
				], pendingEntity)}

				{@const tonChainActivitySections = [
					...(
						tonChainActivityTonChainObservationsSources.length > 0 ?
							[
								{
									id: 'ton-chain-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
				]}

				{#if tonChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-ton-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={tonChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTonChainObservations({ id, label, open })}
							<TonNetwork_TimestampsView
								selection={
									projection
										.$$timestamps({
											sources: tonChainActivityTonChainObservationsSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Xrpl}
		>
			{#snippet Applicable(projection)}
				{@const xrplChainActivitySections = [
					...(
						xrplRippledSources.length > 0 ?
							[
								{
									id: 'xrpl-chain-ledgers',
									label: 'Ledgers',
								},
							]
						:
							[]
					),
					...(
						xrplRippledSources.length > 0 ?
							[
								{
									id: 'xrpl-chain-transactions',
									label: 'Transactions',
								},
							]
						:
							[]
					),
				]}

				{#if xrplChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-xrpl-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={xrplChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionXrplChainLedgers({ id, label, open })}
							<XrplLedgersView
								selection={
									projection
										.$$ledgers({
											sources: xrplRippledSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No XRPL ledgers.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionXrplChainTransactions({ id, label, open })}
							<XrplTransactionsView
								selection={
									projection
										.$$transactions({
											sources: xrplRippledSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No XRPL transactions.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Xrpl}
		>
			{#snippet Applicable(projection)}
				{@const xrplLedgerStateSections = [
					...(
						xrplRippledSources.length > 0 ?
							[
								{
									id: 'xrpl-ledger-state-accounts',
									label: 'Accounts',
								},
							]
						:
							[]
					),
					...(
						xrplRippledSources.length > 0 ?
							[
								{
									id: 'xrpl-ledger-state-entries',
									label: 'Ledger entries',
								},
							]
						:
							[]
					),
				]}

				{#if xrplLedgerStateSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-xrpl-ledger-state'}
						sectionIdPrefix={viewDomId}
						sections={xrplLedgerStateSections}
						data-card
						class='network-view-collapsible-ledger-state'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Ledger state</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionXrplLedgerStateAccounts({ id, label, open })}
							<XrplAccountsView
								selection={
									projection
										.$$accounts({
											sources: xrplRippledSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No XRPL accounts.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionXrplLedgerStateEntries({ id, label, open })}
							<XrplLedgerEntriesView
								selection={
									projection
										.$$ledgerEntries({
											sources: xrplRippledSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No XRPL ledger entries.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Xrpl}
		>
			{#snippet Applicable(projection)}
				{@const xrplProtocolLiquiditySections = [
					...(
						xrplRippledSources.length > 0 ?
							[
								{
									id: 'xrpl-protocol-amendments',
									label: 'Amendments',
								},
							]
						:
							[]
					),
					...(
						xrplRippledSources.length > 0 ?
							[
								{
									id: 'xrpl-liquidity-amms',
									label: 'AMMs',
								},
							]
						:
							[]
					),
				]}

				{#if xrplProtocolLiquiditySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-xrpl-protocol-liquidity'}
						sectionIdPrefix={viewDomId}
						sections={xrplProtocolLiquiditySections}
						data-card
						class='network-view-collapsible-protocol-liquidity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Protocol and liquidity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionXrplProtocolAmendments({ id, label, open })}
							<XrplAmendmentsView
								selection={
									projection
										.$$amendments({
											sources: xrplRippledSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No XRPL amendments.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionXrplLiquidityAmms({ id, label, open })}
							<XrplAmmsView
								selection={
									projection
										.$$amms({
											sources: xrplRippledSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No XRPL AMMs.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Hedera}
		>
			{#snippet Applicable(projection)}
				{@const hederaChainActivitySections = [
					...(
						hederaMirrorNodeRestSources.length > 0 ?
							[
								{
									id: 'hedera-chain-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
				]}

				{#if hederaChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hedera-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={hederaChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHederaChainBlocks({ id, label, open })}
							<HederaBlocksView
								selection={
									projection
										.$$blocks({
											sources: hederaMirrorNodeRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No Hedera blocks.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Hedera}
		>
			{#snippet Applicable(projection)}
				{@const hederaAccountsTokensSections = [
					...(
						hederaMirrorNodeRestSources.length > 0 ?
							[
								{
									id: 'hedera-accounts',
									label: 'Accounts',
								},
							]
						:
							[]
					),
				]}

				{#if hederaAccountsTokensSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hedera-accounts-tokens'}
						sectionIdPrefix={viewDomId}
						sections={hederaAccountsTokensSections}
						data-card
						class='network-view-collapsible-accounts-tokens'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Accounts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHederaAccounts({ id, label, open })}
							<HederaAccountsView
								selection={
									projection
										.$$accounts({
											sources: hederaMirrorNodeRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No Hedera accounts.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Hyperliquid}
		>
			{#snippet Applicable(projection)}
				{@const hyperliquidChainActivityHyperliquidChainObservationsSources = networkApplicableSources([
					Source.Hyperliquid_Rest,
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)}

				{@const hyperliquidChainActivitySections = [
					...(
						hyperliquidChainActivityHyperliquidChainObservationsSources.length > 0 ?
							[
								{
									id: 'hyperliquid-chain-observations',
									label: 'Observations',
								},
							]
						:
							[]
					),
					...(
						hyperliquidJsonRpcSources.length > 0 ?
							[
								{
									id: 'hyperliquid-chain-blocks',
									label: 'Blocks',
								},
							]
						:
							[]
					),
					...(
						hyperliquidJsonRpcSources.length > 0 ?
							[
								{
									id: 'hyperliquid-chain-transactions',
									label: 'Transactions',
								},
							]
						:
							[]
					),
				]}

				{#if hyperliquidChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={hyperliquidChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidChainObservations({ id, label, open })}
							<HyperliquidNetwork_TimestampsView
								selection={
									projection
										.$$timestamps({
											sources: hyperliquidChainActivityHyperliquidChainObservationsSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidChainBlocks({ id, label, open })}
							<HyperliquidBlocksView
								selection={
									projection
										.$$blocks({
											sources: hyperliquidJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidChainTransactions({ id, label, open })}
							<HyperliquidTransactionsView
								selection={
									projection
										.$$transactions({
											sources: hyperliquidJsonRpcSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Hyperliquid}
		>
			{#snippet Applicable(projection)}
				{@const hyperliquidConsensusSections = [
					...(
						hyperliquidRestSources.length > 0 ?
							[
								{
									id: 'hyperliquid-consensus-validators',
									label: 'Validators',
								},
							]
						:
							[]
					),
				]}

				{#if hyperliquidConsensusSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-consensus'}
						sectionIdPrefix={viewDomId}
						sections={hyperliquidConsensusSections}
						data-card
						class='network-view-collapsible-consensus'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and validators</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidConsensusValidators({ id, label, open })}
							<HyperliquidValidatorsView
								selection={
									projection
										.$$validators({
											sources: hyperliquidRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Hyperliquid}
		>
			{#snippet Applicable(projection)}
				{@const hyperliquidMarketsSections = [
					...(
						hyperliquidRestSources.length > 0 ?
							[
								{
									id: 'hyperliquid-markets-perps',
									label: 'Perps',
								},
							]
						:
							[]
					),
					...(
						hyperliquidRestSources.length > 0 ?
							[
								{
									id: 'hyperliquid-markets-spot-assets',
									label: 'Spot assets',
								},
							]
						:
							[]
					),
				]}

				{#if hyperliquidMarketsSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-markets'}
						sectionIdPrefix={viewDomId}
						sections={hyperliquidMarketsSections}
						data-card
						class='network-view-collapsible-markets'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Markets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidMarketsPerps({ id, label, open })}
							<HyperliquidPerpMarketsView
								selection={
									projection
										.$$perpMarkets({
											sources: hyperliquidRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsSpotAssets({ id, label, open })}
							<HyperliquidSpotAssetsView
								selection={
									projection
										.$$spotAssets({
											sources: hyperliquidRestSources,
											limit: 16,
										})
								}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Hyperliquid}
		>
			{#snippet Applicable(projection)}
				{@const hyperliquidResourcesSections = [
					...(
						hyperliquidJsonRpcSources.length > 0 ?
							[
								{
									id: 'hyperliquid-resources-rpc-endpoints',
									label: 'RPC endpoints',
									ownsSection: true,
								},
							]
						:
							[]
					),
					...(
						hyperliquidRestSources.length > 0 ?
							[
								{
									id: 'hyperliquid-resources-rest-endpoints',
									label: 'REST endpoints',
									ownsSection: true,
								},
							]
						:
							[]
					),
				]}

				{#if hyperliquidResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-resources'}
						sectionIdPrefix={viewDomId}
						sections={hyperliquidResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidResourcesRpcEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={
									projection
										.rpcEndpoints({
											sources: hyperliquidJsonRpcSources,
										})
								}
							>
								{#snippet children(rpcEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if rpcEndpointsField.values.length === 0}
												<p data-text="muted">RPC endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each rpcEndpointsField.values as rpcEndpoint, rpcEndpointIndex (rpcEndpointIndex)}
													{@const urlValue = rpcEndpoint.url}
													{@const providerNameValue = rpcEndpoint.providerName}
													{@const transportTypeValue = rpcEndpoint.transportType}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>RPC</dt>
																<dd>
																	{#if urlValue != null}
																		{String(urlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{#if providerNameValue != null}
																		{String(providerNameValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{#if transportTypeValue != null}
																		{String(transportTypeValue)}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionHyperliquidResourcesRestEndpoints({ id, label, open, active })}
							<ResourceBoundary
								resource={
									projection
										.restEndpoints({
											sources: hyperliquidRestSources,
										})
								}
							>
								{#snippet children(restEndpointsField)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<article
											id={`${id}-list`}
											data-column-item="flexible"
											data-card
											data-scroll-container
										>
											{#if restEndpointsField.values.length === 0}
												<p data-text="muted">REST endpoints are not listed for this network.</p>
											{/if}

											<ul data-column="gap-2" data-section-state="resolved-nonempty">
												{#each restEndpointsField.values as restEndpoint, restEndpointIndex (restEndpointIndex)}
													{@const urlValue = restEndpoint.url}
													{@const providerNameValue = restEndpoint.providerName}
													{@const transportTypeValue = restEndpoint.transportType}
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	{#if urlValue != null}
																		{String(urlValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{#if providerNameValue != null}
																		{String(providerNameValue)}
																	{/if}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{#if transportTypeValue != null}
																		{String(transportTypeValue)}
																	{/if}
																</dd>
															</div>
														</dl>
													</li>
												{/each}
											</ul>
										</article>
									</section>
								{/snippet}

								{#snippet Pending()}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
										</article>
									</section>
								{/snippet}

								{#snippet Failed(_error, _retry)}
									<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
										<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
											<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
										</article>
									</section>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
