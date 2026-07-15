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
	import { beaconRestBaseByExecutionChainId } from '$/constants/BeaconConsensus.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { Caip2Namespace, Caip2Reference, networkByCaip2, networkBySlug, NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.Network>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Network>>
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

	const pendingEntity = $derived(
		(() => {
			const base = { ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }
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
			const beacon = (
				base.caip2 == null ?
					undefined
				:
					beaconRestBaseByExecutionChainId[Number(base.caip2.reference)]
			)

			return {
				...base,
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
	const network = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			namespace: true,
			ledgerModels: true,
			executionModels: true,
			environment: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [pendingEntity.caip2 == null ? '' : String((`${(pendingEntity.caip2).namespace}:${(pendingEntity.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network')
	const viewDomId = $derived('network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
	import EthereumExecutionUpgradesView from '$/views/EthereumExecutionUpgradesView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmNetwork_Txpool_TimestampsView from '$/views/EvmNetwork_Txpool_TimestampsView.svelte'
	import EvmNetwork_GasFee_BlocksView from '$/views/EvmNetwork_GasFee_BlocksView.svelte'
	import EvmNetwork_GasEstimate_TimestampsView from '$/views/EvmNetwork_GasEstimate_TimestampsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
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
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import Erc4337SmartAccountsView from '$/views/Erc4337SmartAccountsView.svelte'
	import Erc4337BundlersView from '$/views/Erc4337BundlersView.svelte'
	import Erc4337PaymastersView from '$/views/Erc4337PaymastersView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import Erc4337AccountFactoriesView from '$/views/Erc4337AccountFactoriesView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import EvmNetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import EvmRollupsView from '$/views/EvmRollupsView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import CosmosValidatorsView from '$/views/CosmosValidatorsView.svelte'
	import CosmosAccountsView from '$/views/CosmosAccountsView.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
	import PolkadotValidatorsView from '$/views/PolkadotValidatorsView.svelte'
	import PolkadotAssetsView from '$/views/PolkadotAssetsView.svelte'
	import PolkadotAssetBalance_TimestampsView from '$/views/PolkadotAssetBalance_TimestampsView.svelte'
	import PolkadotReferendumsView from '$/views/PolkadotReferendumsView.svelte'
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
	import QuilibriumFramesView from '$/views/QuilibriumFramesView.svelte'
	import QuilibriumProversView from '$/views/QuilibriumProversView.svelte'
	import QuilibriumShardsView from '$/views/QuilibriumShardsView.svelte'
	import QuilibriumAccountsView from '$/views/QuilibriumAccountsView.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import NearNetwork_TimestampsView from '$/views/NearNetwork_TimestampsView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import NearValidatorsView from '$/views/NearValidatorsView.svelte'
	import MoneroNetwork_TimestampsView from '$/views/MoneroNetwork_TimestampsView.svelte'
	import MoneroBlocksView from '$/views/MoneroBlocksView.svelte'
	import LightningNetwork_TimestampsView from '$/views/LightningNetwork_TimestampsView.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'
	import BlockheadLightningNodeStatesView from '$/views/BlockheadLightningNodeStatesView.svelte'
	import CardanoNetwork_TimestampsView from '$/views/CardanoNetwork_TimestampsView.svelte'
	import CardanoBlocksView from '$/views/CardanoBlocksView.svelte'
	import CardanoTransactionsView from '$/views/CardanoTransactionsView.svelte'
	import CardanoAddressesView from '$/views/CardanoAddressesView.svelte'
	import CardanoStakeCredentialsView from '$/views/CardanoStakeCredentialsView.svelte'
	import CardanoStakePoolsView from '$/views/CardanoStakePoolsView.svelte'
	import CardanoDRepsView from '$/views/CardanoDRepsView.svelte'
	import CardanoGovernanceProposalsView from '$/views/CardanoGovernanceProposalsView.svelte'
	import CardanoConstitution_EpochsView from '$/views/CardanoConstitution_EpochsView.svelte'
	import CardanoCommittee_EpochsView from '$/views/CardanoCommittee_EpochsView.svelte'
	import CardanoNativeAssetsView from '$/views/CardanoNativeAssetsView.svelte'
	import CardanoProtocolParameters_EpochsView from '$/views/CardanoProtocolParameters_EpochsView.svelte'
	import TronNetwork_TimestampsView from '$/views/TronNetwork_TimestampsView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import TronWitnessesView from '$/views/TronWitnessesView.svelte'
	import TonNetwork_TimestampsView from '$/views/TonNetwork_TimestampsView.svelte'
	import TonWorkchainsView from '$/views/TonWorkchainsView.svelte'
	import TonBlocksView from '$/views/TonBlocksView.svelte'
	import TonTransactionsView from '$/views/TonTransactionsView.svelte'
	import TonTracesView from '$/views/TonTracesView.svelte'
	import TonAccountsView from '$/views/TonAccountsView.svelte'
	import TonContractsView from '$/views/TonContractsView.svelte'
	import TonMessagesView from '$/views/TonMessagesView.svelte'
	import TonJettonsView from '$/views/TonJettonsView.svelte'
	import TonNftCollectionsView from '$/views/TonNftCollectionsView.svelte'
	import TonNftItemsView from '$/views/TonNftItemsView.svelte'
	import HederaNetwork_TimestampsView from '$/views/HederaNetwork_TimestampsView.svelte'
	import HederaBlocksView from '$/views/HederaBlocksView.svelte'
	import HederaTransactionsView from '$/views/HederaTransactionsView.svelte'
	import HederaAccountsView from '$/views/HederaAccountsView.svelte'
	import HederaTokensView from '$/views/HederaTokensView.svelte'
	import HederaNftsView from '$/views/HederaNftsView.svelte'
	import HederaContractsView from '$/views/HederaContractsView.svelte'
	import HederaTopicsView from '$/views/HederaTopicsView.svelte'
	import HederaSchedulesView from '$/views/HederaSchedulesView.svelte'
	import HederaNodesView from '$/views/HederaNodesView.svelte'
	import HederaNetworkFee_TimestampsView from '$/views/HederaNetworkFee_TimestampsView.svelte'
	import HederaNetworkExchangeRate_TimestampsView from '$/views/HederaNetworkExchangeRate_TimestampsView.svelte'
	import HederaNetworkStake_TimestampsView from '$/views/HederaNetworkStake_TimestampsView.svelte'
	import HederaNetworkSupply_TimestampsView from '$/views/HederaNetworkSupply_TimestampsView.svelte'
	import HyperliquidNetwork_TimestampsView from '$/views/HyperliquidNetwork_TimestampsView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
	import HyperliquidValidatorsView from '$/views/HyperliquidValidatorsView.svelte'
	import HyperliquidPerpMarketsView from '$/views/HyperliquidPerpMarketsView.svelte'
	import HyperliquidSpotAssetsView from '$/views/HyperliquidSpotAssetsView.svelte'
	import HyperliquidSpotPairsView from '$/views/HyperliquidSpotPairsView.svelte'
	import HyperliquidVaultsView from '$/views/HyperliquidVaultsView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
			network: String(caip2StringFromValue(pendingEntity.caip2) ?? ''),
		}) : pendingEntity.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
			network: String(pendingEntity.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				<IconComponent />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [pendingEntity.caip2 == null ? '' : String((`${(pendingEntity.caip2).namespace}:${(pendingEntity.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				{@const caip20 = pendingEntity.caip2}
				{#if caip20 !== undefined && caip20 !== null}
					<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const caip20 = resolvedEntity.caip2}
				{#if caip20 !== undefined && caip20 !== null}
					<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
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
			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					{#if pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm')}
					<div>
						<dt>Upgrade</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.$$upgrades({
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
								{#snippet Pending()}{/snippet}

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
											href={
												(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
													upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
													network: String(caip2StringFromValue(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
												}) : ethereumNetworkUpgrade[EntityMetaKey.Selector].slug !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
													upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
													network: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
												}) : undefined)
											}
											prefetched={{ ...ethereumNetworkUpgradeSelector, ...ethereumNetworkUpgrade }}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					{:else if pendingEntity.executionModels === undefined}
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										executionModels: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{#if resolvedEntity.executionModels.values.includes('Evm')}
									<div>
										<dt>Upgrade</dt>
										<dd>
											<ResourceBoundary
												resource={
													projection.$$upgrades({
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
												{#snippet Pending()}{/snippet}

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
															href={
																(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
																	upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
																	network: String(caip2StringFromValue(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
																}) : ethereumNetworkUpgrade[EntityMetaKey.Selector].slug !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
																	upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
																	network: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
																}) : undefined)
															}
															prefetched={{ ...ethereumNetworkUpgradeSelector, ...ethereumNetworkUpgrade }}
															layout={EntityLayout.Value}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					{#if pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm')}
					<div>
						<dt>Block</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.$$blocks({
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
											href={
												(evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
													blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
													network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
												}) : evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
													blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
													network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
												}) : undefined)
											}
											prefetched={{ ...evmBlockSelector, ...evmBlock }}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					{:else if pendingEntity.executionModels === undefined}
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										executionModels: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{#if resolvedEntity.executionModels.values.includes('Evm')}
									<div>
										<dt>Block</dt>
										<dd>
											<ResourceBoundary
												resource={
													projection.$$blocks({
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
															href={
																(evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
																	blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																	network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
																}) : evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
																	blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																	network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
																}) : undefined)
															}
															prefetched={{ ...evmBlockSelector, ...evmBlock }}
															layout={EntityLayout.Value}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					{#if pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm')}
					<div>
						<dt>Epoch</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.$$beaconEpochs({
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
											href={
												(beaconEpoch[EntityMetaKey.Selector].epoch !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
													epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
													network: String(caip2StringFromValue(beaconEpoch[EntityMetaKey.Selector].$network.caip2) ?? ''),
												}) : beaconEpoch[EntityMetaKey.Selector].epoch !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
													epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
													network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
												}) : undefined)
											}
											prefetched={{ ...beaconEpochSelector, ...beaconEpoch }}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					{:else if pendingEntity.executionModels === undefined}
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										executionModels: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{#if resolvedEntity.executionModels.values.includes('Evm')}
									<div>
										<dt>Epoch</dt>
										<dd>
											<ResourceBoundary
												resource={
													projection.$$beaconEpochs({
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
															href={
																(beaconEpoch[EntityMetaKey.Selector].epoch !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
																	epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
																	network: String(caip2StringFromValue(beaconEpoch[EntityMetaKey.Selector].$network.caip2) ?? ''),
																}) : beaconEpoch[EntityMetaKey.Selector].epoch !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
																	epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
																	network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
																}) : undefined)
															}
															prefetched={{ ...beaconEpochSelector, ...beaconEpoch }}
															layout={EntityLayout.Value}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					{#if pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm')}
					<div>
						<dt>Slot</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.$$beaconSlots({
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
											href={
												(beaconSlot[EntityMetaKey.Selector].slot !== undefined && beaconSlot[EntityMetaKey.Selector].$network !== undefined && beaconSlot[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
													slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
													network: String(caip2StringFromValue(beaconSlot[EntityMetaKey.Selector].$network.caip2) ?? ''),
												}) : beaconSlot[EntityMetaKey.Selector].slot !== undefined && beaconSlot[EntityMetaKey.Selector].$network !== undefined && beaconSlot[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
													slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
													network: String(beaconSlot[EntityMetaKey.Selector].$network.slug ?? ''),
												}) : undefined)
											}
											prefetched={{ ...beaconSlotSelector, ...beaconSlot }}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					{:else if pendingEntity.executionModels === undefined}
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										executionModels: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{#if resolvedEntity.executionModels.values.includes('Evm')}
									<div>
										<dt>Slot</dt>
										<dd>
											<ResourceBoundary
												resource={
													projection.$$beaconSlots({
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
															href={
																(beaconSlot[EntityMetaKey.Selector].slot !== undefined && beaconSlot[EntityMetaKey.Selector].$network !== undefined && beaconSlot[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
																	slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
																	network: String(caip2StringFromValue(beaconSlot[EntityMetaKey.Selector].$network.caip2) ?? ''),
																}) : beaconSlot[EntityMetaKey.Selector].slot !== undefined && beaconSlot[EntityMetaKey.Selector].$network !== undefined && beaconSlot[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
																	slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
																	network: String(beaconSlot[EntityMetaKey.Selector].$network.slug ?? ''),
																}) : undefined)
															}
															prefetched={{ ...beaconSlotSelector, ...beaconSlot }}
															layout={EntityLayout.Value}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const name = pendingEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const name = resolvedEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									namespace: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const namespace = pendingEntity.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const namespace = resolvedEntity.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
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
								sources: [
									Source.Constants_Internal,
								],
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
								sources: [
									Source.Constants_Internal,
								],
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

			<ResourceBoundary
				resource={
					selection.$networkStack({
						sources: [
							Source.Constants_Internal,
						],
					})
				}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(networkStack)}
					{#if networkStack != null && networkStack[EntityMetaKey.Selector] != null}
						<div>
							<dt>Network stack</dt>
							<dd>
								<NetworkStackView
									selection={select(EntityType.NetworkStack, networkStack[EntityMetaKey.Selector])}
									prefetched={networkStack}
									href={
										(networkStack[EntityMetaKey.Selector].networkStackId !== undefined ? resolve('/network-stack/[networkStackId=stringSegment]', {
											networkStackId: String(networkStack[EntityMetaKey.Selector].networkStackId ?? ''),
										}) : undefined)
									}
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
						resource={
							selection({
								fields: {
									environment: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const environment = pendingEntity.environment}
							{#if environment !== undefined && environment !== null}
								{String((environment) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const environment = resolvedEntity.environment}
							{#if environment !== undefined && environment !== null}
								{String((environment) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							caip2: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const caip2 = pendingEntity.caip2}
					{#if caip2 !== undefined && caip2 !== null}
						<div>
							<dt>CAIP-2</dt>
							<dd>
								<TruncatedValue value={caip2 == null ? '' : String((`${(caip2).namespace}:${(caip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const caip2 = resolvedEntity.caip2}
					{#if caip2 !== undefined && caip2 !== null}
						<div>
							<dt>CAIP-2</dt>
							<dd>
								<TruncatedValue value={caip2 == null ? '' : String((`${(caip2).namespace}:${(caip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.consensusProtocol({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										consensusProtocol: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(consensusProtocol)}
								{#if consensusProtocol !== undefined && consensusProtocol !== null}
									<div>
										<dt>Consensus</dt>
										<dd>
											{String((consensusProtocolByProtocol[String(consensusProtocol)]?.label ?? (String((consensusProtocol) ?? ''))) ?? '')}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.registryStatus({
									fields: {
										registryStatus: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(registryStatus)}
								{#if registryStatus !== undefined && registryStatus !== null}
									<div>
										<dt>Registry name status</dt>
										<dd>
											{String((registryStatus) ?? '')}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.shortName({
									fields: {
										shortName: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(shortName)}
								{#if shortName !== undefined && shortName !== null}
									<div>
										<dt>Short name</dt>
										<dd>
											{String((shortName) ?? '')}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.peeringId({
									fields: {
										peeringId: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(peeringId)}
								{#if peeringId !== undefined && peeringId !== null}
									<div>
										<dt>Peering ID</dt>
										<dd>
											<NumberValue value={Number(peeringId)} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection.slip44({
									fields: {
										slip44: true,
									},
								})
							}
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(slip44)}
								{#if slip44 !== undefined && slip44 !== null}
									<div>
										<dt>SLIP-44</dt>
										<dd>
											<NumberValue value={Number(slip44)} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.ZeroG}
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
										<NumberValue value={Number(chainId)} />
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
				resource={selection.Lightning}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$settlementNetwork}
						>
							{#snippet Pending()}{/snippet}

							{#snippet children(network)}
								{#if network != null && network[EntityMetaKey.Selector] != null}
									<div>
										<dt>Settlement network</dt>
										<dd>
											<NetworkView
												selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
												prefetched={network}
												href={
													(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
														network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
													}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
														network: String(network[EntityMetaKey.Selector].slug ?? ''),
													}) : undefined)
												}
												layout={EntityLayout.Value}
												open={false}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Hedera}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={
							projection.shard({
								fields: {
									shard: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(shard)}
							{#if shard !== undefined && shard !== null}
								<div>
									<dt>Shard</dt>
									<dd>
										<NumberValue value={Number(shard)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.realm({
								fields: {
									realm: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(realm)}
							{#if realm !== undefined && realm !== null}
								<div>
									<dt>Realm</dt>
									<dd>
										<NumberValue value={Number(realm)} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-execution'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'evm-execution-upgrades',
									label: 'Upgrades',
								},
								{
									id: 'evm-execution-blocks',
									label: 'Blocks',
								},
								{
									id: 'evm-execution-transactions',
									label: 'Transactions',
								},
								{
									id: 'evm-execution-mempool',
									label: 'Mempool',
								},
								{
									id: 'evm-execution-gas-blocks',
									label: 'Fee market',
								},
								{
									id: 'evm-execution-gas-estimates',
									label: 'Gas estimates',
								},
								{
									id: 'evm-execution-endpoints',
									label: 'Endpoints',
								},
							]
						}
						data-card
						class='network-view-collapsible-execution'
						scrollContainerProps={{
							'data-row': 'start align-start',
							class: 'network-carousel-execution',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Execution</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionEvmExecutionUpgrades({ id, label, open })}
							<EthereumExecutionUpgradesView
								selection={
									projection.$$executionUpgrades({
										sources: [
											Source.Constants_Internal,
										],
										limit: 512,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionBlocks({ id, label, open })}
							<EvmBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.Voltaire_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionTransactions({ id, label, open })}
							<EvmTransactionsView
								selection={
									projection.$$transactions({
										sources: [
											Source.Blockscout_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionMempool({ id, label, open })}
							<EvmNetwork_Txpool_TimestampsView
								selection={
									projection.$$txpoolTimestamps({
										sources: [
											Source.Voltaire_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionGasBlocks({ id, label, open })}
							<EvmNetwork_GasFee_BlocksView
								selection={
									projection.$$gasFeeBlocks({
										sources: [
											Source.Voltaire_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionGasEstimates({ id, label, open })}
							<EvmNetwork_GasEstimate_TimestampsView
								selection={
									projection.$$gasEstimateTimestamps({
										sources: [
											Source.Blockscout_Rest,
											Source.Etherscan_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmExecutionEndpoints({ id, label, open })}
							<UrlsView
								selection={
									projection.$$rpcUrls({
										sources: [
											Source.Constants_Internal,
											Source.Chainlist_Rest,
											Source.EthereumLists_Rest,
											Source.Lifi_Rest,
										],
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
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
					<ResourceBoundary resource={projection.consensusProtocol}>
						{#snippet children(projectionConditionValue0)}
							{#if projectionConditionValue0 === 'EthereumBeacon'}
								<CollapsibleTabs
									id={viewDomId + '-carousel-evm-consensus-block-production'}
									sectionIdPrefix={viewDomId}
									sections={
										[
											{
												id: 'evm-consensus-upgrades',
												label: 'Upgrades',
											},
											{
												id: 'evm-consensus-finality',
												label: 'Finality',
											},
											{
												id: 'evm-consensus-committees',
												label: 'Committees',
											},
											{
												id: 'evm-consensus-sync-committees',
												label: 'Sync committees',
											},
											{
												id: 'evm-consensus-attestations',
												label: 'Attestations',
											},
											{
												id: 'evm-consensus-withdrawals',
												label: 'Withdrawals',
											},
											{
												id: 'evm-consensus-slashings',
												label: 'Slashings',
											},
											{
												id: 'evm-consensus-validators',
												label: 'Validators',
											},
											{
												id: 'evm-consensus-epochs',
												label: 'Epochs',
											},
											{
												id: 'evm-consensus-slots',
												label: 'Slots',
											},
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
											},
										]
									}
									data-card
									class='network-view-collapsible-consensus'
									scrollContainerProps={{
										'data-row': 'start align-start',
									}}
								>
									{#snippet Summary({})}
										<header data-row-item="flexible" data-row="wrap gap-4">
											<HeadingComponent>Consensus and block production</HeadingComponent>
										</header>
									{/snippet}

									{#snippet SectionEvmConsensusUpgrades({ id, label, open })}
										<EthereumConsensusUpgradesView
											selection={
												projection.$$consensusUpgrades({
													sources: [
														Source.Constants_Internal,
													],
													limit: 512,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusFinality({ id, label, open })}
										<EthereumBeaconFinality_TimestampsView
											selection={
												projection.$$beaconFinalityTimestamps({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusCommittees({ id, label, open })}
										<BeaconCommitteesView
											selection={
												projection.$$beaconCommittees({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusSyncCommittees({ id, label, open })}
										<BeaconSyncCommitteesView
											selection={
												projection.$$beaconSyncCommittees({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusAttestations({ id, label, open })}
										<BeaconAttestationsView
											selection={
												projection.$$beaconAttestations({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusWithdrawals({ id, label, open })}
										<BeaconWithdrawalsView
											selection={
												projection.$$beaconWithdrawals({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusSlashings({ id, label, open })}
										<BeaconSlashingsView
											selection={
												projection.$$beaconSlashings({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusValidators({ id, label, open })}
										<BeaconValidatorsView
											selection={
												projection.$$beaconValidators({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusEpochs({ id, label, open })}
										<BeaconEpochsView
											selection={
												projection.$$beaconEpochs({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusSlots({ id, label, open })}
										<BeaconSlotsView
											selection={
												projection.$$beaconSlots({
													sources: [
														Source.Beacon_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusMevRelays({ id, label, open })}
										<MevRelaysView
											selection={
												projection.$$mevRelays({
													sources: [
														Source.Constants_Internal,
													],
													limit: 64,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusMevBuilders({ id, label, open })}
										<MevBuildersView
											selection={
												projection.$$mevBuilders({
													sources: [
														Source.MevRelay_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusMevBoost({ id, label, open })}
										<MevRelay_ProposerPayloadDeliveredsView
											selection={
												projection.$$mevProposerPayloadDelivered({
													sources: [
														Source.MevRelay_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmConsensusEndpoints({ id, label, open })}
										<ResourceBoundary
											resource={
												projection.consensusEndpoints({
													sources: [
														Source.Constants_Internal,
													],
												})
											}
										>
											{#snippet children(consensusEndpoints)}
												{#if consensusEndpoints.length > 0}
													<ul data-column="gap-2">
														{#each consensusEndpoints as consensusEndpoint, consensusEndpointIndex (consensusEndpointIndex)}
															{@const restBaseUrlValue = consensusEndpoint.restBaseUrl}
															{@const consensusProtocolValue = consensusEndpoint.consensusProtocol}
															<li>
																<dl data-column-item="center">
																	<div>
																		<dt>REST</dt>
																		<dd>
																			{#if restBaseUrlValue !== undefined && restBaseUrlValue !== null}
																				{String((restBaseUrlValue) ?? '')}
																			{/if}
																		</dd>
																	</div>

																	<div>
																		<dt>Protocol</dt>
																		<dd>
																			{#if consensusProtocolValue !== undefined && consensusProtocolValue !== null}
																				{String((consensusProtocolByProtocol[String(consensusProtocolValue)]?.label ?? (String((consensusProtocolValue) ?? ''))) ?? '')}
																			{/if}
																		</dd>
																	</div>
																</dl>
															</li>
														{/each}
													</ul>
												{:else}
													<p data-text="muted">Consensus endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{/snippet}

								</CollapsibleTabs>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-data-availability'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'evm-data-availability-blobs',
									label: 'Blobs',
								},
							]
						}
						data-card
						class='network-view-collapsible-data-availability'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Data availability</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionEvmDataAvailabilityBlobs({ id, label, open })}
							<EvmBlobsView
								selection={
									projection.$$blobs({
										sources: [
											Source.Voltaire_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
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
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-contracts-accounts'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'evm-contracts-precompiles',
									label: 'Precompiles',
									description: 'Catalog precompiles active at the chain head according to the execution upgrade schedule.',
								},
								{
									id: 'evm-contracts-verified',
									label: 'Verified contracts',
								},
								{
									id: 'evm-contracts-smart-accounts',
									label: 'Smart accounts',
								},
								{
									id: 'evm-contracts-bundlers',
									label: 'Bundlers',
								},
								{
									id: 'evm-contracts-paymasters',
									label: 'Paymasters',
								},
								{
									id: 'evm-contracts-user-operations',
									label: 'User operations',
								},
								{
									id: 'evm-contracts-factories',
									label: 'Factories',
								},
							]
						}
						data-card
						class='network-view-collapsible-contracts-accounts'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Contracts and accounts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionEvmContractsPrecompiles({ id, label, open })}
							<EvmContractsView
								selection={
									projection.$$precompiles({
										sources: [
											Source.Constants_Internal,
										],
										limit: 64,
										count: true,
									})
								}
								href={resolve('/contracts')}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsVerified({ id, label, open })}
							<EvmContractsView
								selection={
									projection.$$contracts({
										sources: [
											Source.Blockscout_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								href={resolve('/contracts')}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsSmartAccounts({ id, label, open })}
							<Erc4337SmartAccountsView
								selection={
									projection.$$erc4337SmartAccounts({
										sources: [
											Source.Blockscout_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsBundlers({ id, label, open })}
							<Erc4337BundlersView
								selection={
									projection.$$erc4337Bundlers({
										sources: [
											Source.Blockscout_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsPaymasters({ id, label, open })}
							<Erc4337PaymastersView
								selection={
									projection.$$erc4337Paymasters({
										sources: [
											Source.Blockscout_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsUserOperations({ id, label, open })}
							<EvmUserOperationsView
								selection={
									projection.$$userOperations({
										sources: [
											Source.Blockscout_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmContractsFactories({ id, label, open })}
							<Erc4337AccountFactoriesView
								selection={
									projection.$$erc4337AccountFactories({
										sources: [
											Source.Blockscout_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
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
								<CollapsibleTabs
									id={viewDomId + '-carousel-evm-assets'}
									sectionIdPrefix={viewDomId}
									sections={
										[
											{
												id: 'evm-assets-native-coin',
												label: 'Native coin',
											},
											{
												id: 'evm-assets-native-instance',
												label: 'Native coin instance',
											},
											{
												id: 'evm-assets-native-assets',
												label: 'Native assets',
											},
											{
												id: 'evm-assets-bridges',
												label: 'Bridges',
											},
											{
												id: 'evm-assets-erc20-transfers',
												label: 'ERC-20 transfers',
											},
											{
												id: 'evm-assets-nft-transfers',
												label: 'NFT transfers',
											},
										]
									}
									data-card
									class='network-view-collapsible-assets'
									scrollContainerProps={{
										'data-row': 'start align-start',
									}}
								>
									{#snippet Summary({})}
										<header data-row-item="flexible" data-row="wrap gap-4">
											<HeadingComponent>Assets</HeadingComponent>
										</header>
									{/snippet}

									{#snippet SectionEvmAssetsNativeCoin({ id, label, open })}
										<ResourceBoundary
											resource={
												projection.$nativeCoin({
													sources: [
														Source.Constants_Internal,
													],
													count: true,
												})
											}
										>
											{#snippet Pending()}{/snippet}

											{#snippet children(coin)}
												{#if coin != null && coin[EntityMetaKey.Selector] != null}
													<CoinView
														selection={select(EntityType.Coin, coin[EntityMetaKey.Selector], { sources: [
						Source.Constants_Internal,
					] })}
														prefetched={coin}
														href={
															(coin[EntityMetaKey.Selector].coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
																coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
															}) : undefined)
														}
														layout={EntityLayout.SummaryInline}
														open={false}
													/>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet SectionEvmAssetsNativeInstance({ id, label, open })}
										<ResourceBoundary
											resource={
												projection.$nativeCoinInstance({
													sources: [
														Source.Constants_Internal,
													],
													count: true,
												})
											}
										>
											{#snippet Pending()}{/snippet}

											{#snippet children(evmCoinInstance)}
												{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
													<EvmCoinInstanceView
														selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector], { sources: [
						Source.Constants_Internal,
					] })}
														prefetched={evmCoinInstance}
														href={
															(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
																chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
																coinInstanceSlug: String('native' ?? ''),
															}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
																coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
																chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
															}) : undefined)
														}
														layout={EntityLayout.SummaryInline}
														open={false}
													/>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet SectionEvmAssetsNativeAssets({ id, label, open })}
										<AssetInstancesView
											selection={
												selection.$$nativeAssets({
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmAssetsBridges({ id, label, open })}
										<EvmNetworkBridgesView
											selection={
												projection.$$bridges({
													sources: [
														Source.Chainlist_Rest,
														Source.EthereumLists_Rest,
														Source.Lifi_Rest,
													],
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmAssetsErc20Transfers({ id, label, open })}
										<EvmTokenTransfersView
											selection={
												projection.$$erc20TokenTransfers({
													sources: [
														Source.Blockscout_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmAssetsNftTransfers({ id, label, open })}
										<EvmTokenTransfersView
											selection={
												projection.$$nftTokenTransfers({
													sources: [
														Source.Blockscout_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
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
					<CollapsibleTabs
						id={viewDomId + '-carousel-evm-resources'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'evm-resources-faucets',
									label: 'Faucets',
								},
								{
									id: 'evm-resources-block-explorers',
									label: 'Block explorers',
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionEvmResourcesFaucets({ id, label, open })}
							<UrlsView
								selection={
									selection.$$faucetUrls({
										sources: [
											Source.Constants_Internal,
											Source.Chainlist_Rest,
										],
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionEvmResourcesBlockExplorers({ id, label, open })}
							<UrlsView
								selection={
									selection.$$blockExplorerUrls({
										sources: [
											Source.Constants_Internal,
											Source.Chainlist_Rest,
											Source.EthereumLists_Rest,
											Source.Lifi_Rest,
										],
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
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
								<CollapsibleTabs
									id={viewDomId + '-carousel-evm-network-relationships'}
									sectionIdPrefix={viewDomId}
									sections={
										[
											{
												id: 'evm-network-relationships-upgrades',
												label: 'Upgrades',
											},
											{
												id: 'evm-network-relationships-parent-layer',
												label: 'Parent',
											},
											{
												id: 'evm-network-relationships-rollup',
												label: 'Rollup',
											},
											{
												id: 'evm-network-relationships-sibling-shards',
												label: 'Shards',
											},
											{
												id: 'evm-network-relationships-testnets',
												label: 'Testnets',
											},
											{
												id: 'evm-network-relationships-mainnet',
												label: 'Mainnet',
											},
											{
												id: 'evm-network-relationships-child-layers',
												label: 'Layers',
											},
											{
												id: 'evm-network-relationships-settled-rollups',
												label: 'Settled rollups',
											},
										]
									}
									data-card
									class='network-view-collapsible-network-relationships'
									scrollContainerProps={{
										'data-row': 'start align-start',
									}}
								>
									{#snippet Summary({})}
										<header data-row-item="flexible" data-row="wrap gap-4">
											<HeadingComponent>Relationships</HeadingComponent>
										</header>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsUpgrades({ id, label, open })}
										<EthereumNetworkUpgradesView
											selection={
												projection.$$upgrades({
													sources: [
														Source.Constants_Internal,
													],
													limit: 512,
													count: true,
												})
											}
											href={resolve('/upgrades')}
											CollapsibleProps={{ canToggle: false }}
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsParentLayer({ id, label, open })}
										<ResourceBoundary
											resource={
												projection.$parent({
													sources: [
														Source.Chainlist_Rest,
														Source.EthereumLists_Rest,
														Source.L2Beat_Rest,
													],
													count: true,
												})
											}
										>
											{#snippet Pending()}{/snippet}

											{#snippet children(network)}
												{#if network == null || network[EntityMetaKey.Selector] == null}
													<p data-text="muted">Parent network is not listed for this network.</p>
												{:else}
													<NetworkView
														selection={select(EntityType.Network, network[EntityMetaKey.Selector], { sources: [
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
						Source.L2Beat_Rest,
					] })}
														prefetched={network}
														href={
															(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
															}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																network: String(network[EntityMetaKey.Selector].slug ?? ''),
															}) : undefined)
														}
														layout={EntityLayout.Summary}
														open={false}
													/>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsRollup({ id, label, open })}
										<ResourceBoundary
											resource={
												projection.$rollup({
													sources: [
														Source.L2Beat_Rest,
													],
													count: true,
												})
											}
										>
											{#snippet Pending()}{/snippet}

											{#snippet children(evmRollup)}
												{#if evmRollup == null || evmRollup[EntityMetaKey.Selector] == null}
													<p data-text="muted">Rollup is not listed for this network.</p>
												{:else}
													<EvmRollupView
														selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector], { sources: [
						Source.L2Beat_Rest,
					] })}
														prefetched={evmRollup}
														href={
															(evmRollup[EntityMetaKey.Selector].projectId !== undefined && evmRollup[EntityMetaKey.Selector].$network !== undefined && evmRollup[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
																projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
																network: String(caip2StringFromValue(evmRollup[EntityMetaKey.Selector].$network.caip2) ?? ''),
															}) : evmRollup[EntityMetaKey.Selector].projectId !== undefined && evmRollup[EntityMetaKey.Selector].$network !== undefined && evmRollup[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
																projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
																network: String(evmRollup[EntityMetaKey.Selector].$network.slug ?? ''),
															}) : undefined)
														}
														layout={EntityLayout.Summary}
														open={false}
													/>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsSiblingShards({ id, label, open })}
										<NetworksView
											selection={
												projection.$$siblingShardNetworks({
													sources: [
														Source.Chainlist_Rest,
														Source.EthereumLists_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											href={resolve('/networks')}
											CollapsibleProps={{ canToggle: false }}
											emptyText='No sibling shard networks listed for this network yet.'
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsTestnets({ id, label, open })}
										<NetworksView
											selection={
												projection.$$testnets({
													sources: [
														Source.Chainlist_Rest,
														Source.EthereumLists_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											href={resolve('/networks')}
											CollapsibleProps={{ canToggle: false }}
											emptyText='No testnets listed for this network yet.'
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsMainnet({ id, label, open })}
										<ResourceBoundary
											resource={
												projection.$mainnet({
													sources: [
														Source.Chainlist_Rest,
														Source.EthereumLists_Rest,
													],
													count: true,
												})
											}
										>
											{#snippet Pending()}{/snippet}

											{#snippet children(network)}
												{#if network == null || network[EntityMetaKey.Selector] == null}
													<p data-text="muted">Mainnet is not listed for this network.</p>
												{:else}
													<NetworkView
														selection={select(EntityType.Network, network[EntityMetaKey.Selector], { sources: [
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
					] })}
														prefetched={network}
														href={
															(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
															}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																network: String(network[EntityMetaKey.Selector].slug ?? ''),
															}) : undefined)
														}
														layout={EntityLayout.Summary}
														open={false}
													/>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsChildLayers({ id, label, open })}
										<NetworksView
											selection={
												projection.$$childLayers({
													sources: [
														Source.Chainlist_Rest,
														Source.EthereumLists_Rest,
														Source.L2Beat_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											href={resolve('/networks')}
											CollapsibleProps={{ canToggle: false }}
											emptyText='No child layer networks listed for this network yet.'
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionEvmNetworkRelationshipsSettledRollups({ id, label, open })}
										<EvmRollupsView
											selection={
												projection.$$settledRollups({
													sources: [
														Source.L2Beat_Rest,
													],
													limit: 16,
													count: true,
												})
											}
											CollapsibleProps={{ canToggle: false }}
											emptyText='No settled rollups listed for this network yet.'
											open={open}
											title={label}
											id={`${id}-list`}
										/>
									{/snippet}

								</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cosmos}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-consensus-block-production'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cosmos-consensus-blocks',
									label: 'Blocks',
								},
								{
									id: 'cosmos-consensus-validators',
									label: 'Validators',
								},
							]
						}
						data-card
						class='network-view-collapsible-consensus'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and block production</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCosmosConsensusBlocks({ id, label, open })}
							<CosmosBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.CosmosSdk_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCosmosConsensusValidators({ id, label, open })}
							<CosmosValidatorsView
								selection={
									projection.$$validators({
										sources: [
											Source.CosmosSdk_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cosmos}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-contracts-accounts'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cosmos-contracts-accounts-accounts',
									label: 'Accounts',
								},
							]
						}
						data-card
						class='network-view-collapsible-contracts-accounts'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Accounts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCosmosContractsAccountsAccounts({ id, label, open })}
							<CosmosAccountsView
								selection={
									projection.$$accounts({
										sources: [
											Source.CosmosSdk_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cosmos}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-governance'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cosmos-governance-proposals',
									label: 'Proposals',
								},
							]
						}
						data-card
						class='network-view-collapsible-governance'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Governance</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCosmosGovernanceProposals({ id, label, open })}
							<CosmosGovernanceProposalsView
								selection={
									projection.$$governanceProposals({
										sources: [
											Source.CosmosSdk_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cosmos}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cosmos-resources'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cosmos-resources-endpoints',
									label: 'Endpoints',
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCosmosResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={projection.restEndpoints}
							>
								{#snippet children(restEndpoints)}
									{#if restEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each restEndpoints as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
												{@const urlValue = rESTEndpoint.url}
												{@const providerNameValue = rESTEndpoint.providerName}
												{@const transportTypeValue = rESTEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>REST</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">REST endpoints are not listed for this network.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Polkadot}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-polkadot-consensus-block-production'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'polkadot-consensus-blocks',
									label: 'Blocks',
								},
								{
									id: 'polkadot-consensus-validators',
									label: 'Validators',
								},
							]
						}
						data-card
						class='network-view-collapsible-consensus'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and block production</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionPolkadotConsensusBlocks({ id, label, open })}
							<PolkadotBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.Polkadot_JsonRpc,
											Source.SubstrateSidecar_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionPolkadotConsensusValidators({ id, label, open })}
							<PolkadotValidatorsView
								selection={
									projection.$$validators({
										sources: [
											Source.Polkadot_JsonRpc,
											Source.SubstrateSidecar_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Polkadot}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-polkadot-assets'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'polkadot-assets-native-assets',
									label: 'Native assets',
								},
								{
									id: 'polkadot-assets-registered',
									label: 'Assets',
								},
								{
									id: 'polkadot-assets-balances',
									label: 'Asset balance observations',
								},
							]
						}
						data-card
						class='network-view-collapsible-assets'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionPolkadotAssetsNativeAssets({ id, label, open })}
							<AssetInstancesView
								selection={
									selection.$$nativeAssets({
										sources: [
											Source.Constants_Internal,
										],
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionPolkadotAssetsRegistered({ id, label, open })}
							<PolkadotAssetsView
								selection={
									projection.$$assets({
										sources: [
											Source.Polkadot_JsonRpc,
											Source.SubstrateSidecar_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionPolkadotAssetsBalances({ id, label, open })}
							<PolkadotAssetBalance_TimestampsView
								selection={
									projection.$$assetBalanceTimestamps({
										sources: [
											Source.Polkadot_JsonRpc,
											Source.SubstrateSidecar_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Polkadot}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-polkadot-governance'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'polkadot-governance-referendums',
									label: 'Referendums',
								},
							]
						}
						data-card
						class='network-view-collapsible-governance'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Governance</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionPolkadotGovernanceReferendums({ id, label, open })}
							<PolkadotReferendumsView
								selection={
									projection.$$referendums({
										sources: [
											Source.Polkadot_JsonRpc,
											Source.SubstrateSidecar_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Polkadot}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-polkadot-resources'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'polkadot-resources-endpoints',
									label: 'Endpoints',
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionPolkadotResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={projection.rpcEndpoints}
							>
								{#snippet children(rpcEndpoints)}
									{#if rpcEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each rpcEndpoints as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
												{@const urlValue = rPCEndpoint.url}
												{@const providerNameValue = rPCEndpoint.providerName}
												{@const transportTypeValue = rPCEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">RPC endpoints are not listed for this network.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Solana}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-execution'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'solana-execution-blocks',
									label: 'Blocks',
								},
								{
									id: 'solana-execution-transactions',
									label: 'Transactions',
								},
							]
						}
						data-card
						class='network-view-collapsible-execution'
						scrollContainerProps={{
							'data-row': 'start align-start',
							class: 'network-carousel-execution',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Execution</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSolanaExecutionBlocks({ id, label, open })}
							<SolanaBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.Solana_JsonRpc,
											Source.Helius_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaExecutionTransactions({ id, label, open })}
							<SolanaTransactionsView
								selection={
									projection.$$transactions({
										sources: [
											Source.Solana_JsonRpc,
											Source.Helius_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Solana}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-consensus-block-production'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'solana-consensus-validators',
									label: 'Validators',
								},
							]
						}
						data-card
						class='network-view-collapsible-consensus'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and block production</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSolanaConsensusValidators({ id, label, open })}
							<SolanaValidatorsView
								selection={
									projection.$$validators({
										sources: [
											Source.Solana_JsonRpc,
											Source.Helius_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Solana}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-contracts-accounts'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'solana-contracts-accounts-accounts',
									label: 'Accounts',
								},
								{
									id: 'solana-contracts-accounts-programs',
									label: 'Programs',
								},
							]
						}
						data-card
						class='network-view-collapsible-contracts-accounts'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Contracts and accounts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSolanaContractsAccountsAccounts({ id, label, open })}
							<SolanaAccountsView
								selection={
									projection.$$accounts({
										sources: [
											Source.Solana_JsonRpc,
											Source.Helius_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaContractsAccountsPrograms({ id, label, open })}
							<SolanaProgramsView
								selection={
									projection.$$programs({
										sources: [
											Source.Solana_JsonRpc,
											Source.Helius_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Solana}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-assets'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'solana-assets-native-assets',
									label: 'Native assets',
								},
								{
									id: 'solana-assets-token-accounts',
									label: 'Token accounts',
								},
								{
									id: 'solana-assets-token-mints',
									label: 'Token mints',
								},
							]
						}
						data-card
						class='network-view-collapsible-assets'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSolanaAssetsNativeAssets({ id, label, open })}
							<AssetInstancesView
								selection={
									selection.$$nativeAssets({
										sources: [
											Source.Constants_Internal,
										],
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaAssetsTokenAccounts({ id, label, open })}
							<SolanaTokenAccountsView
								selection={
									projection.$$tokenAccounts({
										sources: [
											Source.Solana_JsonRpc,
											Source.Helius_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionSolanaAssetsTokenMints({ id, label, open })}
							<SolanaTokenMintsView
								selection={
									projection.$$tokenMints({
										sources: [
											Source.Solana_JsonRpc,
											Source.Helius_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Solana}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-solana-resources'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'solana-resources-endpoints',
									label: 'Endpoints',
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionSolanaResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={projection.rpcEndpoints}
							>
								{#snippet children(rpcEndpoints)}
									{#if rpcEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each rpcEndpoints as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
												{@const urlValue = rPCEndpoint.url}
												{@const providerNameValue = rPCEndpoint.providerName}
												{@const transportTypeValue = rPCEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">RPC endpoints are not listed for this network.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Utxo}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-utxo-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'utxo-consensus-observations',
									label: 'Observations',
								},
								{
									id: 'utxo-consensus-blocks',
									label: 'Blocks',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
							class: 'network-carousel-chain-activity',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionUtxoConsensusObservations({ id, label, open })}
							<Network_TimestampsView
								selection={
									selection.$$timestamps({
										sources: [
											Source.MempoolSpace_Rest,
											Source.Blockchair_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionUtxoConsensusBlocks({ id, label, open })}
							<UtxoBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.MempoolSpace_Rest,
											Source.Blockchair_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Utxo}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-utxo-transaction-graph'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'utxo-execution-transactions',
									label: 'Transactions',
								},
								{
									id: 'utxo-execution-mempool',
									label: 'Mempool',
								},
							]
						}
						data-card
						class='network-view-collapsible-transactions'
						scrollContainerProps={{
							'data-row': 'start align-start',
							class: 'network-carousel-transactions',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Transactions</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionUtxoExecutionTransactions({ id, label, open })}
							<UtxoTransactionsView
								selection={
									projection.$$transactions({
										sources: [
											Source.MempoolSpace_Rest,
											Source.Blockchair_Rest,
											Source.Zcashd_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionUtxoExecutionMempool({ id, label, open })}
							<UtxoTransactionsView
								selection={
									projection.$$transactions({
										sources: [
											Source.MempoolSpace_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Utxo}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-utxo-assets'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'utxo-assets-native-assets',
									label: 'Native assets',
								},
							]
						}
						data-card
						class='network-view-collapsible-assets'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionUtxoAssetsNativeAssets({ id, label, open })}
							<AssetInstancesView
								selection={
									selection.$$nativeAssets({
										sources: [
											Source.Constants_Internal,
										],
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
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
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Shielded protocol</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionZcashShieldedPools({ id, label, open })}
							<ZcashShieldedPoolsView
								selection={
									projection.$$shieldedPools({
										sources: [
											Source.Zcashd_JsonRpc,
										],
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
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
					<CollapsibleTabs
						id={viewDomId + '-carousel-bittensor-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'bittensor-chain-observations',
									label: 'Observations',
								},
								{
									id: 'bittensor-chain-blocks',
									label: 'Blocks',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionBittensorChainObservations({ id, label, open })}
							<BittensorNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.Bittensor_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionBittensorChainBlocks({ id, label, open })}
							<BittensorBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.Bittensor_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
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
					<CollapsibleTabs
						id={viewDomId + '-carousel-bittensor-subnets'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'bittensor-subnets-subnets',
									label: 'Subnets',
								},
							]
						}
						data-card
						class='network-view-collapsible-subnets'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Subnets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionBittensorSubnetsSubnets({ id, label, open })}
							<BittensorSubnetsView
								selection={
									projection.$$subnets({
										sources: [
											Source.Bittensor_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
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
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Storage</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionZeroGStorageObservations({ id, label, open })}
							<ZeroGNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionZeroGStorageNodes({ id, label, open })}
							<ZeroGStorageNodesView
								selection={
									projection.$$storageNodes({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionZeroGStorageDataBlobs({ id, label, open })}
							<ZeroGDataBlobsView
								selection={
									projection.$$dataBlobs({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionZeroGStorageLogEntries({ id, label, open })}
							<ZeroGStorageLogEntriesView
								selection={
									projection.$$storageLogEntries({
										sources: [
											Source.ZeroGStorageScan_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Quilibrium}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-quilibrium-consensus'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'quilibrium-consensus-frames',
									label: 'Frames',
								},
								{
									id: 'quilibrium-consensus-provers',
									label: 'Provers',
								},
							]
						}
						data-card
						class='network-view-collapsible-consensus'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionQuilibriumConsensusFrames({ id, label, open })}
							<QuilibriumFramesView
								selection={
									projection.$$frames({
										sources: [
											Source.QuilibriumNode_Grpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionQuilibriumConsensusProvers({ id, label, open })}
							<QuilibriumProversView
								selection={
									projection.$$provers({
										sources: [
											Source.QuilibriumNode_Grpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Quilibrium}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-quilibrium-state'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'quilibrium-state-shards',
									label: 'Shards',
								},
								{
									id: 'quilibrium-state-accounts',
									label: 'Accounts',
								},
							]
						}
						data-card
						class='network-view-collapsible-state'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>State</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionQuilibriumStateShards({ id, label, open })}
							<QuilibriumShardsView
								selection={
									projection.$$shards({
										sources: [
											Source.QuilibriumNode_Grpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionQuilibriumStateAccounts({ id, label, open })}
							<QuilibriumAccountsView
								selection={
									projection.$$accounts({
										sources: [
											Source.QuilibriumNode_Grpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
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
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionFilecoinChainObservations({ id, label, open })}
							<FilecoinNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.Lotus_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionFilecoinChainTipsets({ id, label, open })}
							<FilecoinTipsetsView
								selection={
									projection.$$tipsets({
										sources: [
											Source.Lotus_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
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
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionFilecoinResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={
									projection.rpcEndpoints({
										sources: [
											Source.Lotus_JsonRpc,
										],
									})
								}
							>
								{#snippet children(rpcEndpoints)}
									{#if rpcEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each rpcEndpoints as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
												{@const urlValue = rPCEndpoint.url}
												{@const providerNameValue = rPCEndpoint.providerName}
												{@const transportTypeValue = rPCEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">RPC endpoints are not listed for this network.</p>
									{/if}
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
					<CollapsibleTabs
						id={viewDomId + '-carousel-near-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'near-chain-observations',
									label: 'Observations',
								},
								{
									id: 'near-chain-blocks',
									label: 'Blocks',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionNearChainObservations({ id, label, open })}
							<NearNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.NearRpc_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionNearChainBlocks({ id, label, open })}
							<NearBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.NearRpc_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Near}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-near-consensus'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'near-consensus-validators',
									label: 'Validators',
								},
							]
						}
						data-card
						class='network-view-collapsible-consensus'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and validators</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionNearConsensusValidators({ id, label, open })}
							<NearValidatorsView
								selection={
									projection.$$validators({
										sources: [
											Source.NearRpc_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
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
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionNearResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={
									projection.rpcEndpoints({
										sources: [
											Source.Constants_Internal,
										],
									})
								}
							>
								{#snippet children(rpcEndpoints)}
									{#if rpcEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each rpcEndpoints as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
												{@const urlValue = rPCEndpoint.url}
												{@const providerNameValue = rPCEndpoint.providerName}
												{@const transportTypeValue = rPCEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">RPC endpoints are not listed for this network.</p>
									{/if}
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
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionMoneroChainObservations({ id, label, open })}
							<MoneroNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.MoneroDaemonRpc_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionMoneroChainBlocks({ id, label, open })}
							<MoneroBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.MoneroDaemonRpc_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
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
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionMoneroResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={
									projection.rpcEndpoints({
										sources: [
											Source.MoneroDaemonRpc_JsonRpc,
										],
									})
								}
							>
								{#snippet children(rpcEndpoints)}
									{#if rpcEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each rpcEndpoints as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
												{@const urlValue = rPCEndpoint.url}
												{@const providerNameValue = rPCEndpoint.providerName}
												{@const transportTypeValue = rPCEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">RPC endpoints are not listed for this network.</p>
									{/if}
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
					<CollapsibleTabs
						id={viewDomId + '-carousel-lightning-network-graph'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'lightning-network-observations',
									label: 'Observations',
								},
								{
									id: 'lightning-network-nodes',
									label: 'Nodes',
								},
								{
									id: 'lightning-network-channels',
									label: 'Channels',
								},
							]
						}
						data-card
						class='network-view-collapsible-network-graph'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Network graph</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionLightningNetworkObservations({ id, label, open })}
							<LightningNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.LightningMempoolSpace_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionLightningNetworkNodes({ id, label, open })}
							<LightningNodesView
								selection={
									projection.$$nodes({
										sources: [
											Source.LightningMempoolSpace_Rest,
											Source.LightningLnd_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionLightningNetworkChannels({ id, label, open })}
							<LightningChannelsView
								selection={
									projection.$$channels({
										sources: [
											Source.LightningMempoolSpace_Rest,
											Source.LightningLnd_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Lightning}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-lightning-local'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'lightning-local-invoices',
									label: 'Invoices',
								},
								{
									id: 'lightning-local-payments',
									label: 'Payments',
								},
								{
									id: 'lightning-local-node-states',
									label: 'Node states',
								},
							]
						}
						data-card
						class='network-view-collapsible-local-node-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Local node activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionLightningLocalInvoices({ id, label, open })}
							<BlockheadLightningInvoicesView
								selection={
									projection.$$invoices({
										sources: [
											Source.LightningLnd_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionLightningLocalPayments({ id, label, open })}
							<BlockheadLightningPaymentsView
								selection={
									projection.$$payments({
										sources: [
											Source.LightningLnd_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionLightningLocalNodeStates({ id, label, open })}
							<BlockheadLightningNodeStatesView
								selection={
									projection.$$localNodeStates({
										sources: [
											Source.Local_Internal,
											Source.LightningLnd_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cardano}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cardano-chain-observations',
									label: 'Observations',
								},
								{
									id: 'cardano-chain-blocks',
									label: 'Blocks',
								},
								{
									id: 'cardano-chain-transactions',
									label: 'Transactions',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoChainObservations({ id, label, open })}
							<CardanoNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.Blockfrost_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoChainBlocks({ id, label, open })}
							<CardanoBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.Blockfrost_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoChainTransactions({ id, label, open })}
							<CardanoTransactionsView
								selection={
									projection.$$transactions({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cardano}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-stake-delegation'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cardano-stake-addresses',
									label: 'Addresses',
								},
								{
									id: 'cardano-stake-credentials',
									label: 'Stake credentials',
								},
								{
									id: 'cardano-stake-pools',
									label: 'Stake pools',
								},
							]
						}
						data-card
						class='network-view-collapsible-stake-delegation'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Stake and delegation</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoStakeAddresses({ id, label, open })}
							<CardanoAddressesView
								selection={
									projection.$$addresses({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoStakeCredentials({ id, label, open })}
							<CardanoStakeCredentialsView
								selection={
									projection.$$stakeCredentials({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoStakePools({ id, label, open })}
							<CardanoStakePoolsView
								selection={
									projection.$$stakePools({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cardano}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-governance'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cardano-governance-dreps',
									label: 'DReps',
								},
								{
									id: 'cardano-governance-proposals',
									label: 'Proposals',
								},
								{
									id: 'cardano-governance-constitution',
									label: 'Constitution epochs',
								},
								{
									id: 'cardano-governance-committee',
									label: 'Committee epochs',
								},
							]
						}
						data-card
						class='network-view-collapsible-governance'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Governance</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoGovernanceDreps({ id, label, open })}
							<CardanoDRepsView
								selection={
									projection.$$dReps({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoGovernanceProposals({ id, label, open })}
							<CardanoGovernanceProposalsView
								selection={
									projection.$$governanceProposals({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoGovernanceConstitution({ id, label, open })}
							<CardanoConstitution_EpochsView
								selection={
									projection.$$constitutionEpochs({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoGovernanceCommittee({ id, label, open })}
							<CardanoCommittee_EpochsView
								selection={
									projection.$$committeeEpochs({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cardano}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-assets-protocol'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cardano-assets-native',
									label: 'Native assets',
								},
								{
									id: 'cardano-protocol-parameters',
									label: 'Protocol parameters',
								},
							]
						}
						data-card
						class='network-view-collapsible-assets'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets and protocol</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoAssetsNative({ id, label, open })}
							<CardanoNativeAssetsView
								selection={
									projection.$$assets({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionCardanoProtocolParameters({ id, label, open })}
							<CardanoProtocolParameters_EpochsView
								selection={
									projection.$$protocolParameterEpochs({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Cardano}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-cardano-resources'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'cardano-resources-endpoints',
									label: 'Endpoints',
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCardanoResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={
									projection.restEndpoints({
										sources: [
											Source.Blockfrost_Rest,
										],
									})
								}
							>
								{#snippet children(restEndpoints)}
									{#if restEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each restEndpoints as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
												{@const urlValue = rESTEndpoint.url}
												{@const providerNameValue = rESTEndpoint.providerName}
												{@const transportTypeValue = rESTEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>REST</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">REST endpoints are not listed for this network.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Tron}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-tron-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'tron-chain-observations',
									label: 'Observations',
								},
								{
									id: 'tron-chain-blocks',
									label: 'Blocks',
								},
								{
									id: 'tron-chain-witnesses',
									label: 'Witnesses',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTronChainObservations({ id, label, open })}
							<TronNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.TronGrid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTronChainBlocks({ id, label, open })}
							<TronBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.TronGrid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTronChainWitnesses({ id, label, open })}
							<TronWitnessesView
								selection={
									projection.$$witnesses({
										sources: [
											Source.TronGrid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Tron}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-tron-resources'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'tron-resources-endpoints',
									label: 'Endpoints',
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTronResourcesEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={
									projection.restEndpoints({
										sources: [
											Source.TronGrid_Rest,
										],
									})
								}
							>
								{#snippet children(restEndpoints)}
									{#if restEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each restEndpoints as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
												{@const urlValue = rESTEndpoint.url}
												{@const providerNameValue = rESTEndpoint.providerName}
												{@const transportTypeValue = rESTEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>REST</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">REST endpoints are not listed for this network.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Ton}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-ton-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'ton-chain-observations',
									label: 'Observations',
								},
								{
									id: 'ton-chain-workchains',
									label: 'Workchains',
								},
								{
									id: 'ton-chain-blocks',
									label: 'Blocks',
								},
								{
									id: 'ton-chain-transactions',
									label: 'Transactions',
								},
								{
									id: 'ton-chain-traces',
									label: 'Traces',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTonChainObservations({ id, label, open })}
							<TonNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON network observations.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonChainWorkchains({ id, label, open })}
							<TonWorkchainsView
								selection={
									projection.$$workchains({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON workchains.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonChainBlocks({ id, label, open })}
							<TonBlocksView
								selection={
									projection.$$blocks({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON blocks.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonChainTransactions({ id, label, open })}
							<TonTransactionsView
								selection={
									projection.$$transactions({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON transactions.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonChainTraces({ id, label, open })}
							<TonTracesView
								selection={
									projection.$$traces({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON traces.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Ton}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-ton-accounts-contracts'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'ton-accounts',
									label: 'Accounts',
								},
								{
									id: 'ton-contracts',
									label: 'Contracts',
								},
								{
									id: 'ton-messages',
									label: 'Messages',
								},
							]
						}
						data-card
						class='network-view-collapsible-accounts-contracts'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Accounts and contracts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTonAccounts({ id, label, open })}
							<TonAccountsView
								selection={
									projection.$$accounts({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON accounts.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonContracts({ id, label, open })}
							<TonContractsView
								selection={
									projection.$$contracts({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON contracts.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonMessages({ id, label, open })}
							<TonMessagesView
								selection={
									projection.$$messages({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON messages.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Ton}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-ton-assets'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'ton-jettons',
									label: 'Jettons',
								},
								{
									id: 'ton-nft-collections',
									label: 'NFT collections',
								},
								{
									id: 'ton-nft-items',
									label: 'NFT items',
								},
							]
						}
						data-card
						class='network-view-collapsible-assets'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Jettons and NFTs</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTonJettons({ id, label, open })}
							<TonJettonsView
								selection={
									projection.$$jettons({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON jettons.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonNftCollections({ id, label, open })}
							<TonNftCollectionsView
								selection={
									projection.$$nftCollections({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON NFT collections.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionTonNftItems({ id, label, open })}
							<TonNftItemsView
								selection={
									projection.$$nftItems({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No TON NFT items.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hedera}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hedera-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hedera-chain-observations',
									label: 'Observations',
								},
								{
									id: 'hedera-chain-blocks',
									label: 'Blocks',
								},
								{
									id: 'hedera-chain-transactions',
									label: 'Transactions',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHederaChainObservations({ id, label, open })}
							<HederaNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera network observations.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaChainBlocks({ id, label, open })}
							<HederaBlocksView
								selection={
									projection.$$blocks({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera blocks.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaChainTransactions({ id, label, open })}
							<HederaTransactionsView
								selection={
									projection.$$transactions({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera transactions.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hedera}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hedera-accounts-tokens'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hedera-accounts',
									label: 'Accounts',
								},
								{
									id: 'hedera-tokens',
									label: 'Tokens',
								},
								{
									id: 'hedera-nfts',
									label: 'NFTs',
								},
							]
						}
						data-card
						class='network-view-collapsible-accounts-tokens'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Accounts and tokens</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHederaAccounts({ id, label, open })}
							<HederaAccountsView
								selection={
									projection.$$accounts({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera accounts.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaTokens({ id, label, open })}
							<HederaTokensView
								selection={
									projection.$$tokens({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera tokens.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaNfts({ id, label, open })}
							<HederaNftsView
								selection={
									projection.$$nfts({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera NFTs.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hedera}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hedera-contracts-messaging'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hedera-contracts',
									label: 'Contracts',
								},
								{
									id: 'hedera-topics',
									label: 'Topics',
								},
								{
									id: 'hedera-schedules',
									label: 'Schedules',
								},
								{
									id: 'hedera-nodes',
									label: 'Nodes',
								},
							]
						}
						data-card
						class='network-view-collapsible-contracts-messaging'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Contracts and messaging</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHederaContracts({ id, label, open })}
							<HederaContractsView
								selection={
									projection.$$contracts({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera contracts.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaTopics({ id, label, open })}
							<HederaTopicsView
								selection={
									projection.$$topics({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera topics.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaSchedules({ id, label, open })}
							<HederaSchedulesView
								selection={
									projection.$$schedules({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera schedules.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaNodes({ id, label, open })}
							<HederaNodesView
								selection={
									projection.$$nodes({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera nodes.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hedera}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hedera-network-observations'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hedera-fee-observations',
									label: 'Fees',
								},
								{
									id: 'hedera-exchange-observations',
									label: 'Exchange rates',
								},
								{
									id: 'hedera-stake-observations',
									label: 'Stake',
								},
								{
									id: 'hedera-supply-observations',
									label: 'Supply',
								},
							]
						}
						data-card
						class='network-view-collapsible-network-observations'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Fees, exchange, stake, and supply</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHederaFeeObservations({ id, label, open })}
							<HederaNetworkFee_TimestampsView
								selection={
									projection.$$feeTimestamps({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera fee observations.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaExchangeObservations({ id, label, open })}
							<HederaNetworkExchangeRate_TimestampsView
								selection={
									projection.$$exchangeRateTimestamps({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera exchange-rate observations.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaStakeObservations({ id, label, open })}
							<HederaNetworkStake_TimestampsView
								selection={
									projection.$$stakeTimestamps({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera stake observations.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHederaSupplyObservations({ id, label, open })}
							<HederaNetworkSupply_TimestampsView
								selection={
									projection.$$supplyTimestamps({
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								emptyText='No Hedera supply observations.'
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-chain-activity'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hyperliquid-chain-observations',
									label: 'Observations',
								},
								{
									id: 'hyperliquid-chain-blocks',
									label: 'Blocks',
								},
								{
									id: 'hyperliquid-chain-transactions',
									label: 'Transactions',
								},
							]
						}
						data-card
						class='network-view-collapsible-chain-activity'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Chain activity</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidChainObservations({ id, label, open })}
							<HyperliquidNetwork_TimestampsView
								selection={
									projection.$$timestamps({
										sources: [
											Source.Hyperliquid_Rest,
											Source.Hyperliquid_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidChainBlocks({ id, label, open })}
							<HyperliquidBlocksView
								selection={
									projection.$$blocks({
										sources: [
											Source.Hyperliquid_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidChainTransactions({ id, label, open })}
							<HyperliquidTransactionsView
								selection={
									projection.$$transactions({
										sources: [
											Source.Hyperliquid_JsonRpc,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-consensus'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hyperliquid-consensus-validators',
									label: 'Validators',
								},
							]
						}
						data-card
						class='network-view-collapsible-consensus'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Consensus and validators</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidConsensusValidators({ id, label, open })}
							<HyperliquidValidatorsView
								selection={
									projection.$$validators({
										sources: [
											Source.Hyperliquid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-markets'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hyperliquid-markets-perps',
									label: 'Perps',
								},
								{
									id: 'hyperliquid-markets-spot-assets',
									label: 'Spot assets',
								},
								{
									id: 'hyperliquid-markets-spot-pairs',
									label: 'Spot pairs',
								},
								{
									id: 'hyperliquid-markets-vaults',
									label: 'Vaults',
								},
							]
						}
						data-card
						class='network-view-collapsible-markets'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Markets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidMarketsPerps({ id, label, open })}
							<HyperliquidPerpMarketsView
								selection={
									projection.$$perpMarkets({
										sources: [
											Source.Hyperliquid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsSpotAssets({ id, label, open })}
							<HyperliquidSpotAssetsView
								selection={
									projection.$$spotAssets({
										sources: [
											Source.Hyperliquid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsSpotPairs({ id, label, open })}
							<HyperliquidSpotPairsView
								selection={
									projection.$$spotPairs({
										sources: [
											Source.Hyperliquid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionHyperliquidMarketsVaults({ id, label, open })}
							<HyperliquidVaultsView
								selection={
									projection.$$vaults({
										sources: [
											Source.Hyperliquid_Rest,
										],
										limit: 16,
										count: true,
									})
								}
								CollapsibleProps={{ canToggle: false }}
								open={open}
								title={label}
								id={`${id}-list`}
							/>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet Applicable(projection)}
					<CollapsibleTabs
						id={viewDomId + '-carousel-hyperliquid-resources'}
						sectionIdPrefix={viewDomId}
						sections={
							[
								{
									id: 'hyperliquid-resources-rpc-endpoints',
									label: 'RPC endpoints',
								},
								{
									id: 'hyperliquid-resources-rest-endpoints',
									label: 'REST endpoints',
								},
							]
						}
						data-card
						class='network-view-collapsible-resources'
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionHyperliquidResourcesRpcEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={projection.rpcEndpoints}
							>
								{#snippet children(rpcEndpoints)}
									{#if rpcEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each rpcEndpoints as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
												{@const urlValue = rPCEndpoint.url}
												{@const providerNameValue = rPCEndpoint.providerName}
												{@const transportTypeValue = rPCEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>RPC</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">RPC endpoints are not listed for this network.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionHyperliquidResourcesRestEndpoints({ id, label, open })}
							<ResourceBoundary
								resource={projection.restEndpoints}
							>
								{#snippet children(restEndpoints)}
									{#if restEndpoints.length > 0}
										<ul data-column="gap-2">
											{#each restEndpoints as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
												{@const urlValue = rESTEndpoint.url}
												{@const providerNameValue = rESTEndpoint.providerName}
												{@const transportTypeValue = rESTEndpoint.transportType}
												<li>
													<dl data-column-item="center">
														<div>
															<dt>REST</dt>
															<dd>
																{#if urlValue !== undefined && urlValue !== null}
																	{String((urlValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Provider</dt>
															<dd>
																{#if providerNameValue !== undefined && providerNameValue !== null}
																	{String((providerNameValue) ?? '')}
																{/if}
															</dd>
														</div>

														<div>
															<dt>Transport</dt>
															<dd>
																{#if transportTypeValue !== undefined && transportTypeValue !== null}
																	{String((transportTypeValue) ?? '')}
																{/if}
															</dd>
														</div>
													</dl>
												</li>
											{/each}
										</ul>
									{:else}
										<p data-text="muted">REST endpoints are not listed for this network.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}

					</CollapsibleTabs>
				{/snippet}
			</ProjectionBoundary>
		{/if}
	{/snippet}
</EntityView>
