<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import Projection from '$/components/Projection.svelte'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { SourceTargetKind } from '$/sources/SourceBinding.ts'
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
	const networkTargetKeysBySource = new Map<
		Source,
		readonly { kind: SourceTargetKind; key: string }[]
	>([
		[Source.Voltaire_JsonRpc, [
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:1' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:10' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:50' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:51' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:56' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:130' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:137' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:143' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:146' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:300' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:324' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:480' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:998' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:999' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:1301' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:1328' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:1329' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:4801' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:8453' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:10143' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:14601' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:42161' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:42220' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:43113' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:43114' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:57073' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:59141' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:59144' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:80002' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:81224' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:84532' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:98866' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:98867' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:421614' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:763373' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:812242' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:5042002' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:11142220' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:11155111' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:11155420' },
		]],
		[Source.Blockscout_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:1' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:10' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:100' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:137' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:8453' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:42161' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:11155111' },
		]],
		[Source.Beacon_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:1' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:11155111' },
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:17000' },
		]],
		[Source.CosmosSdk_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'cosmos:cosmoshub-4' },
		]],
		[Source.Polkadot_JsonRpc, [
			{ kind: SourceTargetKind.Caip2Network, key: 'polkadot:91b171bb158e2d3848fa23a9f1c25182' },
		]],
		[Source.Solana_JsonRpc, [
			{ kind: SourceTargetKind.Caip2Network, key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' },
		]],
		[Source.MempoolSpace_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'bip122:000000000019d6689c085ae165831e93' },
		]],
		[Source.Zcashd_JsonRpc, [
			{ kind: SourceTargetKind.Caip2Network, key: 'bip122:00040fe8ec8471911baa1db1266ea15' },
		]],
		[Source.Bittensor_JsonRpc, [
			{ kind: SourceTargetKind.NetworkSlug, key: 'bittensor' },
		]],
		[Source.NearRpc_JsonRpc, [
			{ kind: SourceTargetKind.NetworkSlug, key: 'near' },
		]],
		[Source.LightningMempoolSpace_Rest, [
			{ kind: SourceTargetKind.NetworkSlug, key: 'lightning' },
		]],
		[Source.CardanoKoios_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'cip34:1-764824073' },
		]],
		[Source.Blockfrost_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'cip34:1-764824073' },
		]],
		[Source.TronGrid_Rest, [
			{ kind: SourceTargetKind.NetworkSlug, key: 'tron' },
		]],
		[Source.Xrpl_Rippled, [
			{ kind: SourceTargetKind.Caip2Network, key: 'xrpl:0' },
		]],
		[Source.HederaMirrorNode_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'hedera:mainnet' },
		]],
		[Source.Hyperliquid_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:999' },
		]],
		[Source.Hyperliquid_JsonRpc, [
			{ kind: SourceTargetKind.Caip2Network, key: 'eip155:999' },
		]],
	])

	const networkApplicableSources = (
		sources: readonly Source[],
		network: {
			slug: string
			caip2?: {
				namespace: string
				reference: string
			}
		}
	) => sources.filter((source) => {
		const targets = networkTargetKeysBySource.get(source)
		return targets == null || targets.some((target) => (
			target.kind === SourceTargetKind.NetworkSlug ?
				target.key === network.slug
				:
				network.caip2 != null && target.key === `${network.caip2.namespace}:${network.caip2.reference}`
		))
	})

	const network = $derived(selection({
		sources: selection.sources,
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
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
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
			{#snippet children(entity)}
				<IconComponent />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={network}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const caip20 = pendingEntity.caip2}
					{#if caip20 !== undefined && caip20 !== null}
						<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={network}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const caip20 = resolvedEntity.caip2}
					{#if caip20 !== undefined && caip20 !== null}
						<TruncatedValue value={caip20 == null ? '' : String((`${(caip20).namespace}:${(caip20).reference}`) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
				{#snippet Applicable(_projection)}
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
											{:else}
												<p data-text="muted" data-section-state="resolved-empty">No upgrade available.</p>
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
												Source.L2Beat_Rest,
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
															{:else}
																<p data-text="muted" data-section-state="resolved-empty">No upgrade available.</p>
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
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(_projection)}
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
											{:else}
												<p data-text="muted" data-section-state="resolved-empty">No block available.</p>
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
												Source.L2Beat_Rest,
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
															{:else}
																<p data-text="muted" data-section-state="resolved-empty">No block available.</p>
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
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(_projection)}
					<ProjectionBoundary
						resource={selection.Evm}
					>
						{#snippet Applicable(projection)}
							{#if pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm')}
							<div>
								<dt>Fee market</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection.$$gasFeeBlocks({
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
													href={
														(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
															blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
															network: String(caip2StringFromValue(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
														}) : evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
															blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
															network: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug ?? ''),
														}) : undefined)
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
							{:else if pendingEntity.executionModels === undefined}
								<ResourceBoundary
									resource={
										selection({
											sources: [
												Source.Constants_Internal,
												Source.L2Beat_Rest,
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
												<dt>Fee market</dt>
												<dd>
													<ResourceBoundary
														resource={
															projection.$$gasFeeBlocks({
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
																	href={
																		(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
																			blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																			network: String(caip2StringFromValue(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
																		}) : evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network !== undefined && evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
																			blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																			network: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug ?? ''),
																		}) : undefined)
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
									{/snippet}
								</ResourceBoundary>
							{/if}
						{/snippet}
					</ProjectionBoundary>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm}
			>
				{#snippet Applicable(_projection)}
					<ProjectionBoundary
						resource={selection.Evm}
					>
						{#snippet Applicable(projection)}
							{#if pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm')}
							<div>
								<dt>Mempool</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection.$$txpoolTimestamps({
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
													href={
														(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
															timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
															source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
															network: String(caip2StringFromValue(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
														}) : evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
															timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
															source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
															network: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
														}) : undefined)
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
							{:else if pendingEntity.executionModels === undefined}
								<ResourceBoundary
									resource={
										selection({
											sources: [
												Source.Constants_Internal,
												Source.L2Beat_Rest,
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
												<dt>Mempool</dt>
												<dd>
													<ResourceBoundary
														resource={
															projection.$$txpoolTimestamps({
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
																	href={
																		(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
																			timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
																			source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
																			network: String(caip2StringFromValue(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
																		}) : evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network !== undefined && evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
																			timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
																			source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
																			network: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
																		}) : undefined)
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
									{/snippet}
								</ResourceBoundary>
							{/if}
						{/snippet}
					</ProjectionBoundary>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm.EthereumBeacon}
			>
				{#snippet Applicable(_projection)}
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
											{:else}
												<p data-text="muted" data-section-state="resolved-empty">No epoch available.</p>
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
												Source.L2Beat_Rest,
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
															{:else}
																<p data-text="muted" data-section-state="resolved-empty">No epoch available.</p>
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
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Evm.EthereumBeacon}
			>
				{#snippet Applicable(_projection)}
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
											{:else}
												<p data-text="muted" data-section-state="resolved-empty">No slot available.</p>
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
												Source.L2Beat_Rest,
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
															{:else}
																<p data-text="muted" data-section-state="resolved-empty">No slot available.</p>
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
								sources: selection.sources,
								fields: {
									name: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									namespace: true,
								},
							})
						}
					>
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

			<ResourceBoundary
				resource={
					selection.$networkStack({
						sources: [
							Source.Constants_Internal,
							Source.L2Beat_Rest,
						],
					})
				}
			>
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
								sources: selection.sources,
								fields: {
									environment: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							caip2: true,
						},
					})
				}
			>
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
								})
							}
						>
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
							resource={projection.registryStatus}
						>
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
							resource={projection.shortName}
						>
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
							resource={projection.peeringId}
						>
							{#snippet children(peeringId)}
								{#if peeringId !== undefined && peeringId !== null}
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
								{#if slip44 !== undefined && slip44 !== null}
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
							resource={
								projection.$nativeCoinInstance({
									sources: [
										Source.Constants_Internal,
									],
								})
							}
						>
							{#snippet children(evmCoinInstance)}
								{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
									<div>
										<dt>Native currency</dt>
										<dd>
											<EvmCoinInstanceView
												selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
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
							resource={
								projection.$nativeCoin({
									sources: [
										Source.Constants_Internal,
									],
								})
							}
						>
							{#snippet children(coin)}
								{#if coin != null && coin[EntityMetaKey.Selector] != null}
									<div>
										<dt>Native coin</dt>
										<dd>
											<CoinView
												selection={select(EntityType.Coin, coin[EntityMetaKey.Selector])}
												prefetched={coin}
												href={
													(coin[EntityMetaKey.Selector].coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
														coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
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

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$parent}
						>
							{#snippet children(network)}
								{#if network != null && network[EntityMetaKey.Selector] != null}
									<div>
										<dt>Parent</dt>
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

					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$mainnet}
						>
							{#snippet children(network)}
								{#if network != null && network[EntityMetaKey.Selector] != null}
									<div>
										<dt>Mainnet</dt>
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
				resource={selection.ZeroG}
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
										<NumberValue
											value={chainId}
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
				resource={selection.Lightning}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<ResourceBoundary
							resource={projection.$settlementNetwork}
						>
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
						resource={projection.shard}
					>
						{#snippet children(shard)}
							{#if shard !== undefined && shard !== null}
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
							{#if realm !== undefined && realm !== null}
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
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ResourceBoundary
				resource={selection.Evm}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
						{#snippet Applicable(projection)}
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
													},
													{
														id: 'evm-network-topology-rollup',
														label: 'Rollup',
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
													selection={
														projection.$$upgrades({
															sources: networkApplicableSources([
																Source.Constants_Internal,
															], pendingEntity),
															limit: 512,
														})
													}
													href={resolve('/upgrades')}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No upgrades available.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

											{#snippet SectionEvmNetworkTopologyParentLayer({ id, label, open })}
												<article
													id={`${id}-list`}
													data-column-item="flexible"
													data-card
													data-scroll-container
												>
													<ResourceBoundary
														resource={
															projection.$parent({
																sources: networkApplicableSources([
																	Source.Chainlist_Rest,
																	Source.EthereumLists_Rest,
																	Source.L2Beat_Rest,
																], pendingEntity),
															})
														}
													>
														{#snippet children(network)}
															{#if network == null || network[EntityMetaKey.Selector] == null}
																<p data-text="muted" data-section-state="resolved-empty">Parent network is not listed for this network.</p>
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
																	layout={EntityLayout.SummaryInline}
																	open={false}
																/>
															{/if}
														{/snippet}
													</ResourceBoundary>
												</article>
											{/snippet}

											{#snippet SectionEvmNetworkTopologyRollup({ id, label, open })}
												<article
													id={`${id}-list`}
													data-column-item="flexible"
													data-card
													data-scroll-container
												>
													<ResourceBoundary
														resource={
															projection.$rollup({
																sources: networkApplicableSources([
																	Source.L2Beat_Rest,
																], pendingEntity),
															})
														}
													>
														{#snippet children(evmRollup)}
															{#if evmRollup == null || evmRollup[EntityMetaKey.Selector] == null}
																<p data-text="muted" data-section-state="resolved-empty">Rollup is not listed for this network.</p>
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
																	layout={EntityLayout.SummaryInline}
																	open={false}
																/>
															{/if}
														{/snippet}
													</ResourceBoundary>
												</article>
											{/snippet}

											{#snippet SectionEvmNetworkTopologySiblingShards({ id, label, open })}
												<NetworksView
													selection={
														projection.$$siblingShardNetworks({
															sources: networkApplicableSources([
																Source.Chainlist_Rest,
																Source.EthereumLists_Rest,
															], pendingEntity),
															limit: 16,
														})
													}
													href={resolve('/networks')}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No sibling shard networks listed for this network yet.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

											{#snippet SectionEvmNetworkTopologyTestnets({ id, label, open })}
												<NetworksView
													selection={
														projection.$$testnets({
															sources: networkApplicableSources([
																Source.Chainlist_Rest,
																Source.EthereumLists_Rest,
															], pendingEntity),
															limit: 16,
														})
													}
													href={resolve('/networks')}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No testnets listed for this network yet.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

											{#snippet SectionEvmNetworkTopologyMainnet({ id, label, open })}
												<article
													id={`${id}-list`}
													data-column-item="flexible"
													data-card
													data-scroll-container
												>
													<ResourceBoundary
														resource={
															projection.$mainnet({
																sources: networkApplicableSources([
																	Source.Chainlist_Rest,
																	Source.EthereumLists_Rest,
																], pendingEntity),
															})
														}
													>
														{#snippet children(network)}
															{#if network == null || network[EntityMetaKey.Selector] == null}
																<p data-text="muted" data-section-state="resolved-empty">Mainnet is not listed for this network.</p>
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
																	layout={EntityLayout.SummaryInline}
																	open={false}
																/>
															{/if}
														{/snippet}
													</ResourceBoundary>
												</article>
											{/snippet}

											{#snippet SectionEvmNetworkTopologyChildLayers({ id, label, open })}
												<NetworksView
													selection={
														projection.$$childLayers({
															sources: networkApplicableSources([
																Source.Chainlist_Rest,
																Source.EthereumLists_Rest,
																Source.L2Beat_Rest,
															], pendingEntity),
															limit: 16,
														})
													}
													href={resolve('/networks')}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No child layer networks listed for this network yet.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

											{#snippet SectionEvmNetworkTopologySettledRollups({ id, label, open })}
												<EvmRollupsView
													selection={
														projection.$$settledRollups({
															sources: networkApplicableSources([
																Source.L2Beat_Rest,
															], pendingEntity),
															limit: 16,
														})
													}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No settled rollups listed for this network yet.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

										</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Evm}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$executionUpgrades({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
												limit: 512,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No upgrades available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmExecutionBlocks({ id, label, open })}
									<EvmBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.Voltaire_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmExecutionTransactions({ id, label, open })}
									<EvmTransactionsView
										selection={
											projection.$$transactions({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No transactions available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmExecutionMempool({ id, label, open })}
									<EvmNetwork_Txpool_TimestampsView
										selection={
											projection.$$txpoolTimestamps({
												sources: networkApplicableSources([
													Source.Voltaire_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No mempool available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmExecutionGasBlocks({ id, label, open })}
									<EvmNetwork_GasFee_BlocksView
										selection={
											projection.$$gasFeeBlocks({
												sources: networkApplicableSources([
													Source.Voltaire_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No fee market available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmExecutionGasEstimates({ id, label, open })}
									<EvmNetwork_GasEstimate_TimestampsView
										selection={
											projection.$$gasEstimateTimestamps({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
													Source.Etherscan_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No gas estimates available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmExecutionEndpoints({ id, label, open })}
									<UrlsView
										selection={
											projection.$$rpcUrls({
												sources: networkApplicableSources([
													Source.Constants_Internal,
													Source.Chainlist_Rest,
													Source.EthereumLists_Rest,
													Source.Lifi_Rest,
												], pendingEntity),
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No endpoints available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Evm.EthereumBeacon}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
						{#snippet Applicable(projection)}
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Consensus and block production</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionEvmConsensusUpgrades({ id, label, open })}
									<EthereumConsensusUpgradesView
										selection={
											selection.Evm.$$consensusUpgrades({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
												limit: 512,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No upgrades available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusFinality({ id, label, open })}
									<EthereumBeaconFinality_TimestampsView
										selection={
											selection.Evm.$$beaconFinalityTimestamps({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No finality available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusCommittees({ id, label, open })}
									<BeaconCommitteesView
										selection={
											selection.Evm.$$beaconCommittees({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No committees available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusSyncCommittees({ id, label, open })}
									<BeaconSyncCommitteesView
										selection={
											selection.Evm.$$beaconSyncCommittees({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No sync committees available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusAttestations({ id, label, open })}
									<BeaconAttestationsView
										selection={
											selection.Evm.$$beaconAttestations({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No attestations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusWithdrawals({ id, label, open })}
									<BeaconWithdrawalsView
										selection={
											selection.Evm.$$beaconWithdrawals({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No withdrawals available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusSlashings({ id, label, open })}
									<BeaconSlashingsView
										selection={
											selection.Evm.$$beaconSlashings({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No slashings available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusValidators({ id, label, open })}
									<BeaconValidatorsView
										selection={
											selection.Evm.$$beaconValidators({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No validators available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusEpochs({ id, label, open })}
									<BeaconEpochsView
										selection={
											selection.Evm.$$beaconEpochs({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No epochs available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusSlots({ id, label, open })}
									<BeaconSlotsView
										selection={
											selection.Evm.$$beaconSlots({
												sources: networkApplicableSources([
													Source.Beacon_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No slots available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusMevRelays({ id, label, open })}
									<MevRelaysView
										selection={
											selection.Evm.$$mevRelays({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
												limit: 64,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No relays available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusMevBuilders({ id, label, open })}
									<MevBuildersView
										selection={
											selection.Evm.$$mevBuilders({
												sources: networkApplicableSources([
													Source.MevRelay_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No builders available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusMevBoost({ id, label, open })}
									<MevRelay_ProposerPayloadDeliveredsView
										selection={
											selection.Evm.$$mevProposerPayloadDelivered({
												sources: networkApplicableSources([
													Source.MevRelay_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No mev-boost available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmConsensusEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										<ResourceBoundary
											resource={
												selection.Evm.consensusEndpoints({
													sources: [
														Source.Constants_Internal,
													],
												})
											}
										>
											{#snippet children(consensusEndpoints)}
												{#if consensusEndpoints.length > 0}
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">Consensus endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Evm}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Data availability</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionEvmDataAvailabilityBlobs({ id, label, open })}
									<EvmBlobsView
										selection={
											projection.$$blobs({
												sources: networkApplicableSources([
													Source.Voltaire_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blobs available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Evm}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Contracts and accounts</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionEvmContractsPrecompiles({ id, label, open })}
									<EvmContractsView
										selection={
											projection.$$precompiles({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
												limit: 64,
											})
										}
										href={resolve('/contracts')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No precompiles available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmContractsVerified({ id, label, open })}
									<EvmContractsView
										selection={
											projection.$$contracts({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										href={resolve('/contracts')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No verified contracts available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmContractsSmartAccounts({ id, label, open })}
									<Erc4337SmartAccountsView
										selection={
											projection.$$erc4337SmartAccounts({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No smart accounts available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmContractsBundlers({ id, label, open })}
									<Erc4337BundlersView
										selection={
											projection.$$erc4337Bundlers({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No bundlers available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmContractsPaymasters({ id, label, open })}
									<Erc4337PaymastersView
										selection={
											projection.$$erc4337Paymasters({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No paymasters available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmContractsUserOperations({ id, label, open })}
									<EvmUserOperationsView
										selection={
											projection.$$userOperations({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No user operations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmContractsFactories({ id, label, open })}
									<Erc4337AccountFactoriesView
										selection={
											projection.$$erc4337AccountFactories({
												sources: networkApplicableSources([
													Source.Blockscout_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No factories available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Evm}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
										>
											{#snippet Summary()}
												<header data-row-item="flexible" data-row="wrap gap-4">
													<HeadingComponent>Assets</HeadingComponent>
												</header>
											{/snippet}

											{#snippet SectionEvmAssetsNativeCoin({ id, label, open })}
												<article
													id={`${id}-list`}
													data-column-item="flexible"
													data-card
													data-scroll-container
												>
													<ResourceBoundary
														resource={
															projection.$nativeCoin({
																sources: networkApplicableSources([
																	Source.Constants_Internal,
																], pendingEntity),
															})
														}
													>
														{#snippet children(coin)}
															{#if coin == null || coin[EntityMetaKey.Selector] == null}
																<p data-text="muted" data-section-state="resolved-empty">No native coin available.</p>
															{:else}
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
												</article>
											{/snippet}

											{#snippet SectionEvmAssetsNativeInstance({ id, label, open })}
												<article
													id={`${id}-list`}
													data-column-item="flexible"
													data-card
													data-scroll-container
												>
													<ResourceBoundary
														resource={
															projection.$nativeCoinInstance({
																sources: networkApplicableSources([
																	Source.Constants_Internal,
																], pendingEntity),
															})
														}
													>
														{#snippet children(evmCoinInstance)}
															{#if evmCoinInstance == null || evmCoinInstance[EntityMetaKey.Selector] == null}
																<p data-text="muted" data-section-state="resolved-empty">No native coin instance available.</p>
															{:else}
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
												</article>
											{/snippet}

											{#snippet SectionEvmAssetsNativeAssets({ id, label, open })}
												<AssetInstancesView
													selection={
														selection.$$nativeAssets({
															sources: networkApplicableSources([
																Source.Constants_Internal,
															], pendingEntity),
															limit: 16,
														})
													}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No native assets available.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

											{#snippet SectionEvmAssetsBridges({ id, label, open })}
												<EvmNetworkBridgesView
													selection={
														projection.$$bridges({
															sources: networkApplicableSources([
																Source.Chainlist_Rest,
																Source.EthereumLists_Rest,
																Source.Lifi_Rest,
															], pendingEntity),
														})
													}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No bridges available.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

											{#snippet SectionEvmAssetsErc20Transfers({ id, label, open })}
												<EvmTokenTransfersView
													selection={
														projection.$$erc20TokenTransfers({
															sources: networkApplicableSources([
																Source.Blockscout_Rest,
															], pendingEntity),
															limit: 16,
														})
													}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No erc-20 transfers available.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

											{#snippet SectionEvmAssetsNftTransfers({ id, label, open })}
												<EvmTokenTransfersView
													selection={
														projection.$$nftTokenTransfers({
															sources: networkApplicableSources([
																Source.Blockscout_Rest,
															], pendingEntity),
															limit: 16,
														})
													}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													emptyText='No nft transfers available.'
													open={open}
													title={label}
													id={`${id}-list`}
												/>
											{/snippet}

										</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Evm}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionEvmResourcesFaucets({ id, label, open })}
									<UrlsView
										selection={
											selection.$$faucetUrls({
												sources: networkApplicableSources([
													Source.Constants_Internal,
													Source.Chainlist_Rest,
												], pendingEntity),
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No faucets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionEvmResourcesBlockExplorers({ id, label, open })}
									<UrlsView
										selection={
											selection.$$blockExplorerUrls({
												sources: networkApplicableSources([
													Source.Constants_Internal,
													Source.Chainlist_Rest,
													Source.EthereumLists_Rest,
													Source.Lifi_Rest,
												], pendingEntity),
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No block explorers available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cosmos}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.CosmosSdk_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionCosmosConsensusValidators({ id, label, open })}
									<CosmosValidatorsView
										selection={
											projection.$$validators({
												sources: networkApplicableSources([
													Source.CosmosSdk_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No validators available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cosmos}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Accounts</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionCosmosContractsAccountsAccounts({ id, label, open })}
									<CosmosAccountsView
										selection={
											projection.$$accounts({
												sources: networkApplicableSources([
													Source.CosmosSdk_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No accounts available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cosmos}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$governanceProposals({
												sources: networkApplicableSources([
													Source.CosmosSdk_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No proposals available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cosmos}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionCosmosResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										<ResourceBoundary
											resource={
												projection.restEndpoints({
													sources: [
														Source.CosmosSdk_Rest,
													],
												})
											}
										>
											{#snippet children(restEndpoints)}
												{#if restEndpoints.length > 0}
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">REST endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Polkadot}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Consensus and block production</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionPolkadotConsensusBlocks({ id, label, open })}
									<PolkadotBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.Polkadot_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionPolkadotConsensusValidators({ id, label, open })}
									<PolkadotValidatorsView
										selection={
											projection.$$validators({
												sources: networkApplicableSources([
													Source.SubstrateSidecar_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No validators available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Polkadot}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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

								{#snippet SectionPolkadotAssetsNativeAssets({ id, label, open })}
									<AssetInstancesView
										selection={
											selection.$$nativeAssets({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No native assets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Polkadot}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionPolkadotResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										<ResourceBoundary
											resource={
												projection.rpcEndpoints({
													sources: [
														Source.Polkadot_JsonRpc,
													],
												})
											}
										>
											{#snippet children(rpcEndpoints)}
												{#if rpcEndpoints.length > 0}
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">RPC endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Solana}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.Solana_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionSolanaExecutionTransactions({ id, label, open })}
									<SolanaTransactionsView
										selection={
											projection.$$transactions({
												sources: networkApplicableSources([
													Source.Solana_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No transactions available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Solana}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$validators({
												sources: networkApplicableSources([
													Source.Solana_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No validators available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Solana}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$accounts({
												sources: networkApplicableSources([
													Source.Solana_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No accounts available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionSolanaContractsAccountsPrograms({ id, label, open })}
									<SolanaProgramsView
										selection={
											projection.$$programs({
												sources: networkApplicableSources([
													Source.Solana_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No programs available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Solana}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Assets</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionSolanaAssetsNativeAssets({ id, label, open })}
									<AssetInstancesView
										selection={
											selection.$$nativeAssets({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No native assets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionSolanaAssetsTokenAccounts({ id, label, open })}
									<SolanaTokenAccountsView
										selection={
											projection.$$tokenAccounts({
												sources: networkApplicableSources([
													Source.Solana_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No token accounts available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionSolanaAssetsTokenMints({ id, label, open })}
									<SolanaTokenMintsView
										selection={
											projection.$$tokenMints({
												sources: networkApplicableSources([
													Source.Solana_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No token mints available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Solana}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionSolanaResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										<ResourceBoundary
											resource={
												projection.rpcEndpoints({
													sources: [
														Source.Solana_JsonRpc,
													],
												})
											}
										>
											{#snippet children(rpcEndpoints)}
												{#if rpcEndpoints.length > 0}
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">RPC endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Utxo}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Chain activity</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionUtxoConsensusObservations({ id, label, open })}
									<Network_TimestampsView
										selection={
											selection.$$timestamps({
												sources: networkApplicableSources([
													Source.MempoolSpace_Rest,
													Source.Blockchair_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionUtxoConsensusBlocks({ id, label, open })}
									<UtxoBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.MempoolSpace_Rest,
													Source.Blockchair_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Utxo}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Transactions</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionUtxoExecutionTransactions({ id, label, open })}
									<UtxoTransactionsView
										selection={
											projection.$$transactions({
												sources: networkApplicableSources([
													Source.MempoolSpace_Rest,
													Source.Blockchair_Rest,
													Source.Zcashd_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No transactions available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionUtxoExecutionMempool({ id, label, open })}
									<UtxoTransactionsView
										selection={
											projection.$$transactions({
												sources: networkApplicableSources([
													Source.MempoolSpace_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No mempool available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Utxo}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Assets</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionUtxoAssetsNativeAssets({ id, label, open })}
									<AssetInstancesView
										selection={
											selection.$$nativeAssets({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No native assets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Zcash}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$shieldedPools({
												sources: networkApplicableSources([
													Source.Constants_Internal,
												], pendingEntity),
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No shielded pools available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Bittensor}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Chain activity</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionBittensorChainObservations({ id, label, open })}
									<BittensorNetwork_TimestampsView
										selection={
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.Bittensor_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionBittensorChainBlocks({ id, label, open })}
									<BittensorBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.Bittensor_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Bittensor}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Subnets</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionBittensorSubnetsSubnets({ id, label, open })}
									<BittensorSubnetsView
										selection={
											projection.$$subnets({
												sources: networkApplicableSources([
													Source.Bittensor_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No subnets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.ZeroG}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.ZeroGStorageScan_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionZeroGStorageNodes({ id, label, open })}
									<ZeroGStorageNodesView
										selection={
											projection.$$storageNodes({
												sources: networkApplicableSources([
													Source.ZeroGStorageScan_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No storage nodes available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionZeroGStorageDataBlobs({ id, label, open })}
									<ZeroGDataBlobsView
										selection={
											projection.$$dataBlobs({
												sources: networkApplicableSources([
													Source.ZeroGStorageScan_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No data blobs available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionZeroGStorageLogEntries({ id, label, open })}
									<ZeroGStorageLogEntriesView
										selection={
											projection.$$storageLogEntries({
												sources: networkApplicableSources([
													Source.ZeroGStorageScan_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No storage log entries available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Filecoin}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.Lotus_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionFilecoinChainTipsets({ id, label, open })}
									<FilecoinTipsetsView
										selection={
											projection.$$tipsets({
												sources: networkApplicableSources([
													Source.Lotus_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No tipsets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Filecoin}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionFilecoinResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
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
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">RPC endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Near}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Chain activity</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionNearChainObservations({ id, label, open })}
									<NearNetwork_TimestampsView
										selection={
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.NearRpc_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionNearChainBlocks({ id, label, open })}
									<NearBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.NearRpc_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Near}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Consensus and validators</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionNearConsensusValidators({ id, label, open })}
									<NearValidatorsView
										selection={
											projection.$$validators({
												sources: networkApplicableSources([
													Source.NearRpc_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No validators available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Near}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionNearResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
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
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">RPC endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Monero}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.MoneroDaemonRpc_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionMoneroChainBlocks({ id, label, open })}
									<MoneroBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.MoneroDaemonRpc_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Monero}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionMoneroResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
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
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">RPC endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Lightning}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
									]
								}
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
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.LightningMempoolSpace_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionLightningNetworkNodes({ id, label, open })}
									<LightningNodesView
										selection={
											projection.$$nodes({
												sources: networkApplicableSources([
													Source.LightningMempoolSpace_Rest,
													Source.LightningLnd_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No nodes available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cardano}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Chain activity</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionCardanoChainObservations({ id, label, open })}
									<CardanoNetwork_TimestampsView
										selection={
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.CardanoKoios_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionCardanoChainBlocks({ id, label, open })}
									<CardanoBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.CardanoKoios_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionCardanoChainTransactions({ id, label, open })}
									<CardanoTransactionsView
										selection={
											projection.$$transactions({
												sources: networkApplicableSources([
													Source.Blockfrost_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No transactions available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cardano}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
						{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-cardano-stake-delegation'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'cardano-stake-pools',
											label: 'Stake pools',
										},
									]
								}
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
											projection.$$stakePools({
												sources: networkApplicableSources([
													Source.Blockfrost_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No stake pools available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cardano}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
											id: 'cardano-governance-committee',
											label: 'Committee epochs',
										},
									]
								}
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
											projection.$$dReps({
												sources: networkApplicableSources([
													Source.Blockfrost_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No dreps available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionCardanoGovernanceProposals({ id, label, open })}
									<CardanoGovernanceProposalsView
										selection={
											projection.$$governanceProposals({
												sources: networkApplicableSources([
													Source.CardanoKoios_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No proposals available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionCardanoGovernanceCommittee({ id, label, open })}
									<CardanoCommittee_EpochsView
										selection={
											projection.$$committeeEpochs({
												sources: networkApplicableSources([
													Source.Blockfrost_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No committee epochs available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cardano}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Assets and protocol</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionCardanoAssetsNative({ id, label, open })}
									<CardanoNativeAssetsView
										selection={
											projection.$$assets({
												sources: networkApplicableSources([
													Source.Blockfrost_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No native assets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionCardanoProtocolParameters({ id, label, open })}
									<CardanoProtocolParameters_EpochsView
										selection={
											projection.$$protocolParameterEpochs({
												sources: networkApplicableSources([
													Source.Blockfrost_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No protocol parameters available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Cardano}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionCardanoResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										<ResourceBoundary
											resource={
												projection.restEndpoints({
													sources: [
														Source.CardanoKoios_Rest,
													],
												})
											}
										>
											{#snippet children(restEndpoints)}
												{#if restEndpoints.length > 0}
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">REST endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Tron}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Chain activity</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionTronChainObservations({ id, label, open })}
									<TronNetwork_TimestampsView
										selection={
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.TronGrid_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionTronChainBlocks({ id, label, open })}
									<TronBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.TronGrid_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionTronChainWitnesses({ id, label, open })}
									<TronWitnessesView
										selection={
											projection.$$witnesses({
												sources: networkApplicableSources([
													Source.TronGrid_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No witnesses available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Tron}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionTronResourcesEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
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
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">REST endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Xrpl}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
						{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-xrpl-chain-activity'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'xrpl-chain-ledgers',
											label: 'Ledgers',
										},
										{
											id: 'xrpl-chain-transactions',
											label: 'Transactions',
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

								{#snippet SectionXrplChainLedgers({ id, label, open })}
									<XrplLedgersView
										selection={
											projection.$$ledgers({
												sources: networkApplicableSources([
													Source.Xrpl_Rippled,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No XRPL ledgers.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionXrplChainTransactions({ id, label, open })}
									<XrplTransactionsView
										selection={
											projection.$$transactions({
												sources: networkApplicableSources([
													Source.Xrpl_Rippled,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No XRPL transactions.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Xrpl}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
						{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-xrpl-ledger-state'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'xrpl-ledger-state-accounts',
											label: 'Accounts',
										},
										{
											id: 'xrpl-ledger-state-entries',
											label: 'Ledger entries',
										},
									]
								}
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
											projection.$$accounts({
												sources: networkApplicableSources([
													Source.Xrpl_Rippled,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No XRPL accounts.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionXrplLedgerStateEntries({ id, label, open })}
									<XrplLedgerEntriesView
										selection={
											projection.$$ledgerEntries({
												sources: networkApplicableSources([
													Source.Xrpl_Rippled,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No XRPL ledger entries.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Xrpl}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
						{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-xrpl-protocol-liquidity'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'xrpl-protocol-amendments',
											label: 'Amendments',
										},
										{
											id: 'xrpl-liquidity-amms',
											label: 'AMMs',
										},
									]
								}
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
											projection.$$amendments({
												sources: networkApplicableSources([
													Source.Xrpl_Rippled,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No XRPL amendments.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionXrplLiquidityAmms({ id, label, open })}
									<XrplAmmsView
										selection={
											projection.$$amms({
												sources: networkApplicableSources([
													Source.Xrpl_Rippled,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No XRPL AMMs.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Hedera}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
						{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-hedera-chain-activity'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'hedera-chain-blocks',
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

								{#snippet SectionHederaChainBlocks({ id, label, open })}
									<HederaBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.HederaMirrorNode_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No Hedera blocks.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Hedera}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
									]
								}
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
											projection.$$accounts({
												sources: networkApplicableSources([
													Source.HederaMirrorNode_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No Hedera accounts.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Chain activity</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionHyperliquidChainObservations({ id, label, open })}
									<HyperliquidNetwork_TimestampsView
										selection={
											projection.$$timestamps({
												sources: networkApplicableSources([
													Source.Hyperliquid_Rest,
													Source.Hyperliquid_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No observations available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionHyperliquidChainBlocks({ id, label, open })}
									<HyperliquidBlocksView
										selection={
											projection.$$blocks({
												sources: networkApplicableSources([
													Source.Hyperliquid_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No blocks available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionHyperliquidChainTransactions({ id, label, open })}
									<HyperliquidTransactionsView
										selection={
											projection.$$transactions({
												sources: networkApplicableSources([
													Source.Hyperliquid_JsonRpc,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No transactions available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Consensus and validators</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionHyperliquidConsensusValidators({ id, label, open })}
									<HyperliquidValidatorsView
										selection={
											projection.$$validators({
												sources: networkApplicableSources([
													Source.Hyperliquid_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No validators available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
									]
								}
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
											projection.$$perpMarkets({
												sources: networkApplicableSources([
													Source.Hyperliquid_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No perps available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

								{#snippet SectionHyperliquidMarketsSpotAssets({ id, label, open })}
									<HyperliquidSpotAssetsView
										selection={
											projection.$$spotAssets({
												sources: networkApplicableSources([
													Source.Hyperliquid_Rest,
												], pendingEntity),
												limit: 16,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										emptyText='No spot assets available.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.Hyperliquid}
			>
				{#snippet children(projectionValue)}
					<Projection projection={projectionValue}>
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
							>
								{#snippet Summary()}
									<header data-row-item="flexible" data-row="wrap gap-4">
										<HeadingComponent>Resources</HeadingComponent>
									</header>
								{/snippet}

								{#snippet SectionHyperliquidResourcesRpcEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										<ResourceBoundary
											resource={
												projection.rpcEndpoints({
													sources: [
														Source.Hyperliquid_JsonRpc,
													],
												})
											}
										>
											{#snippet children(rpcEndpoints)}
												{#if rpcEndpoints.length > 0}
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">RPC endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

								{#snippet SectionHyperliquidResourcesRestEndpoints({ id, label, open })}
									<article
										id={`${id}-list`}
										data-column-item="flexible"
										data-card
										data-scroll-container
									>
										<ResourceBoundary
											resource={
												projection.restEndpoints({
													sources: [
														Source.Hyperliquid_Rest,
													],
												})
											}
										>
											{#snippet children(restEndpoints)}
												{#if restEndpoints.length > 0}
												<ul data-column="gap-2" data-section-state="resolved-nonempty">
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
													<p data-text="muted" data-section-state="resolved-empty">REST endpoints are not listed for this network.</p>
												{/if}
											{/snippet}
										</ResourceBoundary>
									</article>
								{/snippet}

							</CollapsibleTabs>
						{/snippet}
					</Projection>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
