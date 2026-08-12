<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { networkApplicableSources } from '$/sources/index.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
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

	const networkLatestResource1 = $derived(
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
	)
	const networkLatestResource2 = $derived(
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
	)
	const networkLatestResource3 = $derived(
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
	)
	const networkLatestResource4 = $derived(
		selection.Evm
			.$nativeCoin({
				sources: [
					Source.Constants_Internal,
				],
			})
	)
	const networkLatestResource5 = $derived(
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
	)
	const networkLatestResource6 = $derived(
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
	)
	const networkLatestResource7 = $derived(
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
	)

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
			}
		})()
	)
	const blockscoutRestSources = $derived(
		networkApplicableSources([
			Source.Blockscout_Rest,
		], pendingEntity)
	)

	const voltaireJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Voltaire_JsonRpc,
		], pendingEntity)
	)

	const beaconRestSources = $derived(
		networkApplicableSources([
			Source.Beacon_Rest,
		], pendingEntity)
	)

	const cometBftRestAndCosmosSdkRestAndMintscanSources = $derived(
		networkApplicableSources([
			Source.CometBft_Rest,
			Source.CosmosSdk_Rest,
			Source.Mintscan,
		], pendingEntity)
	)

	const cosmosSdkRestSources = $derived(
		networkApplicableSources([
			Source.CosmosSdk_Rest,
		], pendingEntity)
	)

	const solanaJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Solana_JsonRpc,
		], pendingEntity)
	)

	const blockchairRestAndEsploraRestAndMempoolSpaceRestSources = $derived(
		networkApplicableSources([
			Source.Blockchair_Rest,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		], pendingEntity)
	)

	const bittensorJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Bittensor_JsonRpc,
		], pendingEntity)
	)

	const celeniumRestAndCelestiaNodeSources = $derived(
		networkApplicableSources([
			Source.Celenium_Rest,
			Source.CelestiaNode,
		], pendingEntity)
	)

	const availSources = $derived(
		networkApplicableSources([
			Source.Avail,
		], pendingEntity)
	)

	const arweaveGraphqlAndArweaveRestSources = $derived(
		networkApplicableSources([
			Source.Arweave_Graphql,
			Source.Arweave_Rest,
		], pendingEntity)
	)

	const arweaveGraphqlSources = $derived(
		networkApplicableSources([
			Source.Arweave_Graphql,
		], pendingEntity)
	)

	const avalanchePlatformVmJsonRpcSources = $derived(
		networkApplicableSources([
			Source.AvalanchePlatformVm_JsonRpc,
		], pendingEntity)
	)

	const suiSources = $derived(
		networkApplicableSources([
			Source.Sui,
		], pendingEntity)
	)

	const nearRpcJsonRpcSources = $derived(
		networkApplicableSources([
			Source.NearRpc_JsonRpc,
		], pendingEntity)
	)

	const blockfrostRestAndCardanoKoiosRestAndOgmiosJsonRpcSources = $derived(
		networkApplicableSources([
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
			Source.Ogmios_JsonRpc,
		], pendingEntity)
	)

	const blockfrostRestAndCardanoKoiosRestSources = $derived(
		networkApplicableSources([
			Source.Blockfrost_Rest,
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

	const hyperliquidSources = $derived(
		networkApplicableSources([
			Source.Hyperliquid,
		], pendingEntity)
	)


	const network = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
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
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
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
	import NetworkEndpointObservation_TimestampsView from '$/views/NetworkEndpointObservation_TimestampsView.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import DydxChainNetworkView from '$/views/DydxChainNetworkView.svelte'
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
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import EvmNetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import AaveMarketsView from '$/views/AaveMarketsView.svelte'
	import BalancerPoolsView from '$/views/BalancerPoolsView.svelte'
	import BalancerGaugesView from '$/views/BalancerGaugesView.svelte'
	import CompoundCometsView from '$/views/CompoundCometsView.svelte'
	import CurvePoolsView from '$/views/CurvePoolsView.svelte'
	import CurveLendingVaultsView from '$/views/CurveLendingVaultsView.svelte'
	import EulerEvkVaultsView from '$/views/EulerEvkVaultsView.svelte'
	import GmxMarketsView from '$/views/GmxMarketsView.svelte'
	import MorphoMarketsView from '$/views/MorphoMarketsView.svelte'
	import MorphoVaultsView from '$/views/MorphoVaultsView.svelte'
	import PendleMarketsView from '$/views/PendleMarketsView.svelte'
	import Network_TimestampsView from '$/views/Network_TimestampsView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import CosmosValidatorsView from '$/views/CosmosValidatorsView.svelte'
	import CosmosAccountsView from '$/views/CosmosAccountsView.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import IbcClientsView from '$/views/IbcClientsView.svelte'
	import IbcConnectionsView from '$/views/IbcConnectionsView.svelte'
	import OsmosisPoolsView from '$/views/OsmosisPoolsView.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
	import PolkadotValidatorsView from '$/views/PolkadotValidatorsView.svelte'
	import PolkadotReferendumsView from '$/views/PolkadotReferendumsView.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
	import SolanaProgramsView from '$/views/SolanaProgramsView.svelte'
	import SolanaTokenAccountsView from '$/views/SolanaTokenAccountsView.svelte'
	import SolanaTokenMintsView from '$/views/SolanaTokenMintsView.svelte'
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
	import CelestiaNetwork_TimestampsView from '$/views/CelestiaNetwork_TimestampsView.svelte'
	import CelestiaBlocksView from '$/views/CelestiaBlocksView.svelte'
	import CelestiaNamespacesView from '$/views/CelestiaNamespacesView.svelte'
	import CelestiaBlobsView from '$/views/CelestiaBlobsView.svelte'
	import AvailNetwork_TimestampsView from '$/views/AvailNetwork_TimestampsView.svelte'
	import AvailBlocksView from '$/views/AvailBlocksView.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import FilecoinDealsView from '$/views/FilecoinDealsView.svelte'
	import ArweaveBlocksView from '$/views/ArweaveBlocksView.svelte'
	import ArweaveTransactionsView from '$/views/ArweaveTransactionsView.svelte'
	import ArweaveResourcesView from '$/views/ArweaveResourcesView.svelte'
	import AvalanchePChainBlocksView from '$/views/AvalanchePChainBlocksView.svelte'
	import AvalancheSubnetsView from '$/views/AvalancheSubnetsView.svelte'
	import SuiNetwork_TimestampsView from '$/views/SuiNetwork_TimestampsView.svelte'
	import SuiCheckpointsView from '$/views/SuiCheckpointsView.svelte'
	import SuiTransactionsView from '$/views/SuiTransactionsView.svelte'
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
	import HyperliquidSpotPairsView from '$/views/HyperliquidSpotPairsView.svelte'
	import HyperliquidVaultsView from '$/views/HyperliquidVaultsView.svelte'
	import HyperliquidBorrowLendReservesView from '$/views/HyperliquidBorrowLendReservesView.svelte'
	import SpecificationProposalView from '$/views/SpecificationProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
				{
					network: (
						'caip2' in selection.entitySelector ?
							caip2StringFromValue(selection.entitySelector.caip2)
						:
							selection.entitySelector.slug
					),
				}
			)
		:
			href ?? undefined
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
				{@const caip2 = entity.caip2}
				{#if caip2 != null}
					<TruncatedValue value={`${caip2.namespace}:${caip2.reference}`} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl class='network-summary-head' data-column-item="center">
			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					<div id={viewDomId + '-latest-summary-head-upgrade'}>
						<dt>Upgrade</dt>
						<dd>
							<ResourceBoundary
								resource={networkLatestResource1}
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
										/>
									{:else}
										<p data-text="muted" data-section-state="resolved-empty">No upgrade available.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div id={viewDomId + '-latest-summary-head-block'}>
						<dt>Block</dt>
						<dd>
							<ResourceBoundary
								resource={networkLatestResource2}
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
										/>
									{:else}
										<p data-text="muted" data-section-state="resolved-empty">No block available.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div id={viewDomId + '-latest-summary-head-fee-market'}>
						<dt>Fee market</dt>
						<dd>
							<ResourceBoundary
								resource={networkLatestResource3}
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
										/>
									{:else}
										<p data-text="muted" data-section-state="resolved-empty">No fee market available.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div id={viewDomId + '-latest-summary-head-native-price'}>
						<dt>Native price</dt>
						<dd>
							<ResourceBoundary
								resource={networkLatestResource4}
							>
								{#snippet children(coin)}
									{#if coin != null}
										{@const coinSelector = coin[EntityMetaKey.Selector]}
										<CoinView
											selection={
												select(EntityType.Coin, coinSelector, {
													sources: [
														Source.Constants_Internal,
													],
												})
											}
											prefetched={{ ...coinSelector, ...coin }}
											layout={EntityLayout.Value}
										/>

										<ResourceBoundary
											resource={
												select(EntityType.Coin, coin[EntityMetaKey.Selector], {
													fields: {
														$$marketsWithCoinAsBase: {
															sources: [
																Source.Constants_Internal,
															],
															limit: 1,
														},
													},
												})
											}
										>
											{#snippet children(nativeCoinWithUsdMarket)}
												{@const nativeCoinUsdMarket = nativeCoinWithUsdMarket.$$marketsWithCoinAsBase.values[0]}
												{#if nativeCoinUsdMarket != null}
													<ResourceBoundary
														resource={
															select(EntityType.MarketPrice, {
																$market: nativeCoinUsdMarket[EntityMetaKey.Selector],
															}, {
																fields: {
																	$$quotes: {
																		sources: [
																			Source.Coingecko_Rest,
																		],
																		fields: {
																			price: true,
																		},
																		orderBy: [
																			[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
																		],
																		limit: 1,
																	},
																},
															})
														}
													>
														{#snippet children(nativeCoinUsdMarketPrice)}
															{@const nativeCoinUsdQuote = nativeCoinUsdMarketPrice.$$quotes.values[0]}
															{#if nativeCoinUsdQuote != null}
																<Market_TimestampView
																	selection={select(EntityType.Market_Timestamp, nativeCoinUsdQuote[EntityMetaKey.Selector], {
																		sources: [
																			Source.Coingecko_Rest,
																		],
																	})}
																	prefetched={{ ...nativeCoinUsdQuote[EntityMetaKey.Selector], ...nativeCoinUsdQuote }}
																	layout={EntityLayout.Value}
																/>
															{:else}
																<p data-text="muted" data-section-state="resolved-empty">No native price available.</p>
															{/if}
														{/snippet}
													</ResourceBoundary>
												{:else}
													<p data-text="muted" data-section-state="resolved-empty">No native USD market available.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{:else}
										<p data-text="muted" data-section-state="resolved-empty">No native price available.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div id={viewDomId + '-latest-summary-head-mempool'}>
						<dt>Mempool</dt>
						<dd>
							<ResourceBoundary
								resource={networkLatestResource5}
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
										/>
									{:else}
										<p data-text="muted" data-section-state="resolved-empty">No mempool available.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ProjectionBoundary
						resource={projection.EthereumBeacon}
					>
						{#snippet Applicable(projection)}
							<div id={viewDomId + '-latest-summary-head-epoch'}>
								<dt>Epoch</dt>
								<dd>
									<ResourceBoundary
										resource={networkLatestResource6}
									>
										{#snippet children(beaconEpochs)}
											{@const beaconEpoch = beaconEpochs.values[0]}
											{#if beaconEpoch != null}
												<BeaconEpochView
													selection={
														select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector], {
															sources: [
																Source.Beacon_Rest,
															],
														})
													}
													layout={EntityLayout.Value}
												/>
											{:else}
												<p data-text="muted" data-section-state="resolved-empty">No epoch available.</p>
											{/if}
										{/snippet}
									</ResourceBoundary>
								</dd>
							</div>

							<div id={viewDomId + '-latest-summary-head-slot'}>
								<dt>Slot</dt>
								<dd>
									<ResourceBoundary
										resource={networkLatestResource7}
									>
										{#snippet children(beaconSlots)}
											{@const beaconSlot = beaconSlots.values[0]}
											{#if beaconSlot != null}
												<BeaconSlotView
													selection={
														select(EntityType.BeaconSlot, beaconSlot[EntityMetaKey.Selector], {
															sources: [
																Source.Beacon_Rest,
															],
														})
													}
													layout={EntityLayout.Value}
												/>
											{:else}
												<p data-text="muted" data-section-state="resolved-empty">No slot available.</p>
											{/if}
										{/snippet}
									</ResourceBoundary>
								</dd>
							</div>
						{/snippet}
					</ProjectionBoundary>
				{/snippet}
			</ProjectionBoundary>
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
						{@const networkStackInitial = untrack(() => networkStack)}
						<div>
							<dt>Network stack</dt>
							<dd>
								<NetworkStackView
									selection={select(EntityType.NetworkStack, (networkStack ?? networkStackInitial)[EntityMetaKey.Selector])}
									prefetched={networkStack ?? networkStackInitial}
									layout={EntityLayout.Value}
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

		<ProjectionBoundary
			resource={selection.Evm}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					{#if contentOpen}
						<ResourceBoundary
							resource={projection.consensusProtocol}
						>
							{#snippet children(consensusProtocol)}
								{#if consensusProtocol != null}
									<div>
										<dt>Consensus</dt>
										<dd>
											{consensusProtocolByProtocol[consensusProtocol]?.label ?? consensusProtocol}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.registryStatus}
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
							resource={projection.shortName}
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
							resource={projection.peeringId}
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
							resource={projection.slip44}
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
							resource={projection.$nativeCoinInstance}
						>
							{#snippet children(evmCoinInstance)}
								{#if evmCoinInstance != null}
									{@const evmCoinInstanceInitial = untrack(() => evmCoinInstance)}
									<div>
										<dt>Native currency</dt>
										<dd>
											<EvmCoinInstanceView
												selection={select(EntityType.EvmCoinInstance, (evmCoinInstance ?? evmCoinInstanceInitial)[EntityMetaKey.Selector])}
												layout={EntityLayout.Value}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$nativeCoin}
						>
							{#snippet children(coin)}
								{#if coin != null}
									{@const coinInitial = untrack(() => coin)}
									<div>
										<dt>Native coin</dt>
										<dd>
											<CoinView
												selection={select(EntityType.Coin, (coin ?? coinInitial)[EntityMetaKey.Selector])}
												prefetched={coin ?? coinInitial}
												layout={EntityLayout.Value}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$parent}
						>
							{#snippet children(network)}
								{#if network != null}
									{@const networkInitial = untrack(() => network)}
									<div>
										<dt>Parent</dt>
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
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$mainnet}
						>
							{#snippet children(network)}
								{#if network != null}
									{@const networkInitial = untrack(() => network)}
									<div>
										<dt>Mainnet</dt>
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
					{/if}
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.ZeroG}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.chainId}
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
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Lightning}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$settlementNetwork}
						>
							{#snippet children(network)}
								{#if network != null}
									{@const networkInitial = untrack(() => network)}
									<div>
										<dt>Settlement network</dt>
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
					{/if}
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Hedera}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.shard}
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
						resource={projection.realm}
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
				</dl>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet Details()}
		{@const networkEndpointObservationsHistorySources = networkApplicableSources([
				Source.Beacon_Rest,
				Source.Voltaire_JsonRpc,
			], pendingEntity)}

		{@const networkEndpointObservationsSections = [
				...(
					networkEndpointObservationsHistorySources.length > 0 ?
						[
							{
								id: 'network-endpoint-observations-history',
								label: 'Endpoint observations',
							},
						]
					:
						[]
				),
			]}

		{#if networkEndpointObservationsSections.length > 0}
			<CollapsibleTabs
				id={viewDomId + '-carousel-network-endpoint-observations'}
				sectionIdPrefix={viewDomId}
				sections={networkEndpointObservationsSections}
				data-card
				class='network-view-collapsible-resources'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Endpoint observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionNetworkEndpointObservationsHistory({ id, label })}
					<NetworkEndpointObservation_TimestampsView
						selection={
							selection
							.$$endpointObservations({
								sources: networkEndpointObservationsHistorySources,
								limit: 16,
							})
						}
						collapsible={false}
						title={label}
						emptyText='No endpoint observations.'
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}

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

			{#snippet SectionNetworkAssetsNativeAssets({ id, label })}
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
					collapsible={false}
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

			{#snippet SectionNetworkResourcesFaucets({ id, label })}
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
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionNetworkResourcesBlockExplorers({ id, label })}
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
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<ProjectionBoundary
			resource={selection.Dydx}
		>
			{#snippet Applicable(projection)}
				{@const dydxNetworkSources = networkApplicableSources([
						Source.DydxIndexer,
					], pendingEntity)}

				{@const dydxSections = [
						...(
							dydxNetworkSources.length > 0 ?
								[
									{
										id: 'dydx-network',
										label: 'Network',
										ownsSection: true,
									},
								]
							:
								[]
						),
					]}

				{#if dydxSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-dydx'}
						sectionIdPrefix={viewDomId}
						sections={dydxSections}
						data-card
						class='network-view-collapsible-dydx'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>dYdX</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionDydxNetwork({ id, label, active })}
							<ResourceBoundary
								resource={
									projection
									.$dydxChainNetwork({
										sources: dydxNetworkSources,
									})
								}
							>
								{#snippet children(dydxChainNetwork)}
									{@const dydxChainNetworkInitial = untrack(() => dydxChainNetwork)}
									<section
										id={id}
										aria-labelledby={`${id}:marker`}
										data-scroll-marker-label={label}
										data-column-item="flexible"
										data-column
										data-active={active}
									>
										<DydxChainNetworkView
											selection={
												select(EntityType.DydxChainNetwork, (dydxChainNetwork ?? dydxChainNetworkInitial)[EntityMetaKey.Selector], {
													sources: dydxNetworkSources,
												})
											}
											layout={EntityLayout.SummaryDetails}
										/>
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

					{#snippet SectionEvmNetworkTopologyUpgrades({ id, label })}
						<EthereumNetworkUpgradesView
							selection={projection.$$upgrades}
							collapsible={false}
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

					{#snippet SectionEvmNetworkTopologyParentLayer({ id, label, active })}
						<ResourceBoundary
							resource={evmNetworkTopologyParentLayerResource}
						>
							{#snippet children(network)}
								{#if network != null}
									{@const networkInitial = untrack(() => network)}
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
												selection={
													select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector], {
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
															Source.L2Beat_Rest,
														],
													})
												}
												prefetched={network ?? networkInitial}
												layout={EntityLayout.SummaryInline}
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

					{#snippet SectionEvmNetworkTopologyRollup({ id, label, active })}
						<ResourceBoundary
							resource={evmNetworkTopologyRollupResource}
						>
							{#snippet children(evmRollup)}
								{#if evmRollup != null}
									{@const evmRollupInitial = untrack(() => evmRollup)}
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
												selection={
													select(EntityType.EvmRollup, (evmRollup ?? evmRollupInitial)[EntityMetaKey.Selector], {
														sources: [
															Source.L2Beat_Rest,
														],
													})
												}
												prefetched={evmRollup ?? evmRollupInitial}
												layout={EntityLayout.SummaryInline}
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

					{#snippet SectionEvmNetworkTopologySiblingShards({ id, label })}
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
							collapsible={false}
							title={label}
							emptyText='No sibling shard networks listed for this network yet.'
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionEvmNetworkTopologyTestnets({ id, label })}
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
							collapsible={false}
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

					{#snippet SectionEvmNetworkTopologyMainnet({ id, label, active })}
						<ResourceBoundary
							resource={evmNetworkTopologyMainnetResource}
						>
							{#snippet children(network)}
								{#if network != null}
									{@const networkInitial = untrack(() => network)}
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
												selection={
													select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector], {
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
														],
													})
												}
												prefetched={network ?? networkInitial}
												layout={EntityLayout.SummaryInline}
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

					{#snippet SectionEvmNetworkTopologyChildLayers({ id, label })}
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
							collapsible={false}
							title={label}
							emptyText='No child layer networks listed for this network yet.'
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionEvmNetworkTopologySettledRollups({ id, label })}
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
							collapsible={false}
							title={label}
							emptyText='No settled rollups listed for this network yet.'
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
				{@const evmExecutionBlocksSources = networkApplicableSources([
						Source.Blobscan_Rest,
						Source.Blockscout_Rest,
						Source.EnvioHyperRpc_JsonRpc,
						Source.EnvioHyperSync_RawHttp,
						Source.SqdPortal_RawHttp,
						Source.Voltaire_JsonRpc,
					], pendingEntity)}

				{@const evmExecutionSections = [
						{
							id: 'evm-execution-upgrades',
							label: 'Upgrades',
						},
						...(
							evmExecutionBlocksSources.length > 0 ?
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
							blockscoutRestSources.length > 0 ?
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
								<Tooltip>
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

						{#snippet SectionEvmExecutionUpgrades({ id, label })}
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
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionBlocks({ id, label })}
							<EvmBlocksView
								selection={
									projection
									.$$blocks({
										sources: evmExecutionBlocksSources,
										limit: 4,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionTransactions({ id, label })}
							<EvmTransactionsView
								selection={
									projection
									.$$transactions({
										sources: blockscoutRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionMempool({ id, label })}
							<EvmNetwork_Txpool_TimestampsView
								selection={
									projection
									.$$txpoolTimestamps({
										sources: voltaireJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionGasBlocks({ id, label })}
							<EvmNetwork_GasFee_BlocksView
								selection={
									projection
									.$$gasFeeBlocks({
										sources: voltaireJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionGasEstimates({ id, label })}
							<EvmNetwork_GasEstimate_TimestampsView
								selection={
									projection
									.$$gasEstimateTimestamps({
										sources: blockscoutRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionEndpoints({ id, label })}
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
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}

				<ProjectionBoundary
					resource={projection.EthereumBeacon}
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
								...(
									beaconRestSources.length > 0 ?
										[
											{
												id: 'evm-consensus-endpoints',
												label: 'Endpoints',
												ownsSection: true,
											},
										]
									:
										[]
								),
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

								{#snippet SectionEvmConsensusUpgrades({ id, label })}
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
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusFinality({ id, label })}
									<EthereumBeaconFinality_TimestampsView
										selection={
											selection.Evm
											.$$beaconFinalityTimestamps({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusCommittees({ id, label })}
									<BeaconCommitteesView
										selection={
											selection.Evm
											.$$beaconCommittees({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusSyncCommittees({ id, label })}
									<BeaconSyncCommitteesView
										selection={
											selection.Evm
											.$$beaconSyncCommittees({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusAttestations({ id, label })}
									<BeaconAttestationsView
										selection={
											selection.Evm
											.$$beaconAttestations({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusWithdrawals({ id, label })}
									<BeaconWithdrawalsView
										selection={
											selection.Evm
											.$$beaconWithdrawals({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusSlashings({ id, label })}
									<BeaconSlashingsView
										selection={
											selection.Evm
											.$$beaconSlashings({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusValidators({ id, label })}
									<BeaconValidatorsView
										selection={
											selection.Evm
											.$$beaconValidators({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusEpochs({ id, label })}
									<BeaconEpochsView
										selection={
											selection.Evm
											.$$beaconEpochs({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusSlots({ id, label })}
									<BeaconSlotsView
										selection={
											selection.Evm
											.$$beaconSlots({
												sources: beaconRestSources,
												limit: 16,
											})
										}
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusMevRelays({ id, label })}
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
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusMevBuilders({ id, label })}
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
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusMevBoost({ id, label })}
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
										collapsible={false}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusEndpoints({ id, label, active })}
									<ResourceBoundary
										resource={
											selection.Evm
											.consensusEndpoints({
												sources: beaconRestSources,
											})
										}
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
															<li>
																<dl data-column-item="center">
																	<div>
																		<dt>REST</dt>
																		<dd>
																			<a
																				href={consensusEndpoint.restBaseUrl}
																				target="_blank"
																				rel="noreferrer noopener"
																			>
																				<TruncatedValue value={consensusEndpoint.restBaseUrl} />
																			</a>
																		</dd>
																	</div>

																	<div>
																		<dt>Protocol</dt>
																		<dd>
																			{consensusProtocolByProtocol[consensusEndpoint.consensusProtocol]?.label ?? consensusEndpoint.consensusProtocol}
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
				{@const evmContractsAccountsEvmContractsVerifiedSources = networkApplicableSources([
						Source.Blockscout_Rest,
						Source.Sourcify_Rest,
					], pendingEntity)}

				{@const evmContractsAccountsSections = [
						{
							id: 'evm-contracts-precompiles',
							label: 'Precompiles',
							description: 'Catalog precompiles active at the chain head according to the execution upgrade schedule.',
						},
						...(
							evmContractsAccountsEvmContractsVerifiedSources.length > 0 ?
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
										id: 'evm-contracts-user-operations',
										label: 'User operations',
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

						{#snippet SectionEvmContractsPrecompiles({ id, label })}
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
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsVerified({ id, label })}
							<EvmContractsView
								selection={
									projection
									.$$contracts({
										sources: evmContractsAccountsEvmContractsVerifiedSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsSmartAccounts({ id, label })}
							<Erc4337SmartAccountsView
								selection={
									projection
									.$$erc4337SmartAccounts({
										sources: blockscoutRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsUserOperations({ id, label })}
							<EvmUserOperationsView
								selection={
									projection
									.$$userOperations({
										sources: blockscoutRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionEvmAssetsNativeCoin({ id, label, active })}
							<ResourceBoundary
								resource={evmAssetsNativeCoinResource}
							>
								{#snippet children(coin)}
									{#if coin != null}
										{@const coinInitial = untrack(() => coin)}
										<section
											id={id}
											aria-labelledby={`${id}:marker`}
											data-scroll-marker-label={label}
											data-column-item="flexible"
											data-column
											data-active={active}
										>
											<CoinView
												selection={
													select(EntityType.Coin, (coin ?? coinInitial)[EntityMetaKey.Selector], {
														sources: [
															Source.Constants_Internal,
														],
													})
												}
												prefetched={coin ?? coinInitial}
												layout={EntityLayout.Summary}
											/>
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

						{#snippet SectionEvmAssetsNativeInstance({ id, label, active })}
							<ResourceBoundary
								resource={evmAssetsNativeInstanceResource}
							>
								{#snippet children(evmCoinInstance)}
									{#if evmCoinInstance != null}
										{@const evmCoinInstanceInitial = untrack(() => evmCoinInstance)}
										<section
											id={id}
											aria-labelledby={`${id}:marker`}
											data-scroll-marker-label={label}
											data-column-item="flexible"
											data-column
											data-active={active}
										>
											<EvmCoinInstanceView
												selection={
													select(EntityType.EvmCoinInstance, (evmCoinInstance ?? evmCoinInstanceInitial)[EntityMetaKey.Selector], {
														sources: [
															Source.Constants_Internal,
														],
													})
												}
												layout={EntityLayout.Summary}
											/>
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

						{#snippet SectionEvmAssetsBridges({ id, label })}
							<EvmNetworkBridgesView
								selection={
									projection
									.$$bridges({
										sources: [
											Source.Chainlist_Rest,
											Source.EthereumLists_Rest,
										],
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmAssetsErc20Transfers({ id, label })}
							<EvmTokenTransfersView
								selection={
									projection
									.$$erc20TokenTransfers({
										sources: blockscoutRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmAssetsNftTransfers({ id, label })}
							<EvmTokenTransfersView
								selection={
									projection
									.$$nftTokenTransfers({
										sources: blockscoutRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const evmDefiGmxMarketsSources = networkApplicableSources([
						Source.Gmx_Rest,
					], pendingEntity)}

				{@const evmDefiSections = [
						{
							id: 'evm-defi-aave-markets',
							label: 'Aave markets',
						},
						{
							id: 'evm-defi-balancer-pools',
							label: 'Balancer pools',
						},
						{
							id: 'evm-defi-balancer-gauges',
							label: 'Balancer gauges',
						},
						{
							id: 'evm-defi-compound-comets',
							label: 'Compound comets',
						},
						{
							id: 'evm-defi-curve-pools',
							label: 'Curve pools',
						},
						{
							id: 'evm-defi-curve-lending-vaults',
							label: 'Curve Lend vaults',
						},
						{
							id: 'evm-defi-euler-vaults',
							label: 'Euler vaults',
						},
						...(
							evmDefiGmxMarketsSources.length > 0 ?
								[
									{
										id: 'evm-defi-gmx-markets',
										label: 'GMX markets',
									},
								]
							:
								[]
						),
						{
							id: 'evm-defi-morpho-markets',
							label: 'Morpho markets',
						},
						{
							id: 'evm-defi-morpho-vaults',
							label: 'Morpho vaults',
						},
						{
							id: 'evm-defi-pendle-markets',
							label: 'Pendle markets',
						},
					]}

				{#if evmDefiSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-defi'}
						sectionIdPrefix={viewDomId}
						sections={evmDefiSections}
						data-card
						class='network-view-collapsible-defi'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>DeFi</HeadingComponent>
								<Tooltip>
									{#snippet Content()}
										<p>
											Protocol-native DeFi surfaces on this EVM network.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='DeFi help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionEvmDefiAaveMarkets({ id, label })}
							<AaveMarketsView
								selection={
									projection
									.$$aaveMarkets({
										sources: [
											Source.Aave_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Aave markets.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiBalancerPools({ id, label })}
							<BalancerPoolsView
								selection={
									projection
									.$$balancerPools({
										sources: [
											Source.Balancer_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Balancer pools.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiBalancerGauges({ id, label })}
							<BalancerGaugesView
								selection={
									projection
									.$$balancerGauges({
										sources: [
											Source.Balancer_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Balancer gauges.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiCompoundComets({ id, label })}
							<CompoundCometsView
								selection={
									projection
									.$$compoundComets({
										sources: [
											Source.Compound_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Compound comets.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiCurvePools({ id, label })}
							<CurvePoolsView
								selection={
									projection
									.$$curvePools({
										sources: [
											Source.Curve_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Curve pools.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiCurveLendingVaults({ id, label })}
							<CurveLendingVaultsView
								selection={
									projection
									.$$curveLendingVaults({
										sources: [
											Source.Curve_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Curve Lend vaults.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiEulerVaults({ id, label })}
							<EulerEvkVaultsView
								selection={
									projection
									.$$eulerEvkVaults({
										sources: [
											Source.Euler_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Euler vaults.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiGmxMarkets({ id, label })}
							<GmxMarketsView
								selection={
									projection
									.$$gmxMarkets({
										sources: evmDefiGmxMarketsSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No GMX markets.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiMorphoMarkets({ id, label })}
							<MorphoMarketsView
								selection={
									projection
									.$$morphoMarkets({
										sources: [
											Source.Morpho_Graphql,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Morpho markets.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiMorphoVaults({ id, label })}
							<MorphoVaultsView
								selection={
									projection
									.$$morphoVaults({
										sources: [
											Source.Morpho_Graphql,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Morpho vaults.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmDefiPendleMarkets({ id, label })}
							<PendleMarketsView
								selection={
									projection
									.$$pendleMarkets({
										sources: [
											Source.Pendle_Rest,
										],
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Pendle markets.'
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
							cometBftRestAndCosmosSdkRestAndMintscanSources.length > 0 ?
								[
									{
										id: 'cosmos-consensus-observations',
										label: 'Observations',
									},
								]
							:
								[]
						),
						...(
							cometBftRestAndCosmosSdkRestAndMintscanSources.length > 0 ?
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
								<Tooltip>
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

						{#snippet SectionCosmosConsensusObservations({ id, label })}
							<Network_TimestampsView
								selection={
									selection
									.$$timestamps({
										sources: cometBftRestAndCosmosSdkRestAndMintscanSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCosmosConsensusBlocks({ id, label })}
							<CosmosBlocksView
								selection={
									projection
									.$$blocks({
										sources: cometBftRestAndCosmosSdkRestAndMintscanSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCosmosConsensusValidators({ id, label })}
							<CosmosValidatorsView
								selection={
									projection
									.$$validators({
										sources: cosmosSdkRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionCosmosContractsAccountsAccounts({ id, label })}
							<CosmosAccountsView
								selection={
									projection
									.$$accounts({
										sources: cosmosSdkRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const cosmosIbcSections = [
						...(
							cosmosSdkRestSources.length > 0 ?
								[
									{
										id: 'cosmos-ibc-channels',
										label: 'Channels',
									},
								]
							:
								[]
						),
						...(
							cosmosSdkRestSources.length > 0 ?
								[
									{
										id: 'cosmos-ibc-clients',
										label: 'Clients',
									},
								]
							:
								[]
						),
						...(
							cosmosSdkRestSources.length > 0 ?
								[
									{
										id: 'cosmos-ibc-connections',
										label: 'Connections',
									},
								]
							:
								[]
						),
					]}

				{#if cosmosIbcSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-ibc'}
						sectionIdPrefix={viewDomId}
						sections={cosmosIbcSections}
						data-card
						class='network-view-collapsible-ibc'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>IBC</HeadingComponent>
								<Tooltip>
									{#snippet Content()}
										<p>
											IBC channels, clients, and connections exposed by this Cosmos SDK network.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='IBC help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionCosmosIbcChannels({ id, label })}
							<IbcChannelsView
								selection={
									projection
									.$$ibcChannels({
										sources: cosmosSdkRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No IBC channels.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCosmosIbcClients({ id, label })}
							<IbcClientsView
								selection={
									projection
									.$$ibcClients({
										sources: cosmosSdkRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No IBC clients.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCosmosIbcConnections({ id, label })}
							<IbcConnectionsView
								selection={
									projection
									.$$ibcConnections({
										sources: cosmosSdkRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No IBC connections.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const cosmosDefiOsmosisPoolsSources = networkApplicableSources([
						Source.Osmosis_LCD_Rest,
					], pendingEntity)}

				{@const cosmosDefiSections = [
						...(
							cosmosDefiOsmosisPoolsSources.length > 0 ?
								[
									{
										id: 'cosmos-defi-osmosis-pools',
										label: 'Osmosis pools',
									},
								]
							:
								[]
						),
					]}

				{#if cosmosDefiSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-defi'}
						sectionIdPrefix={viewDomId}
						sections={cosmosDefiSections}
						data-card
						class='network-view-collapsible-defi'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>DeFi</HeadingComponent>
								<Tooltip>
									{#snippet Content()}
										<p>
											Osmosis poolmanager pools exposed by this Cosmos SDK network.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label='DeFi help'
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionCosmosDefiOsmosisPools({ id, label })}
							<OsmosisPoolsView
								selection={
									projection
									.$$osmosisPools({
										sources: cosmosDefiOsmosisPoolsSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Osmosis pools.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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
								<Tooltip>
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

						{#snippet SectionCosmosGovernanceProposals({ id, label })}
							<CosmosGovernanceProposalsView
								selection={
									projection
									.$$governanceProposals({
										sources: cosmosSdkRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionCosmosResourcesEndpoints({ id, label, active })}
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	<a
																		href={restEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={restEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{restEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{restEndpoint.transportType}
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
				{@const polkadotConsensusBlockProductionPolkadotConsensusBlocksSources = networkApplicableSources([
						Source.Polkadot_JsonRpc,
						Source.SubstrateSidecar_Rest,
					], pendingEntity)}

				{@const polkadotConsensusBlockProductionSections = [
						...(
							polkadotConsensusBlockProductionPolkadotConsensusBlocksSources.length > 0 ?
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

						{#snippet SectionPolkadotConsensusBlocks({ id, label })}
							<PolkadotBlocksView
								selection={
									projection
									.$$blocks({
										sources: polkadotConsensusBlockProductionPolkadotConsensusBlocksSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionPolkadotConsensusValidators({ id, label })}
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
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}

				<CollapsibleTabs
					id={viewDomId + '-carousel-polkadot-governance'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'polkadot-governance-referenda',
								label: 'Referenda',
							},
						]
					}
					data-card
					class='network-view-collapsible-governance'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Governance</HeadingComponent>
							<Tooltip>
								{#snippet Content()}
									<p>
										Native OpenGov referenda and their current on-chain lifecycle.
									</p>
								{/snippet}

								<abbr
									class="entity-heading-tip"
									aria-label='Governance help'
								>ⓘ</abbr>
							</Tooltip>
						</header>
					{/snippet}

					{#snippet SectionPolkadotGovernanceReferenda({ id, label })}
						<PolkadotReferendumsView
							selection={
								projection
								.$$referenda({
									sources: [
										Source.SubstrateSidecar_Rest,
									],
									limit: 16,
								})
							}
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
				{@const polkadotResourcesEndpointsSources = networkApplicableSources([
						Source.Polkadot_JsonRpc,
					], pendingEntity)}

				{@const polkadotResourcesSections = [
						...(
							polkadotResourcesEndpointsSources.length > 0 ?
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

						{#snippet SectionPolkadotResourcesEndpoints({ id, label, active })}
							<ResourceBoundary
								resource={
									projection
									.rpcEndpoints({
										sources: polkadotResourcesEndpointsSources,
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>RPC</dt>
																<dd>
																	<a
																		href={rpcEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={rpcEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{rpcEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{rpcEndpoint.transportType}
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
								<Tooltip>
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

						{#snippet SectionSolanaExecutionBlocks({ id, label })}
							<SolanaBlocksView
								selection={
									projection
									.$$blocks({
										sources: solanaJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaExecutionTransactions({ id, label })}
							<SolanaTransactionsView
								selection={
									projection
									.$$transactions({
										sources: solanaJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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
								<Tooltip>
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

						{#snippet SectionSolanaConsensusValidators({ id, label })}
							<SolanaValidatorsView
								selection={
									projection
									.$$validators({
										sources: solanaJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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
								<Tooltip>
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

						{#snippet SectionSolanaContractsAccountsAccounts({ id, label })}
							<SolanaAccountsView
								selection={
									projection
									.$$accounts({
										sources: solanaJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaContractsAccountsPrograms({ id, label })}
							<SolanaProgramsView
								selection={
									projection
									.$$programs({
										sources: solanaJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionSolanaAssetsTokenAccounts({ id, label })}
							<SolanaTokenAccountsView
								selection={
									projection
									.$$tokenAccounts({
										sources: solanaJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaAssetsTokenMints({ id, label })}
							<SolanaTokenMintsView
								selection={
									projection
									.$$tokenMints({
										sources: solanaJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionSolanaResourcesEndpoints({ id, label, active })}
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>RPC</dt>
																<dd>
																	<a
																		href={rpcEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={rpcEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{rpcEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{rpcEndpoint.transportType}
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
				{@const utxoChainActivityUtxoConsensusBlocksSources = networkApplicableSources([
						Source.BitcoinCashNode_JsonRpc,
						Source.Blockchair_Rest,
						Source.DogecoinCore_JsonRpc,
						Source.Esplora_Rest,
						Source.MempoolSpace_Rest,
					], pendingEntity)}

				{@const utxoChainActivitySections = [
						...(
							blockchairRestAndEsploraRestAndMempoolSpaceRestSources.length > 0 ?
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
							utxoChainActivityUtxoConsensusBlocksSources.length > 0 ?
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

						{#snippet SectionUtxoConsensusObservations({ id, label })}
							<Network_TimestampsView
								selection={
									selection
									.$$timestamps({
										sources: blockchairRestAndEsploraRestAndMempoolSpaceRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionUtxoConsensusBlocks({ id, label })}
							<UtxoBlocksView
								selection={
									projection
									.$$blocks({
										sources: utxoChainActivityUtxoConsensusBlocksSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const utxoTransactionGraphUtxoExecutionMempoolSources = networkApplicableSources([
						Source.Esplora_Rest,
						Source.MempoolSpace_Rest,
					], pendingEntity)}

				{@const utxoTransactionGraphSections = [
						...(
							blockchairRestAndEsploraRestAndMempoolSpaceRestSources.length > 0 ?
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

						{#snippet SectionUtxoExecutionTransactions({ id, label })}
							<UtxoTransactionsView
								selection={
									projection
									.$$transactions({
										sources: blockchairRestAndEsploraRestAndMempoolSpaceRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionUtxoExecutionMempool({ id, label })}
							<UtxoTransactionsView
								selection={
									projection
									.$$transactions({
										sources: utxoTransactionGraphUtxoExecutionMempoolSources,
										limit: 16,
									})
								}
								collapsible={false}
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

					{#snippet SectionZcashShieldedPools({ id, label })}
						<ZcashShieldedPoolsView
							selection={
								projection
								.$$shieldedPools({
									sources: [
										Source.Constants_Internal,
									],
								})
							}
							collapsible={false}
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

						{#snippet SectionBittensorChainObservations({ id, label })}
							<BittensorNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: bittensorJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionBittensorChainBlocks({ id, label })}
							<BittensorBlocksView
								selection={
									projection
									.$$blocks({
										sources: bittensorJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionBittensorSubnetsSubnets({ id, label })}
							<BittensorSubnetsView
								selection={
									projection
									.$$subnets({
										sources: bittensorJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
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

					{#snippet SectionZeroGStorageObservations({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionZeroGStorageNodes({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionZeroGStorageDataBlobs({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionZeroGStorageLogEntries({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Celestia}
		>
			{#snippet Applicable(projection)}
				{@const celestiaChainActivitySections = [
						...(
							celeniumRestAndCelestiaNodeSources.length > 0 ?
								[
									{
										id: 'celestia-chain-observations',
										label: 'Observations',
									},
								]
							:
								[]
						),
						...(
							celeniumRestAndCelestiaNodeSources.length > 0 ?
								[
									{
										id: 'celestia-chain-blocks',
										label: 'Blocks',
									},
								]
							:
								[]
						),
					]}

				{#if celestiaChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-celestia-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={celestiaChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCelestiaChainObservations({ id, label })}
							<CelestiaNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: celeniumRestAndCelestiaNodeSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No observations yet.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCelestiaChainBlocks({ id, label })}
							<CelestiaBlocksView
								selection={
									projection
									.$$blocks({
										sources: celeniumRestAndCelestiaNodeSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No blocks found.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}

				<CollapsibleTabs
					id={viewDomId + '-carousel-celestia-data-availability'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'celestia-namespaces',
								label: 'Namespaces',
							},
							{
								id: 'celestia-blobs',
								label: 'Blobs',
							},
						]
					}
					data-card
					class='network-view-collapsible-data-availability'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Data availability</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionCelestiaNamespaces({ id, label })}
						<CelestiaNamespacesView
							selection={
								projection
								.$$namespaces({
									sources: [
										Source.Celenium_Rest,
									],
									limit: 16,
								})
							}
							collapsible={false}
							title={label}
							emptyText='No namespaces found.'
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionCelestiaBlobs({ id, label })}
						<CelestiaBlobsView
							selection={
								projection
								.$$blobs({
									sources: [
										Source.Celenium_Rest,
									],
									limit: 16,
								})
							}
							collapsible={false}
							title={label}
							emptyText='No blobs found.'
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Avail}
		>
			{#snippet Applicable(projection)}
				{@const availChainActivitySections = [
						...(
							availSources.length > 0 ?
								[
									{
										id: 'avail-chain-observations',
										label: 'Observations',
									},
								]
							:
								[]
						),
						...(
							availSources.length > 0 ?
								[
									{
										id: 'avail-chain-blocks',
										label: 'Blocks',
									},
								]
							:
								[]
						),
					]}

				{#if availChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-avail-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={availChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionAvailChainObservations({ id, label })}
							<AvailNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: availSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No observations yet.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionAvailChainBlocks({ id, label })}
							<AvailBlocksView
								selection={
									projection
									.$$blocks({
										sources: availSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No blocks found.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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
							{
								id: 'filecoin-storage-deals',
								label: 'Storage deals',
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

					{#snippet SectionFilecoinChainObservations({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionFilecoinChainTipsets({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionFilecoinStorageDeals({ id, label })}
						<FilecoinDealsView
							selection={
								projection
								.$$deals({
									sources: [
										Source.Filfox_Rest,
									],
									limit: 16,
								})
							}
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>

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

					{#snippet SectionFilecoinResourcesEndpoints({ id, label, active })}
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
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																<a
																	href={rpcEndpoint.url}
																	target="_blank"
																	rel="noreferrer noopener"
																>
																	<TruncatedValue value={rpcEndpoint.url} />
																</a>
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{rpcEndpoint.providerName}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{rpcEndpoint.transportType}
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
			resource={selection.Arweave}
		>
			{#snippet Applicable(projection)}
				{@const arweaveChainActivitySections = [
						...(
							arweaveGraphqlAndArweaveRestSources.length > 0 ?
								[
									{
										id: 'arweave-chain-observations',
										label: 'Observations',
									},
								]
							:
								[]
						),
						...(
							arweaveGraphqlAndArweaveRestSources.length > 0 ?
								[
									{
										id: 'arweave-chain-blocks',
										label: 'Blocks',
									},
								]
							:
								[]
						),
						...(
							arweaveGraphqlSources.length > 0 ?
								[
									{
										id: 'arweave-chain-transactions',
										label: 'Transactions',
									},
								]
							:
								[]
						),
					]}

				{#if arweaveChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-arweave-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={arweaveChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionArweaveChainObservations({ id, label })}
							<EntitiesList
								entityType={EntityType.ArweaveNetwork_Timestamp}
								collapsible={false}
								title={label}
								open={true}
								id={`${id}-list`}
								resource={
									projection
									.$$timestamps({
										sources: arweaveGraphqlAndArweaveRestSources,
										limit: 16,
									})()
								}
							>
								{#snippet Item({ item: arweaveNetworkTimestamp })}
									<EntityView
										entityType={EntityType.ArweaveNetwork_Timestamp}
										entitySelector={arweaveNetworkTimestamp[EntityMetaKey.Selector]}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}

						{#snippet SectionArweaveChainBlocks({ id, label })}
							<ArweaveBlocksView
								selection={
									projection
									.$$blocks({
										sources: arweaveGraphqlAndArweaveRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionArweaveChainTransactions({ id, label })}
							<ArweaveTransactionsView
								selection={
									projection
									.$$transactions({
										sources: arweaveGraphqlSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const arweaveResourcesSections = [
						...(
							arweaveGraphqlSources.length > 0 ?
								[
									{
										id: 'arweave-resource-list',
										label: 'Resources',
									},
								]
							:
								[]
						),
					]}

				{#if arweaveResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-arweave-resources'}
						sectionIdPrefix={viewDomId}
						sections={arweaveResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionArweaveResourceList({ id, label })}
							<ArweaveResourcesView
								selection={
									projection
									.$$resources({
										sources: arweaveGraphqlSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Arweave resources.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Avalanche}
		>
			{#snippet Applicable(projection)}
				{@const avalancheChainActivitySections = [
						...(
							avalanchePlatformVmJsonRpcSources.length > 0 ?
								[
									{
										id: 'avalanche-chain-blocks',
										label: 'Blocks',
									},
								]
							:
								[]
						),
						...(
							avalanchePlatformVmJsonRpcSources.length > 0 ?
								[
									{
										id: 'avalanche-chain-subnets',
										label: 'Subnets',
									},
								]
							:
								[]
						),
					]}

				{#if avalancheChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-avalanche-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={avalancheChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionAvalancheChainBlocks({ id, label })}
							<AvalanchePChainBlocksView
								selection={
									projection
									.$$blocks({
										sources: avalanchePlatformVmJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionAvalancheChainSubnets({ id, label })}
							<AvalancheSubnetsView
								selection={
									projection
									.$$subnets({
										sources: avalanchePlatformVmJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Sui}
		>
			{#snippet Applicable(projection)}
				{@const suiChainActivitySections = [
						...(
							suiSources.length > 0 ?
								[
									{
										id: 'sui-chain-observations',
										label: 'Observations',
									},
								]
							:
								[]
						),
						...(
							suiSources.length > 0 ?
								[
									{
										id: 'sui-chain-checkpoints',
										label: 'Checkpoints',
									},
								]
							:
								[]
						),
						...(
							suiSources.length > 0 ?
								[
									{
										id: 'sui-chain-transactions',
										label: 'Transactions',
									},
								]
							:
								[]
						),
					]}

				{#if suiChainActivitySections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-sui-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={suiChainActivitySections}
						data-card
						class='network-view-collapsible-chain-activity'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSuiChainObservations({ id, label })}
							<SuiNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: suiSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Sui network observations.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSuiChainCheckpoints({ id, label })}
							<SuiCheckpointsView
								selection={
									projection
									.$$checkpoints({
										sources: suiSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Sui checkpoints.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSuiChainTransactions({ id, label })}
							<SuiTransactionsView
								selection={
									projection
									.$$transactions({
										sources: suiSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Sui transactions.'
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
				{@const nearChainActivityNearChainBlocksSources = networkApplicableSources([
						Source.NearBlocks_Rest,
						Source.NearRpc_JsonRpc,
					], pendingEntity)}

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
							nearChainActivityNearChainBlocksSources.length > 0 ?
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

						{#snippet SectionNearChainObservations({ id, label })}
							<NearNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: nearRpcJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionNearChainBlocks({ id, label })}
							<NearBlocksView
								selection={
									projection
									.$$blocks({
										sources: nearChainActivityNearChainBlocksSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionNearConsensusValidators({ id, label })}
							<NearValidatorsView
								selection={
									projection
									.$$validators({
										sources: nearRpcJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const nearResourcesSections = [
						...(
							nearRpcJsonRpcSources.length > 0 ?
								[
									{
										id: 'near-resources-endpoints',
										label: 'Endpoints',
										ownsSection: true,
									},
								]
							:
								[]
						),
					]}

				{#if nearResourcesSections.length > 0}
					<CollapsibleTabs
						id={viewDomId + '-carousel-near-resources'}
						sectionIdPrefix={viewDomId}
						sections={nearResourcesSections}
						data-card
						class='network-view-collapsible-resources'
					>
						{#snippet Summary()}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionNearResourcesEndpoints({ id, label, active })}
							<ResourceBoundary
								resource={
									projection
									.rpcEndpoints({
										sources: nearRpcJsonRpcSources,
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>RPC</dt>
																<dd>
																	<a
																		href={rpcEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={rpcEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{rpcEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{rpcEndpoint.transportType}
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

					{#snippet SectionMoneroChainObservations({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionMoneroChainBlocks({ id, label })}
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
							collapsible={false}
							title={label}
							id={`${id}-list`}
						/>
					{/snippet}

				</CollapsibleTabs>

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

					{#snippet SectionMoneroResourcesEndpoints({ id, label, active })}
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
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																<a
																	href={rpcEndpoint.url}
																	target="_blank"
																	rel="noreferrer noopener"
																>
																	<TruncatedValue value={rpcEndpoint.url} />
																</a>
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{rpcEndpoint.providerName}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{rpcEndpoint.transportType}
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

						{#snippet SectionLightningNetworkObservations({ id, label })}
							<LightningNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: lightningNetworkGraphLightningNetworkObservationsSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionLightningNetworkNodes({ id, label })}
							<LightningNodesView
								selection={
									projection
									.$$nodes({
										sources: lightningNetworkGraphLightningNetworkNodesSources,
										limit: 16,
									})
								}
								collapsible={false}
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
							blockfrostRestAndCardanoKoiosRestAndOgmiosJsonRpcSources.length > 0 ?
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
							blockfrostRestAndCardanoKoiosRestAndOgmiosJsonRpcSources.length > 0 ?
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
							blockfrostRestAndCardanoKoiosRestSources.length > 0 ?
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

						{#snippet SectionCardanoChainObservations({ id, label })}
							<CardanoNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: blockfrostRestAndCardanoKoiosRestAndOgmiosJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoChainBlocks({ id, label })}
							<CardanoBlocksView
								selection={
									projection
									.$$blocks({
										sources: blockfrostRestAndCardanoKoiosRestAndOgmiosJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoChainTransactions({ id, label })}
							<CardanoTransactionsView
								selection={
									projection
									.$$transactions({
										sources: blockfrostRestAndCardanoKoiosRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const cardanoStakeDelegationSections = [
						...(
							blockfrostRestAndCardanoKoiosRestSources.length > 0 ?
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

						{#snippet SectionCardanoStakePools({ id, label })}
							<CardanoStakePoolsView
								selection={
									projection
									.$$stakePools({
										sources: blockfrostRestAndCardanoKoiosRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const cardanoGovernanceSections = [
						...(
							blockfrostRestAndCardanoKoiosRestSources.length > 0 ?
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
							blockfrostRestAndCardanoKoiosRestSources.length > 0 ?
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
							blockfrostRestAndCardanoKoiosRestSources.length > 0 ?
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

						{#snippet SectionCardanoGovernanceDreps({ id, label })}
							<CardanoDRepsView
								selection={
									projection
									.$$dReps({
										sources: blockfrostRestAndCardanoKoiosRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoGovernanceProposals({ id, label })}
							<CardanoGovernanceProposalsView
								selection={
									projection
									.$$governanceProposals({
										sources: blockfrostRestAndCardanoKoiosRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoGovernanceCommittee({ id, label })}
							<CardanoCommittee_EpochsView
								selection={
									projection
									.$$committeeEpochs({
										sources: blockfrostRestAndCardanoKoiosRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const cardanoAssetsProtocolSections = [
						...(
							blockfrostRestAndCardanoKoiosRestSources.length > 0 ?
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
							blockfrostRestAndCardanoKoiosRestAndOgmiosJsonRpcSources.length > 0 ?
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

						{#snippet SectionCardanoAssetsNative({ id, label })}
							<CardanoNativeAssetsView
								selection={
									projection
									.$$assets({
										sources: blockfrostRestAndCardanoKoiosRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoProtocolParameters({ id, label })}
							<CardanoProtocolParameters_EpochsView
								selection={
									projection
									.$$protocolParameterEpochs({
										sources: blockfrostRestAndCardanoKoiosRestAndOgmiosJsonRpcSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const cardanoResourcesSections = [
						...(
							blockfrostRestAndCardanoKoiosRestSources.length > 0 ?
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

						{#snippet SectionCardanoResourcesEndpoints({ id, label, active })}
							<ResourceBoundary
								resource={
									projection
									.restEndpoints({
										sources: blockfrostRestAndCardanoKoiosRestSources,
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	<a
																		href={restEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={restEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{restEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{restEndpoint.transportType}
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

						{#snippet SectionTronChainObservations({ id, label })}
							<EntitiesList
								entityType={EntityType.TronNetwork_Timestamp}
								collapsible={false}
								title={label}
								open={true}
								id={`${id}-list`}
								resource={
									projection
									.$$timestamps({
										sources: tronGridRestSources,
										limit: 16,
									})()
								}
							>
								{#snippet Item({ item: tronNetworkTimestamp })}
									<EntityView
										entityType={EntityType.TronNetwork_Timestamp}
										entitySelector={tronNetworkTimestamp[EntityMetaKey.Selector]}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}

						{#snippet SectionTronChainBlocks({ id, label })}
							<TronBlocksView
								selection={
									projection
									.$$blocks({
										sources: tronGridRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTronChainWitnesses({ id, label })}
							<TronWitnessesView
								selection={
									projection
									.$$witnesses({
										sources: tronGridRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionTronResourcesEndpoints({ id, label, active })}
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	<a
																		href={restEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={restEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{restEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{restEndpoint.transportType}
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
						Source.TonCenter,
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

						{#snippet SectionTonChainObservations({ id, label })}
							<TonNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: tonChainActivityTonChainObservationsSources,
										limit: 16,
									})
								}
								collapsible={false}
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
				{@const xrplChainActivityXrplChainLedgersSources = networkApplicableSources([
						Source.Xrpl_Rippled,
						Source.XrplClio_JsonRpc,
						Source.XrpScan_Rest,
					], pendingEntity)}

				{@const xrplChainActivitySections = [
						...(
							xrplChainActivityXrplChainLedgersSources.length > 0 ?
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

						{#snippet SectionXrplChainLedgers({ id, label })}
							<XrplLedgersView
								selection={
									projection
									.$$ledgers({
										sources: xrplChainActivityXrplChainLedgersSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No XRPL ledgers.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionXrplChainTransactions({ id, label })}
							<XrplTransactionsView
								selection={
									projection
									.$$transactions({
										sources: xrplRippledSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No XRPL transactions.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionXrplLedgerStateAccounts({ id, label })}
							<XrplAccountsView
								selection={
									projection
									.$$accounts({
										sources: xrplRippledSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No XRPL accounts.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionXrplLedgerStateEntries({ id, label })}
							<XrplLedgerEntriesView
								selection={
									projection
									.$$ledgerEntries({
										sources: xrplRippledSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No XRPL ledger entries.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionXrplProtocolAmendments({ id, label })}
							<XrplAmendmentsView
								selection={
									projection
									.$$amendments({
										sources: xrplRippledSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No XRPL amendments.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionXrplLiquidityAmms({ id, label })}
							<XrplAmmsView
								selection={
									projection
									.$$amms({
										sources: xrplRippledSources,
										limit: 16,
									})
								}
								collapsible={false}
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

						{#snippet SectionHederaChainBlocks({ id, label })}
							<HederaBlocksView
								selection={
									projection
									.$$blocks({
										sources: hederaMirrorNodeRestSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Hedera blocks.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
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

						{#snippet SectionHederaAccounts({ id, label })}
							<HederaAccountsView
								selection={
									projection
									.$$accounts({
										sources: hederaMirrorNodeRestSources,
										limit: 16,
									})
								}
								collapsible={false}
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
				{@const hyperliquidChainActivitySections = [
						...(
							hyperliquidSources.length > 0 ?
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
							hyperliquidSources.length > 0 ?
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
							hyperliquidSources.length > 0 ?
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

						{#snippet SectionHyperliquidChainObservations({ id, label })}
							<HyperliquidNetwork_TimestampsView
								selection={
									projection
									.$$timestamps({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidChainBlocks({ id, label })}
							<HyperliquidBlocksView
								selection={
									projection
									.$$blocks({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidChainTransactions({ id, label })}
							<HyperliquidTransactionsView
								selection={
									projection
									.$$transactions({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const hyperliquidConsensusSections = [
						...(
							hyperliquidSources.length > 0 ?
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

						{#snippet SectionHyperliquidConsensusValidators({ id, label })}
							<HyperliquidValidatorsView
								selection={
									projection
									.$$validators({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const hyperliquidMarketsSections = [
						...(
							hyperliquidSources.length > 0 ?
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
							hyperliquidSources.length > 0 ?
								[
									{
										id: 'hyperliquid-markets-spot-assets',
										label: 'Spot assets',
									},
								]
							:
								[]
						),
						...(
							hyperliquidSources.length > 0 ?
								[
									{
										id: 'hyperliquid-markets-spot-pairs',
										label: 'Spot pairs',
									},
								]
							:
								[]
						),
						...(
							hyperliquidSources.length > 0 ?
								[
									{
										id: 'hyperliquid-markets-vaults',
										label: 'Vaults',
									},
								]
							:
								[]
						),
						...(
							hyperliquidSources.length > 0 ?
								[
									{
										id: 'hyperliquid-markets-borrow-lend-reserves',
										label: 'Borrow/lend reserves',
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

						{#snippet SectionHyperliquidMarketsPerps({ id, label })}
							<HyperliquidPerpMarketsView
								selection={
									projection
									.$$perpMarkets({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Hyperliquid perp markets.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsSpotAssets({ id, label })}
							<HyperliquidSpotAssetsView
								selection={
									projection
									.$$spotAssets({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Hyperliquid spot assets.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsSpotPairs({ id, label })}
							<HyperliquidSpotPairsView
								selection={
									projection
									.$$spotPairs({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Hyperliquid spot pairs.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsVaults({ id, label })}
							<HyperliquidVaultsView
								selection={
									projection
									.$$vaults({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Hyperliquid vaults.'
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsBorrowLendReserves({ id, label })}
							<HyperliquidBorrowLendReservesView
								selection={
									projection
									.$$borrowLendReserves({
										sources: hyperliquidSources,
										limit: 16,
									})
								}
								collapsible={false}
								title={label}
								emptyText='No Hyperliquid borrow/lend reserves.'
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/if}
				{@const hyperliquidResourcesSections = [
						...(
							hyperliquidSources.length > 0 ?
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
							hyperliquidSources.length > 0 ?
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

						{#snippet SectionHyperliquidResourcesRpcEndpoints({ id, label, active })}
							<ResourceBoundary
								resource={
									projection
									.rpcEndpoints({
										sources: hyperliquidSources,
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>RPC</dt>
																<dd>
																	<a
																		href={rpcEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={rpcEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{rpcEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{rpcEndpoint.transportType}
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

						{#snippet SectionHyperliquidResourcesRestEndpoints({ id, label, active })}
							<ResourceBoundary
								resource={
									projection
									.restEndpoints({
										sources: hyperliquidSources,
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
													<li>
														<dl data-column-item="center">
															<div>
																<dt>REST</dt>
																<dd>
																	<a
																		href={restEndpoint.url}
																		target="_blank"
																		rel="noreferrer noopener"
																	>
																		<TruncatedValue value={restEndpoint.url} />
																	</a>
																</dd>
															</div>

															<div>
																<dt>Provider</dt>
																<dd>
																	{restEndpoint.providerName}
																</dd>
															</div>

															<div>
																<dt>Transport</dt>
																<dd>
																	{restEndpoint.transportType}
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
			resource={selection.Quilibrium}
		>
			{#snippet Applicable(projection)}
				{@const quilibriumProtocolDocumentResource = projection
					.$protocolDocument({
						sources: [
							Source.QuilibriumDocs_Rest,
						],
					})}

				<CollapsibleTabs
					id={viewDomId + '-carousel-quilibrium-protocol'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'quilibrium-protocol-document',
								label: 'Protocol document',
								ownsSection: true,
							},
							{
								id: 'quilibrium-protocol-facts',
								label: 'Protocol facts',
								ownsSection: true,
							},
							{
								id: 'quilibrium-service-layers',
								label: 'Service layers',
								ownsSection: true,
							},
							{
								id: 'quilibrium-node-interfaces',
								label: 'Node interfaces',
								ownsSection: true,
							},
							{
								id: 'quilibrium-docs-endpoints',
								label: 'Docs endpoints',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-resources'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Protocol</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerQuilibriumProtocolDocument(_context, Content)}
						<ResourceBoundary
							resource={quilibriumProtocolDocumentResource}
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

					{#snippet SectionQuilibriumProtocolDocument({ id, label, active })}
						<ResourceBoundary
							resource={quilibriumProtocolDocumentResource}
						>
							{#snippet children(specificationProposal)}
								{#if specificationProposal != null}
									{@const specificationProposalInitial = untrack(() => specificationProposal)}
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
											<SpecificationProposalView
												selection={
													select(EntityType.SpecificationProposal, (specificationProposal ?? specificationProposalInitial)[EntityMetaKey.Selector], {
														sources: [
															Source.QuilibriumDocs_Rest,
														],
													})
												}
												prefetched={specificationProposal ?? specificationProposalInitial}
												layout={EntityLayout.SummaryInline}
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

					{#snippet SectionQuilibriumProtocolFacts({ id, label, active })}
						<ResourceBoundary
							resource={projection.protocolFacts}
						>
							{#snippet children(protocolFactsField)}
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
										{#if protocolFactsField.values.length === 0}
											<p data-text="muted">Protocol facts are not listed for this network.</p>
										{/if}

										<ul data-column="gap-2" data-section-state="resolved-nonempty">
											{#each protocolFactsField.values as protocolFact, protocolFactIndex (protocolFactIndex)}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>Fact</dt>
															<dd>
																{protocolFact.label}
															</dd>
														</div>

														<div>
															<dt>Value</dt>
															<dd>
																{protocolFact.value}
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

					{#snippet SectionQuilibriumServiceLayers({ id, label, active })}
						<ResourceBoundary
							resource={projection.serviceLayers}
						>
							{#snippet children(serviceLayersField)}
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
										{#if serviceLayersField.values.length === 0}
											<p data-text="muted">Service layers are not listed for this network.</p>
										{/if}

										<ul data-column="gap-2" data-section-state="resolved-nonempty">
											{#each serviceLayersField.values as serviceLayer, serviceLayerIndex (serviceLayerIndex)}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>Layer</dt>
															<dd>
																{serviceLayer.label}
															</dd>
														</div>

														<div>
															<dt>Description</dt>
															<dd>
																{serviceLayer.description}
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

					{#snippet SectionQuilibriumNodeInterfaces({ id, label, active })}
						<ResourceBoundary
							resource={projection.nodeInterfaces}
						>
							{#snippet children(nodeInterfacesField)}
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
										{#if nodeInterfacesField.values.length === 0}
											<p data-text="muted">Node interfaces are not listed for this network.</p>
										{/if}

										<ul data-column="gap-2" data-section-state="resolved-nonempty">
											{#each nodeInterfacesField.values as nodeInterface, nodeInterfaceIndex (nodeInterfaceIndex)}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>Interface</dt>
															<dd>
																{nodeInterface.label}
															</dd>
														</div>

														<div>
															<dt>Port</dt>
															<dd>
																{nodeInterface.port}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{nodeInterface.transportType}
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

					{#snippet SectionQuilibriumDocsEndpoints({ id, label, active })}
						<ResourceBoundary
							resource={projection.docsEndpoints}
						>
							{#snippet children(docsEndpointsField)}
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
										{#if docsEndpointsField.values.length === 0}
											<p data-text="muted">Docs endpoints are not listed for this network.</p>
										{/if}

										<ul data-column="gap-2" data-section-state="resolved-nonempty">
											{#each docsEndpointsField.values as docsEndpoint, docsEndpointIndex (docsEndpointIndex)}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>URL</dt>
															<dd>
																<a
																	href={docsEndpoint.url}
																	target="_blank"
																	rel="noreferrer noopener"
																>
																	<TruncatedValue value={docsEndpoint.url} />
																</a>
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{docsEndpoint.providerName}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{docsEndpoint.transportType}
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
	{/snippet}
</EntityView>
