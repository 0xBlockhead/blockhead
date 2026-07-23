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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Network>
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
		[Source.TronGrid_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'tron:0x2b6653dc' },
		]],
		[Source.TonApi_Rest, [
			{ kind: SourceTargetKind.Caip2Network, key: 'ton:-239' },
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
			slug?: string
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

	const network = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
		},
	} : {
		sources: selection.sources ?? [
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
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [pendingEntity.caip2 == null ? '' : String(`${(pendingEntity.caip2).namespace}:${(pendingEntity.caip2).reference}`)].filter(Boolean).join(' ') || 'Network')
	const viewDomId = $derived('network-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'caip2' in selection.entitySelector
			&& selection.entitySelector.caip2 != null ?
				resolve('/network/[network=networkCaip2OrNetworkSlug]', {
			network: String(caip2StringFromValue(selection.entitySelector.caip2) ?? ''),
		})
		:
				selection.entitySelector != null && 'slug' in selection.entitySelector
				&& selection.entitySelector.slug != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]', {
				network: String(selection.entitySelector.slug ?? ''),
			})
			:
				undefined
		)
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
		<ResourceBoundary resource={network}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={network}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const caip20 = resolvedEntity.caip2}
				{#if caip20 !== undefined && caip20 !== null}
					<TruncatedValue value={caip20 == null ? '' : String(`${(caip20).namespace}:${(caip20).reference}`)} />
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
				{#snippet Applicable(_projection)}
					<ProjectionBoundary
						resource={selection.Evm}
					>
						{#snippet Applicable(projection)}
							<div>
								<dt>Upgrade</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection
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
													href={
														(
															ethereumNetworkUpgrade[EntityMetaKey.Selector] != null && 'slug' in ethereumNetworkUpgrade[EntityMetaKey.Selector]
															&& ethereumNetworkUpgrade[EntityMetaKey.Selector].slug != null
															&& ethereumNetworkUpgrade[EntityMetaKey.Selector] != null && '$network' in ethereumNetworkUpgrade[EntityMetaKey.Selector] ?
																ethereumNetworkUpgrade[EntityMetaKey.Selector].$network != null && 'caip2' in ethereumNetworkUpgrade[EntityMetaKey.Selector].$network
																&& ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2 != null ?
																	resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
																upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
																network: String(caip2StringFromValue(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
															})
															:
																	ethereumNetworkUpgrade[EntityMetaKey.Selector].$network != null && 'slug' in ethereumNetworkUpgrade[EntityMetaKey.Selector].$network
																	&& ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug != null ?
																		resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
																	upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
																	network: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
																})
																:
																	undefined
														:
																undefined
														)
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
							<div>
								<dt>Block</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection
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
													href={
														(
															evmBlock[EntityMetaKey.Selector] != null && 'blockNumber' in evmBlock[EntityMetaKey.Selector]
															&& evmBlock[EntityMetaKey.Selector].blockNumber != null
															&& evmBlock[EntityMetaKey.Selector] != null && '$network' in evmBlock[EntityMetaKey.Selector] ?
																evmBlock[EntityMetaKey.Selector].$network != null && 'caip2' in evmBlock[EntityMetaKey.Selector].$network
																&& evmBlock[EntityMetaKey.Selector].$network.caip2 != null ?
																	resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
																blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
															})
															:
																	evmBlock[EntityMetaKey.Selector].$network != null && 'slug' in evmBlock[EntityMetaKey.Selector].$network
																	&& evmBlock[EntityMetaKey.Selector].$network.slug != null ?
																		resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
																	blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																	network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
																})
																:
																	undefined
														:
																undefined
														)
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
							<div>
								<dt>Fee market</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection
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
													href={
														(
															evmNetworkGasFeeBlock[EntityMetaKey.Selector] != null && 'blockNumber' in evmNetworkGasFeeBlock[EntityMetaKey.Selector]
															&& evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber != null
															&& evmNetworkGasFeeBlock[EntityMetaKey.Selector] != null && '$network' in evmNetworkGasFeeBlock[EntityMetaKey.Selector] ?
																evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network
																&& evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2 != null ?
																	resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
																blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																network: String(caip2StringFromValue(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
															})
															:
																	evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network
																	&& evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug != null ?
																		resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
																	blockNumber: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].blockNumber ?? ''),
																	network: String(evmNetworkGasFeeBlock[EntityMetaKey.Selector].$network.slug ?? ''),
																})
																:
																	undefined
														:
																undefined
														)
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
							<div>
								<dt>Mempool</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection
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
													href={
														(
															evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector]
															&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs != null
															&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] != null && 'source' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector]
															&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source != null
															&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] != null && '$network' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] ?
																evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network
																&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2 != null ?
																	resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
																timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
																source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
																network: String(caip2StringFromValue(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
															})
															:
																	evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network
																	&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug != null ?
																		resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
																	timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
																	source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
																	network: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
																})
																:
																	undefined
														:
																undefined
														)
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
							<div>
								<dt>Epoch</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection
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
													href={
														(
															beaconEpoch[EntityMetaKey.Selector] != null && 'epoch' in beaconEpoch[EntityMetaKey.Selector]
															&& beaconEpoch[EntityMetaKey.Selector].epoch != null
															&& beaconEpoch[EntityMetaKey.Selector] != null && '$network' in beaconEpoch[EntityMetaKey.Selector] ?
																beaconEpoch[EntityMetaKey.Selector].$network != null && 'caip2' in beaconEpoch[EntityMetaKey.Selector].$network
																&& beaconEpoch[EntityMetaKey.Selector].$network.caip2 != null ?
																	resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
																epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
																network: String(caip2StringFromValue(beaconEpoch[EntityMetaKey.Selector].$network.caip2) ?? ''),
															})
															:
																	beaconEpoch[EntityMetaKey.Selector].$network != null && 'slug' in beaconEpoch[EntityMetaKey.Selector].$network
																	&& beaconEpoch[EntityMetaKey.Selector].$network.slug != null ?
																		resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
																	epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
																	network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
																})
																:
																	undefined
														:
																undefined
														)
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
							<div>
								<dt>Slot</dt>
								<dd>
									<ResourceBoundary
										resource={
											projection
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
													href={
														(
															beaconSlot[EntityMetaKey.Selector] != null && 'slot' in beaconSlot[EntityMetaKey.Selector]
															&& beaconSlot[EntityMetaKey.Selector].slot != null
															&& beaconSlot[EntityMetaKey.Selector] != null && '$network' in beaconSlot[EntityMetaKey.Selector] ?
																beaconSlot[EntityMetaKey.Selector].$network != null && 'caip2' in beaconSlot[EntityMetaKey.Selector].$network
																&& beaconSlot[EntityMetaKey.Selector].$network.caip2 != null ?
																	resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
																slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
																network: String(caip2StringFromValue(beaconSlot[EntityMetaKey.Selector].$network.caip2) ?? ''),
															})
															:
																	beaconSlot[EntityMetaKey.Selector].$network != null && 'slug' in beaconSlot[EntityMetaKey.Selector].$network
																	&& beaconSlot[EntityMetaKey.Selector].$network.slug != null ?
																		resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
																	slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
																	network: String(beaconSlot[EntityMetaKey.Selector].$network.slug ?? ''),
																})
																:
																	undefined
														:
																undefined
														)
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
								sources: selection.sources ?? [
									Source.Constants_Internal,
								],
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
								sources: selection.sources ?? [
									Source.Constants_Internal,
								],
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
								sources: selection.sources ?? [
									Source.Constants_Internal,
								],
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
								sources: selection.sources ?? [
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
					selection
						.$networkStack({
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
										(
											networkStack[EntityMetaKey.Selector] != null && 'networkStackId' in networkStack[EntityMetaKey.Selector]
											&& networkStack[EntityMetaKey.Selector].networkStackId != null ?
												resolve('/network-stack/[networkStackId=stringSegment]', {
											networkStackId: String(networkStack[EntityMetaKey.Selector].networkStackId ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Environment</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources ?? [
									Source.Constants_Internal,
								],
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
						sources: selection.sources ?? [
							Source.Constants_Internal,
						],
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
								<TruncatedValue value={caip2 == null ? '' : String(`${(caip2).namespace}:${(caip2).reference}`)} />
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
								projection
									.consensusProtocol({
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
								projection
									.$nativeCoinInstance({
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
													(
														evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
														&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
														&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
														&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
														&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
															resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
														chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
														coinInstanceSlug: String('native'),
													})
													:
															evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
															&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
															&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
															&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
															&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
															&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
															&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
															&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
																resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
															coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
															chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}

					{#if contentOpen}
						<ResourceBoundary
							resource={
								projection
									.$nativeCoin({
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
													(
														coin[EntityMetaKey.Selector] != null && 'coinId' in coin[EntityMetaKey.Selector]
														&& coin[EntityMetaKey.Selector].coinId != null ?
															resolve('/coin/[coinId=stringSegment]', {
														coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
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
													(
														network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
														&& network[EntityMetaKey.Selector].caip2 != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]', {
														network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
													})
													:
															network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
															&& network[EntityMetaKey.Selector].slug != null ?
																resolve('/network/[network=networkCaip2OrNetworkSlug]', {
															network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
													(
														network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
														&& network[EntityMetaKey.Selector].caip2 != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]', {
														network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
													})
													:
															network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
															&& network[EntityMetaKey.Selector].slug != null ?
																resolve('/network/[network=networkCaip2OrNetworkSlug]', {
															network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
													(
														network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
														&& network[EntityMetaKey.Selector].caip2 != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]', {
														network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
													})
													:
															network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
															&& network[EntityMetaKey.Selector].slug != null ?
																resolve('/network/[network=networkCaip2OrNetworkSlug]', {
															network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
		<ProjectionBoundary
			resource={selection.Evm}
		>
			{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-evm-network-topology'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'evm-network-topology-upgrades',
											label: 'Upgrades',
											ownsSection: true,
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
											ownsSection: true,
										},
										{
											id: 'evm-network-topology-testnets',
											label: 'Testnets',
											ownsSection: true,
										},
										{
											id: 'evm-network-topology-mainnet',
											label: 'Mainnet',
											ownsSection: true,
										},
										{
											id: 'evm-network-topology-child-layers',
											label: 'Layers',
											ownsSection: true,
										},
										{
											id: 'evm-network-topology-settled-rollups',
											label: 'Settled rollups',
											ownsSection: true,
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

								{#snippet MarkerEvmNetworkTopologyUpgrades(_context, Content)}
									{@const evmNetworkTopologyUpgradesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$upgrades({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 512,
					})}
									{#if evmNetworkTopologyUpgradesResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyUpgradesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologyUpgrades({ id, label, open, active })}
									{@const evmNetworkTopologyUpgradesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$upgrades({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 512,
					})}
									{#if evmNetworkTopologyUpgradesResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyUpgradesResource}
									>
										{#snippet children(ethereumNetworkUpgrade)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EthereumNetworkUpgradesView
													selection={evmNetworkTopologyUpgradesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmNetworkTopologyParentLayer(_context, Content)}
									{@const evmNetworkTopologyParentLayerResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$parent({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.L2Beat_Rest,
						], pendingEntity),
					})}
									{#if evmNetworkTopologyParentLayerResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyParentLayerResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologyParentLayer({ id, label, open, active })}
									{@const evmNetworkTopologyParentLayerResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$parent({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.L2Beat_Rest,
						], pendingEntity),
					})}
									{#if evmNetworkTopologyParentLayerResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyParentLayerResource}
									>
										{#snippet children(network)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
																	{#if network != null}
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
																				href={
																					(
																						network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
																						&& network[EntityMetaKey.Selector].caip2 != null ?
																							resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																						network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
																					})
																					:
																							network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
																							&& network[EntityMetaKey.Selector].slug != null ?
																								resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																							network: String(network[EntityMetaKey.Selector].slug ?? ''),
																						})
																						:
																							undefined
																					)
																				}
																				layout={EntityLayout.SummaryInline}
																				open={false}
																			/>
																		</article>
																	{:else}
																		<p data-text="muted">Parent network is not listed for this network.</p>
																	{/if}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmNetworkTopologyRollup(_context, Content)}
									{@const evmNetworkTopologyRollupResource = (networkApplicableSources([
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$rollup({
						sources: networkApplicableSources([
							Source.L2Beat_Rest,
						], pendingEntity),
					})}
									{#if evmNetworkTopologyRollupResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyRollupResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologyRollup({ id, label, open, active })}
									{@const evmNetworkTopologyRollupResource = (networkApplicableSources([
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$rollup({
						sources: networkApplicableSources([
							Source.L2Beat_Rest,
						], pendingEntity),
					})}
									{#if evmNetworkTopologyRollupResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyRollupResource}
									>
										{#snippet children(evmRollup)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
																	{#if evmRollup != null}
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
																				href={
																					(
																						evmRollup[EntityMetaKey.Selector] != null && 'projectId' in evmRollup[EntityMetaKey.Selector]
																						&& evmRollup[EntityMetaKey.Selector].projectId != null
																						&& evmRollup[EntityMetaKey.Selector] != null && '$network' in evmRollup[EntityMetaKey.Selector] ?
																							evmRollup[EntityMetaKey.Selector].$network != null && 'caip2' in evmRollup[EntityMetaKey.Selector].$network
																							&& evmRollup[EntityMetaKey.Selector].$network.caip2 != null ?
																								resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
																							projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
																							network: String(caip2StringFromValue(evmRollup[EntityMetaKey.Selector].$network.caip2) ?? ''),
																						})
																						:
																								evmRollup[EntityMetaKey.Selector].$network != null && 'slug' in evmRollup[EntityMetaKey.Selector].$network
																								&& evmRollup[EntityMetaKey.Selector].$network.slug != null ?
																									resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
																								projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
																								network: String(evmRollup[EntityMetaKey.Selector].$network.slug ?? ''),
																							})
																							:
																								undefined
																					:
																							undefined
																					)
																				}
																				layout={EntityLayout.SummaryInline}
																				open={false}
																			/>
																		</article>
																	{:else}
																		<p data-text="muted">Rollup is not listed for this network.</p>
																	{/if}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmNetworkTopologySiblingShards(_context, Content)}
									{@const evmNetworkTopologySiblingShardsResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$siblingShardNetworks({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologySiblingShardsResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologySiblingShardsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologySiblingShards({ id, label, open, active })}
									{@const evmNetworkTopologySiblingShardsResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$siblingShardNetworks({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologySiblingShardsResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologySiblingShardsResource}
									>
										{#snippet children(network)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<NetworksView
													selection={evmNetworkTopologySiblingShardsResource}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmNetworkTopologyTestnets(_context, Content)}
									{@const evmNetworkTopologyTestnetsResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$testnets({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologyTestnetsResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyTestnetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologyTestnets({ id, label, open, active })}
									{@const evmNetworkTopologyTestnetsResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$testnets({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologyTestnetsResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyTestnetsResource}
									>
										{#snippet children(network)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<NetworksView
													selection={evmNetworkTopologyTestnetsResource}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmNetworkTopologyMainnet(_context, Content)}
									{@const evmNetworkTopologyMainnetResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$mainnet({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						], pendingEntity),
					})}
									{#if evmNetworkTopologyMainnetResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyMainnetResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologyMainnet({ id, label, open, active })}
									{@const evmNetworkTopologyMainnetResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$mainnet({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						], pendingEntity),
					})}
									{#if evmNetworkTopologyMainnetResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyMainnetResource}
									>
										{#snippet children(network)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
																	{#if network != null}
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
																				href={
																					(
																						network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
																						&& network[EntityMetaKey.Selector].caip2 != null ?
																							resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																						network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
																					})
																					:
																							network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
																							&& network[EntityMetaKey.Selector].slug != null ?
																								resolve('/network/[network=networkCaip2OrNetworkSlug]', {
																							network: String(network[EntityMetaKey.Selector].slug ?? ''),
																						})
																						:
																							undefined
																					)
																				}
																				layout={EntityLayout.SummaryInline}
																				open={false}
																			/>
																		</article>
																	{:else}
																		<p data-text="muted">Mainnet is not listed for this network.</p>
																	{/if}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmNetworkTopologyChildLayers(_context, Content)}
									{@const evmNetworkTopologyChildLayersResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$childLayers({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.L2Beat_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologyChildLayersResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyChildLayersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologyChildLayers({ id, label, open, active })}
									{@const evmNetworkTopologyChildLayersResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$childLayers({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.L2Beat_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologyChildLayersResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologyChildLayersResource}
									>
										{#snippet children(network)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<NetworksView
													selection={evmNetworkTopologyChildLayersResource}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmNetworkTopologySettledRollups(_context, Content)}
									{@const evmNetworkTopologySettledRollupsResource = (networkApplicableSources([
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$settledRollups({
						sources: networkApplicableSources([
							Source.L2Beat_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologySettledRollupsResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologySettledRollupsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmNetworkTopologySettledRollups({ id, label, open, active })}
									{@const evmNetworkTopologySettledRollupsResource = (networkApplicableSources([
					Source.L2Beat_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$settledRollups({
						sources: networkApplicableSources([
							Source.L2Beat_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmNetworkTopologySettledRollupsResource != null}
									<ResourceBoundary
											resource={evmNetworkTopologySettledRollupsResource}
									>
										{#snippet children(evmRollup)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmRollupsView
													selection={evmNetworkTopologySettledRollupsResource}
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
									{/if}
								{/snippet}

							</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

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
											ownsSection: true,
										},
										{
											id: 'evm-execution-blocks',
											label: 'Blocks',
											ownsSection: true,
										},
										{
											id: 'evm-execution-transactions',
											label: 'Transactions',
											ownsSection: true,
										},
										{
											id: 'evm-execution-mempool',
											label: 'Mempool',
											ownsSection: true,
										},
										{
											id: 'evm-execution-gas-blocks',
											label: 'Fee market',
											ownsSection: true,
										},
										{
											id: 'evm-execution-gas-estimates',
											label: 'Gas estimates',
											ownsSection: true,
										},
										{
											id: 'evm-execution-endpoints',
											label: 'Endpoints',
											ownsSection: true,
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

								{#snippet MarkerEvmExecutionUpgrades(_context, Content)}
									{@const evmExecutionUpgradesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$executionUpgrades({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 512,
					})}
									{#if evmExecutionUpgradesResource != null}
									<ResourceBoundary
											resource={evmExecutionUpgradesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmExecutionUpgrades({ id, label, open, active })}
									{@const evmExecutionUpgradesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$executionUpgrades({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 512,
					})}
									{#if evmExecutionUpgradesResource != null}
									<ResourceBoundary
											resource={evmExecutionUpgradesResource}
									>
										{#snippet children(ethereumExecutionUpgrade)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EthereumExecutionUpgradesView
													selection={evmExecutionUpgradesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmExecutionBlocks(_context, Content)}
									{@const evmExecutionBlocksResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionBlocksResource != null}
									<ResourceBoundary
											resource={evmExecutionBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmExecutionBlocks({ id, label, open, active })}
									{@const evmExecutionBlocksResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionBlocksResource != null}
									<ResourceBoundary
											resource={evmExecutionBlocksResource}
									>
										{#snippet children(evmBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmBlocksView
													selection={evmExecutionBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmExecutionTransactions(_context, Content)}
									{@const evmExecutionTransactionsResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionTransactionsResource != null}
									<ResourceBoundary
											resource={evmExecutionTransactionsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmExecutionTransactions({ id, label, open, active })}
									{@const evmExecutionTransactionsResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionTransactionsResource != null}
									<ResourceBoundary
											resource={evmExecutionTransactionsResource}
									>
										{#snippet children(evmTransaction)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmTransactionsView
													selection={evmExecutionTransactionsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmExecutionMempool(_context, Content)}
									{@const evmExecutionMempoolResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$txpoolTimestamps({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionMempoolResource != null}
									<ResourceBoundary
											resource={evmExecutionMempoolResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmExecutionMempool({ id, label, open, active })}
									{@const evmExecutionMempoolResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$txpoolTimestamps({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionMempoolResource != null}
									<ResourceBoundary
											resource={evmExecutionMempoolResource}
									>
										{#snippet children(evmNetworkTxpoolTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmNetwork_Txpool_TimestampsView
													selection={evmExecutionMempoolResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmExecutionGasBlocks(_context, Content)}
									{@const evmExecutionGasBlocksResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$gasFeeBlocks({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionGasBlocksResource != null}
									<ResourceBoundary
											resource={evmExecutionGasBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmExecutionGasBlocks({ id, label, open, active })}
									{@const evmExecutionGasBlocksResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$gasFeeBlocks({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionGasBlocksResource != null}
									<ResourceBoundary
											resource={evmExecutionGasBlocksResource}
									>
										{#snippet children(evmNetworkGasFeeBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmNetwork_GasFee_BlocksView
													selection={evmExecutionGasBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmExecutionGasEstimates(_context, Content)}
									{@const evmExecutionGasEstimatesResource = (networkApplicableSources([
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$gasEstimateTimestamps({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
							Source.Etherscan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionGasEstimatesResource != null}
									<ResourceBoundary
											resource={evmExecutionGasEstimatesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmExecutionGasEstimates({ id, label, open, active })}
									{@const evmExecutionGasEstimatesResource = (networkApplicableSources([
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$gasEstimateTimestamps({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
							Source.Etherscan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmExecutionGasEstimatesResource != null}
									<ResourceBoundary
											resource={evmExecutionGasEstimatesResource}
									>
										{#snippet children(evmNetworkGasEstimateTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmNetwork_GasEstimate_TimestampsView
													selection={evmExecutionGasEstimatesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmExecutionEndpoints(_context, Content)}
									{@const evmExecutionEndpointsResource = (networkApplicableSources([
					Source.Constants_Internal,
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$rpcUrls({
						sources: networkApplicableSources([
							Source.Constants_Internal,
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.Lifi_Rest,
						], pendingEntity),
					})}
									{#if evmExecutionEndpointsResource != null}
									<ResourceBoundary
											resource={evmExecutionEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmExecutionEndpoints({ id, label, open, active })}
									{@const evmExecutionEndpointsResource = (networkApplicableSources([
					Source.Constants_Internal,
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$rpcUrls({
						sources: networkApplicableSources([
							Source.Constants_Internal,
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.Lifi_Rest,
						], pendingEntity),
					})}
									{#if evmExecutionEndpointsResource != null}
									<ResourceBoundary
											resource={evmExecutionEndpointsResource}
									>
										{#snippet children(url)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<UrlsView
													selection={evmExecutionEndpointsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

							</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Evm.EthereumBeacon}
		>
			{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-evm-consensus-block-production'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'evm-consensus-upgrades',
											label: 'Upgrades',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-finality',
											label: 'Finality',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-committees',
											label: 'Committees',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-sync-committees',
											label: 'Sync committees',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-attestations',
											label: 'Attestations',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-withdrawals',
											label: 'Withdrawals',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-slashings',
											label: 'Slashings',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-validators',
											label: 'Validators',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-epochs',
											label: 'Epochs',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-slots',
											label: 'Slots',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-mev-relays',
											label: 'Relays',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-mev-builders',
											label: 'Builders',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-mev-boost',
											label: 'MEV-Boost',
											ownsSection: true,
										},
										{
											id: 'evm-consensus-endpoints',
											label: 'Endpoints',
											ownsSection: true,
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

								{#snippet MarkerEvmConsensusUpgrades(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusUpgradesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$consensusUpgrades({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 512,
					})}
									{#if evmConsensusBlockProductionEvmConsensusUpgradesResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusUpgradesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusUpgrades({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusUpgradesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$consensusUpgrades({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 512,
					})}
									{#if evmConsensusBlockProductionEvmConsensusUpgradesResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusUpgradesResource}
									>
										{#snippet children(ethereumConsensusUpgrade)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EthereumConsensusUpgradesView
													selection={evmConsensusBlockProductionEvmConsensusUpgradesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusFinality(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusFinalityResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconFinalityTimestamps({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusFinalityResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusFinalityResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusFinality({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusFinalityResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconFinalityTimestamps({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusFinalityResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusFinalityResource}
									>
										{#snippet children(ethereumBeaconFinalityTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EthereumBeaconFinality_TimestampsView
													selection={evmConsensusBlockProductionEvmConsensusFinalityResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusCommittees(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusCommitteesResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconCommittees({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusCommitteesResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusCommitteesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusCommittees({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusCommitteesResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconCommittees({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusCommitteesResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusCommitteesResource}
									>
										{#snippet children(beaconCommittee)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconCommitteesView
													selection={evmConsensusBlockProductionEvmConsensusCommitteesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusSyncCommittees(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusSyncCommitteesResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconSyncCommittees({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusSyncCommitteesResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusSyncCommitteesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusSyncCommittees({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusSyncCommitteesResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconSyncCommittees({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusSyncCommitteesResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusSyncCommitteesResource}
									>
										{#snippet children(beaconSyncCommittee)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconSyncCommitteesView
													selection={evmConsensusBlockProductionEvmConsensusSyncCommitteesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusAttestations(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusAttestationsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconAttestations({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusAttestationsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusAttestationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusAttestations({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusAttestationsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconAttestations({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusAttestationsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusAttestationsResource}
									>
										{#snippet children(beaconAttestation)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconAttestationsView
													selection={evmConsensusBlockProductionEvmConsensusAttestationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusWithdrawals(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusWithdrawalsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconWithdrawals({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusWithdrawalsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusWithdrawalsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusWithdrawals({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusWithdrawalsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconWithdrawals({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusWithdrawalsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusWithdrawalsResource}
									>
										{#snippet children(beaconWithdrawal)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconWithdrawalsView
													selection={evmConsensusBlockProductionEvmConsensusWithdrawalsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusSlashings(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusSlashingsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconSlashings({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusSlashingsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusSlashingsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusSlashings({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusSlashingsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconSlashings({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusSlashingsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusSlashingsResource}
									>
										{#snippet children(beaconSlashing)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconSlashingsView
													selection={evmConsensusBlockProductionEvmConsensusSlashingsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusValidators(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusValidatorsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconValidators({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusValidatorsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusValidators({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusValidatorsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconValidators({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusValidatorsResource}
									>
										{#snippet children(beaconValidator)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconValidatorsView
													selection={evmConsensusBlockProductionEvmConsensusValidatorsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusEpochs(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusEpochsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconEpochs({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusEpochsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusEpochsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusEpochs({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusEpochsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconEpochs({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusEpochsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusEpochsResource}
									>
										{#snippet children(beaconEpoch)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconEpochsView
													selection={evmConsensusBlockProductionEvmConsensusEpochsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusSlots(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusSlotsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconSlots({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusSlotsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusSlotsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusSlots({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusSlotsResource = (networkApplicableSources([
					Source.Beacon_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$beaconSlots({
						sources: networkApplicableSources([
							Source.Beacon_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusSlotsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusSlotsResource}
									>
										{#snippet children(beaconSlot)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BeaconSlotsView
													selection={evmConsensusBlockProductionEvmConsensusSlotsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusMevRelays(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusMevRelaysResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$mevRelays({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 64,
					})}
									{#if evmConsensusBlockProductionEvmConsensusMevRelaysResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusMevRelaysResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusMevRelays({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusMevRelaysResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$mevRelays({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 64,
					})}
									{#if evmConsensusBlockProductionEvmConsensusMevRelaysResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusMevRelaysResource}
									>
										{#snippet children(mevRelay)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<MevRelaysView
													selection={evmConsensusBlockProductionEvmConsensusMevRelaysResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusMevBuilders(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusMevBuildersResource = (networkApplicableSources([
					Source.MevRelay_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$mevBuilders({
						sources: networkApplicableSources([
							Source.MevRelay_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusMevBuildersResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusMevBuildersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusMevBuilders({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusMevBuildersResource = (networkApplicableSources([
					Source.MevRelay_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$mevBuilders({
						sources: networkApplicableSources([
							Source.MevRelay_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusMevBuildersResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusMevBuildersResource}
									>
										{#snippet children(mevBuilder)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<MevBuildersView
													selection={evmConsensusBlockProductionEvmConsensusMevBuildersResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusMevBoost(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusMevBoostResource = (networkApplicableSources([
					Source.MevRelay_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$mevProposerPayloadDelivered({
						sources: networkApplicableSources([
							Source.MevRelay_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusMevBoostResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusMevBoostResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusMevBoost({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusMevBoostResource = (networkApplicableSources([
					Source.MevRelay_Rest,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.$$mevProposerPayloadDelivered({
						sources: networkApplicableSources([
							Source.MevRelay_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmConsensusBlockProductionEvmConsensusMevBoostResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusMevBoostResource}
									>
										{#snippet children(mevRelayProposerPayloadDelivered)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<MevRelay_ProposerPayloadDeliveredsView
													selection={evmConsensusBlockProductionEvmConsensusMevBoostResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmConsensusEndpoints(_context, Content)}
									{@const evmConsensusBlockProductionEvmConsensusEndpointsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.consensusEndpoints({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if evmConsensusBlockProductionEvmConsensusEndpointsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmConsensusEndpoints({ id, label, open, active })}
									{@const evmConsensusBlockProductionEvmConsensusEndpointsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection.Evm
					.consensusEndpoints({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if evmConsensusBlockProductionEvmConsensusEndpointsResource != null}
									<ResourceBoundary
											resource={evmConsensusBlockProductionEvmConsensusEndpointsResource}
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
									{/if}
								{/snippet}

							</CollapsibleTabs>
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
											ownsSection: true,
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

								{#snippet MarkerEvmDataAvailabilityBlobs(_context, Content)}
									{@const evmDataAvailabilityBlobsResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blobs({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmDataAvailabilityBlobsResource != null}
									<ResourceBoundary
											resource={evmDataAvailabilityBlobsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmDataAvailabilityBlobs({ id, label, open, active })}
									{@const evmDataAvailabilityBlobsResource = (networkApplicableSources([
					Source.Voltaire_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blobs({
						sources: networkApplicableSources([
							Source.Voltaire_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmDataAvailabilityBlobsResource != null}
									<ResourceBoundary
											resource={evmDataAvailabilityBlobsResource}
									>
										{#snippet children(evmBlob)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmBlobsView
													selection={evmDataAvailabilityBlobsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'evm-contracts-verified',
											label: 'Verified contracts',
											ownsSection: true,
										},
										{
											id: 'evm-contracts-smart-accounts',
											label: 'Smart accounts',
											ownsSection: true,
										},
										{
											id: 'evm-contracts-bundlers',
											label: 'Bundlers',
											ownsSection: true,
										},
										{
											id: 'evm-contracts-paymasters',
											label: 'Paymasters',
											ownsSection: true,
										},
										{
											id: 'evm-contracts-user-operations',
											label: 'User operations',
											ownsSection: true,
										},
										{
											id: 'evm-contracts-factories',
											label: 'Factories',
											ownsSection: true,
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

								{#snippet MarkerEvmContractsPrecompiles(_context, Content)}
									{@const evmContractsAccountsEvmContractsPrecompilesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$precompiles({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 64,
					})}
									{#if evmContractsAccountsEvmContractsPrecompilesResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsPrecompilesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmContractsPrecompiles({ id, label, open, active })}
									{@const evmContractsAccountsEvmContractsPrecompilesResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$precompiles({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 64,
					})}
									{#if evmContractsAccountsEvmContractsPrecompilesResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsPrecompilesResource}
									>
										{#snippet children(evmContract)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmContractsView
													selection={evmContractsAccountsEvmContractsPrecompilesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmContractsVerified(_context, Content)}
									{@const evmContractsAccountsEvmContractsVerifiedResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$contracts({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsVerifiedResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsVerifiedResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmContractsVerified({ id, label, open, active })}
									{@const evmContractsAccountsEvmContractsVerifiedResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$contracts({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsVerifiedResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsVerifiedResource}
									>
										{#snippet children(evmContract)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmContractsView
													selection={evmContractsAccountsEvmContractsVerifiedResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmContractsSmartAccounts(_context, Content)}
									{@const evmContractsAccountsEvmContractsSmartAccountsResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337SmartAccounts({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsSmartAccountsResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsSmartAccountsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmContractsSmartAccounts({ id, label, open, active })}
									{@const evmContractsAccountsEvmContractsSmartAccountsResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337SmartAccounts({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsSmartAccountsResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsSmartAccountsResource}
									>
										{#snippet children(erc4337SmartAccount)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<Erc4337SmartAccountsView
													selection={evmContractsAccountsEvmContractsSmartAccountsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmContractsBundlers(_context, Content)}
									{@const evmContractsAccountsEvmContractsBundlersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337Bundlers({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsBundlersResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsBundlersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmContractsBundlers({ id, label, open, active })}
									{@const evmContractsAccountsEvmContractsBundlersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337Bundlers({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsBundlersResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsBundlersResource}
									>
										{#snippet children(erc4337Bundler)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<Erc4337BundlersView
													selection={evmContractsAccountsEvmContractsBundlersResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmContractsPaymasters(_context, Content)}
									{@const evmContractsAccountsEvmContractsPaymastersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337Paymasters({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsPaymastersResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsPaymastersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmContractsPaymasters({ id, label, open, active })}
									{@const evmContractsAccountsEvmContractsPaymastersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337Paymasters({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsPaymastersResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsPaymastersResource}
									>
										{#snippet children(erc4337Paymaster)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<Erc4337PaymastersView
													selection={evmContractsAccountsEvmContractsPaymastersResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmContractsUserOperations(_context, Content)}
									{@const evmContractsAccountsEvmContractsUserOperationsResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$userOperations({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsUserOperationsResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsUserOperationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmContractsUserOperations({ id, label, open, active })}
									{@const evmContractsAccountsEvmContractsUserOperationsResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$userOperations({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsUserOperationsResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsUserOperationsResource}
									>
										{#snippet children(evmUserOperation)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmUserOperationsView
													selection={evmContractsAccountsEvmContractsUserOperationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmContractsFactories(_context, Content)}
									{@const evmContractsAccountsEvmContractsFactoriesResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337AccountFactories({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsFactoriesResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsFactoriesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmContractsFactories({ id, label, open, active })}
									{@const evmContractsAccountsEvmContractsFactoriesResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc4337AccountFactories({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmContractsAccountsEvmContractsFactoriesResource != null}
									<ResourceBoundary
											resource={evmContractsAccountsEvmContractsFactoriesResource}
									>
										{#snippet children(erc4337AccountFactory)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<Erc4337AccountFactoriesView
													selection={evmContractsAccountsEvmContractsFactoriesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'evm-assets-native-instance',
											label: 'Native coin instance',
											ownsSection: true,
										},
										{
											id: 'evm-assets-native-assets',
											label: 'Native assets',
											ownsSection: true,
										},
										{
											id: 'evm-assets-bridges',
											label: 'Bridges',
											ownsSection: true,
										},
										{
											id: 'evm-assets-erc20-transfers',
											label: 'ERC-20 transfers',
											ownsSection: true,
										},
										{
											id: 'evm-assets-nft-transfers',
											label: 'NFT transfers',
											ownsSection: true,
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

								{#snippet MarkerEvmAssetsNativeCoin(_context, Content)}
									{@const evmAssetsNativeCoinResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$nativeCoin({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if evmAssetsNativeCoinResource != null}
									<ResourceBoundary
											resource={evmAssetsNativeCoinResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmAssetsNativeCoin({ id, label, open, active })}
									{@const evmAssetsNativeCoinResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$nativeCoin({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if evmAssetsNativeCoinResource != null}
									<ResourceBoundary
											resource={evmAssetsNativeCoinResource}
									>
										{#snippet children(coin)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
																	{#if coin != null}
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
																				href={
																					(
																						coin[EntityMetaKey.Selector] != null && 'coinId' in coin[EntityMetaKey.Selector]
																						&& coin[EntityMetaKey.Selector].coinId != null ?
																							resolve('/coin/[coinId=stringSegment]', {
																						coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
																					})
																					:
																							undefined
																					)
																				}
																				layout={EntityLayout.SummaryInline}
																				open={false}
																			/>
																		</article>
																	{/if}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmAssetsNativeInstance(_context, Content)}
									{@const evmAssetsNativeInstanceResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$nativeCoinInstance({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if evmAssetsNativeInstanceResource != null}
									<ResourceBoundary
											resource={evmAssetsNativeInstanceResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmAssetsNativeInstance({ id, label, open, active })}
									{@const evmAssetsNativeInstanceResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$nativeCoinInstance({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if evmAssetsNativeInstanceResource != null}
									<ResourceBoundary
											resource={evmAssetsNativeInstanceResource}
									>
										{#snippet children(evmCoinInstance)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
																	{#if evmCoinInstance != null}
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
																				href={
																					(
																						evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
																						&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
																						&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
																						&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
																						&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
																							resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
																						chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
																						coinInstanceSlug: String('native'),
																					})
																					:
																							evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
																							&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
																							&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
																							&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
																							&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
																							&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
																							&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
																							&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
																								resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
																							coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
																							chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
																						})
																						:
																							undefined
																					)
																				}
																				layout={EntityLayout.SummaryInline}
																				open={false}
																			/>
																		</article>
																	{/if}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmAssetsNativeAssets(_context, Content)}
									{@const evmAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={evmAssetsNativeAssetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmAssetsNativeAssets({ id, label, open, active })}
									{@const evmAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={evmAssetsNativeAssetsResource}
									>
										{#snippet children(assetInstance)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<AssetInstancesView
													selection={evmAssetsNativeAssetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmAssetsBridges(_context, Content)}
									{@const evmAssetsBridgesResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$bridges({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.Lifi_Rest,
						], pendingEntity),
					})}
									{#if evmAssetsBridgesResource != null}
									<ResourceBoundary
											resource={evmAssetsBridgesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmAssetsBridges({ id, label, open, active })}
									{@const evmAssetsBridgesResource = (networkApplicableSources([
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$bridges({
						sources: networkApplicableSources([
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.Lifi_Rest,
						], pendingEntity),
					})}
									{#if evmAssetsBridgesResource != null}
									<ResourceBoundary
											resource={evmAssetsBridgesResource}
									>
										{#snippet children(evmNetworkBridge)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmNetworkBridgesView
													selection={evmAssetsBridgesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmAssetsErc20Transfers(_context, Content)}
									{@const evmAssetsErc20TransfersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc20TokenTransfers({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmAssetsErc20TransfersResource != null}
									<ResourceBoundary
											resource={evmAssetsErc20TransfersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmAssetsErc20Transfers({ id, label, open, active })}
									{@const evmAssetsErc20TransfersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$erc20TokenTransfers({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmAssetsErc20TransfersResource != null}
									<ResourceBoundary
											resource={evmAssetsErc20TransfersResource}
									>
										{#snippet children(evmTokenTransfer)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmTokenTransfersView
													selection={evmAssetsErc20TransfersResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmAssetsNftTransfers(_context, Content)}
									{@const evmAssetsNftTransfersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$nftTokenTransfers({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmAssetsNftTransfersResource != null}
									<ResourceBoundary
											resource={evmAssetsNftTransfersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmAssetsNftTransfers({ id, label, open, active })}
									{@const evmAssetsNftTransfersResource = (networkApplicableSources([
					Source.Blockscout_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$nftTokenTransfers({
						sources: networkApplicableSources([
							Source.Blockscout_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if evmAssetsNftTransfersResource != null}
									<ResourceBoundary
											resource={evmAssetsNftTransfersResource}
									>
										{#snippet children(evmTokenTransfer)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<EvmTokenTransfersView
													selection={evmAssetsNftTransfersResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'evm-resources-block-explorers',
											label: 'Block explorers',
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

								{#snippet MarkerEvmResourcesFaucets(_context, Content)}
									{@const evmResourcesFaucetsResource = (networkApplicableSources([
					Source.Constants_Internal,
					Source.Chainlist_Rest,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$faucetUrls({
						sources: networkApplicableSources([
							Source.Constants_Internal,
							Source.Chainlist_Rest,
						], pendingEntity),
					})}
									{#if evmResourcesFaucetsResource != null}
									<ResourceBoundary
											resource={evmResourcesFaucetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmResourcesFaucets({ id, label, open, active })}
									{@const evmResourcesFaucetsResource = (networkApplicableSources([
					Source.Constants_Internal,
					Source.Chainlist_Rest,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$faucetUrls({
						sources: networkApplicableSources([
							Source.Constants_Internal,
							Source.Chainlist_Rest,
						], pendingEntity),
					})}
									{#if evmResourcesFaucetsResource != null}
									<ResourceBoundary
											resource={evmResourcesFaucetsResource}
									>
										{#snippet children(url)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<UrlsView
													selection={evmResourcesFaucetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerEvmResourcesBlockExplorers(_context, Content)}
									{@const evmResourcesBlockExplorersResource = (networkApplicableSources([
					Source.Constants_Internal,
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$blockExplorerUrls({
						sources: networkApplicableSources([
							Source.Constants_Internal,
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.Lifi_Rest,
						], pendingEntity),
					})}
									{#if evmResourcesBlockExplorersResource != null}
									<ResourceBoundary
											resource={evmResourcesBlockExplorersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionEvmResourcesBlockExplorers({ id, label, open, active })}
									{@const evmResourcesBlockExplorersResource = (networkApplicableSources([
					Source.Constants_Internal,
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$blockExplorerUrls({
						sources: networkApplicableSources([
							Source.Constants_Internal,
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
							Source.Lifi_Rest,
						], pendingEntity),
					})}
									{#if evmResourcesBlockExplorersResource != null}
									<ResourceBoundary
											resource={evmResourcesBlockExplorersResource}
									>
										{#snippet children(url)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<UrlsView
													selection={evmResourcesBlockExplorersResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'cosmos-consensus-validators',
											label: 'Validators',
											ownsSection: true,
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

								{#snippet MarkerCosmosConsensusBlocks(_context, Content)}
									{@const cosmosConsensusBlockProductionCosmosConsensusBlocksResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosConsensusBlockProductionCosmosConsensusBlocksResource != null}
									<ResourceBoundary
											resource={cosmosConsensusBlockProductionCosmosConsensusBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCosmosConsensusBlocks({ id, label, open, active })}
									{@const cosmosConsensusBlockProductionCosmosConsensusBlocksResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosConsensusBlockProductionCosmosConsensusBlocksResource != null}
									<ResourceBoundary
											resource={cosmosConsensusBlockProductionCosmosConsensusBlocksResource}
									>
										{#snippet children(cosmosBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CosmosBlocksView
													selection={cosmosConsensusBlockProductionCosmosConsensusBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerCosmosConsensusValidators(_context, Content)}
									{@const cosmosConsensusBlockProductionCosmosConsensusValidatorsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosConsensusBlockProductionCosmosConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={cosmosConsensusBlockProductionCosmosConsensusValidatorsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCosmosConsensusValidators({ id, label, open, active })}
									{@const cosmosConsensusBlockProductionCosmosConsensusValidatorsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosConsensusBlockProductionCosmosConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={cosmosConsensusBlockProductionCosmosConsensusValidatorsResource}
									>
										{#snippet children(cosmosValidator)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CosmosValidatorsView
													selection={cosmosConsensusBlockProductionCosmosConsensusValidatorsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerCosmosContractsAccountsAccounts(_context, Content)}
									{@const cosmosContractsAccountsAccountsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosContractsAccountsAccountsResource != null}
									<ResourceBoundary
											resource={cosmosContractsAccountsAccountsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCosmosContractsAccountsAccounts({ id, label, open, active })}
									{@const cosmosContractsAccountsAccountsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosContractsAccountsAccountsResource != null}
									<ResourceBoundary
											resource={cosmosContractsAccountsAccountsResource}
									>
										{#snippet children(cosmosAccount)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CosmosAccountsView
													selection={cosmosContractsAccountsAccountsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerCosmosGovernanceProposals(_context, Content)}
									{@const cosmosGovernanceProposalsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$governanceProposals({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosGovernanceProposalsResource != null}
									<ResourceBoundary
											resource={cosmosGovernanceProposalsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCosmosGovernanceProposals({ id, label, open, active })}
									{@const cosmosGovernanceProposalsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$governanceProposals({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cosmosGovernanceProposalsResource != null}
									<ResourceBoundary
											resource={cosmosGovernanceProposalsResource}
									>
										{#snippet children(cosmosGovernanceProposal)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CosmosGovernanceProposalsView
													selection={cosmosGovernanceProposalsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerCosmosResourcesEndpoints(_context, Content)}
									{@const cosmosResourcesEndpointsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
					})}
									{#if cosmosResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={cosmosResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCosmosResourcesEndpoints({ id, label, open, active })}
									{@const cosmosResourcesEndpointsResource = (networkApplicableSources([
					Source.CosmosSdk_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.CosmosSdk_Rest,
						], pendingEntity),
					})}
									{#if cosmosResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={cosmosResourcesEndpointsResource}
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
														{#each restEndpointsField.values as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'polkadot-consensus-validators',
											label: 'Validators',
											ownsSection: true,
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

								{#snippet MarkerPolkadotConsensusBlocks(_context, Content)}
									{@const polkadotConsensusBlockProductionPolkadotConsensusBlocksResource = (networkApplicableSources([
					Source.Polkadot_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Polkadot_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if polkadotConsensusBlockProductionPolkadotConsensusBlocksResource != null}
									<ResourceBoundary
											resource={polkadotConsensusBlockProductionPolkadotConsensusBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionPolkadotConsensusBlocks({ id, label, open, active })}
									{@const polkadotConsensusBlockProductionPolkadotConsensusBlocksResource = (networkApplicableSources([
					Source.Polkadot_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Polkadot_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if polkadotConsensusBlockProductionPolkadotConsensusBlocksResource != null}
									<ResourceBoundary
											resource={polkadotConsensusBlockProductionPolkadotConsensusBlocksResource}
									>
										{#snippet children(polkadotBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<PolkadotBlocksView
													selection={polkadotConsensusBlockProductionPolkadotConsensusBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerPolkadotConsensusValidators(_context, Content)}
									{@const polkadotConsensusBlockProductionPolkadotConsensusValidatorsResource = (networkApplicableSources([
					Source.SubstrateSidecar_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.SubstrateSidecar_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if polkadotConsensusBlockProductionPolkadotConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={polkadotConsensusBlockProductionPolkadotConsensusValidatorsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionPolkadotConsensusValidators({ id, label, open, active })}
									{@const polkadotConsensusBlockProductionPolkadotConsensusValidatorsResource = (networkApplicableSources([
					Source.SubstrateSidecar_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.SubstrateSidecar_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if polkadotConsensusBlockProductionPolkadotConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={polkadotConsensusBlockProductionPolkadotConsensusValidatorsResource}
									>
										{#snippet children(polkadotValidator)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<PolkadotValidatorsView
													selection={polkadotConsensusBlockProductionPolkadotConsensusValidatorsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerPolkadotAssetsNativeAssets(_context, Content)}
									{@const polkadotAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if polkadotAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={polkadotAssetsNativeAssetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionPolkadotAssetsNativeAssets({ id, label, open, active })}
									{@const polkadotAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if polkadotAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={polkadotAssetsNativeAssetsResource}
									>
										{#snippet children(assetInstance)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<AssetInstancesView
													selection={polkadotAssetsNativeAssetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerPolkadotResourcesEndpoints(_context, Content)}
									{@const polkadotResourcesEndpointsResource = (networkApplicableSources([
					Source.Polkadot_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Polkadot_JsonRpc,
						], pendingEntity),
					})}
									{#if polkadotResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={polkadotResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionPolkadotResourcesEndpoints({ id, label, open, active })}
									{@const polkadotResourcesEndpointsResource = (networkApplicableSources([
					Source.Polkadot_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Polkadot_JsonRpc,
						], pendingEntity),
					})}
									{#if polkadotResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={polkadotResourcesEndpointsResource}
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
														{#each rpcEndpointsField.values as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'solana-execution-transactions',
											label: 'Transactions',
											ownsSection: true,
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

								{#snippet MarkerSolanaExecutionBlocks(_context, Content)}
									{@const solanaExecutionBlocksResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaExecutionBlocksResource != null}
									<ResourceBoundary
											resource={solanaExecutionBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaExecutionBlocks({ id, label, open, active })}
									{@const solanaExecutionBlocksResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaExecutionBlocksResource != null}
									<ResourceBoundary
											resource={solanaExecutionBlocksResource}
									>
										{#snippet children(solanaBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<SolanaBlocksView
													selection={solanaExecutionBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerSolanaExecutionTransactions(_context, Content)}
									{@const solanaExecutionTransactionsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaExecutionTransactionsResource != null}
									<ResourceBoundary
											resource={solanaExecutionTransactionsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaExecutionTransactions({ id, label, open, active })}
									{@const solanaExecutionTransactionsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaExecutionTransactionsResource != null}
									<ResourceBoundary
											resource={solanaExecutionTransactionsResource}
									>
										{#snippet children(solanaTransaction)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<SolanaTransactionsView
													selection={solanaExecutionTransactionsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerSolanaConsensusValidators(_context, Content)}
									{@const solanaConsensusBlockProductionSolanaConsensusValidatorsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaConsensusBlockProductionSolanaConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={solanaConsensusBlockProductionSolanaConsensusValidatorsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaConsensusValidators({ id, label, open, active })}
									{@const solanaConsensusBlockProductionSolanaConsensusValidatorsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaConsensusBlockProductionSolanaConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={solanaConsensusBlockProductionSolanaConsensusValidatorsResource}
									>
										{#snippet children(solanaValidator)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<SolanaValidatorsView
													selection={solanaConsensusBlockProductionSolanaConsensusValidatorsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'solana-contracts-accounts-programs',
											label: 'Programs',
											ownsSection: true,
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

								{#snippet MarkerSolanaContractsAccountsAccounts(_context, Content)}
									{@const solanaContractsAccountsAccountsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaContractsAccountsAccountsResource != null}
									<ResourceBoundary
											resource={solanaContractsAccountsAccountsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaContractsAccountsAccounts({ id, label, open, active })}
									{@const solanaContractsAccountsAccountsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaContractsAccountsAccountsResource != null}
									<ResourceBoundary
											resource={solanaContractsAccountsAccountsResource}
									>
										{#snippet children(solanaAccount)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<SolanaAccountsView
													selection={solanaContractsAccountsAccountsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerSolanaContractsAccountsPrograms(_context, Content)}
									{@const solanaContractsAccountsProgramsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$programs({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaContractsAccountsProgramsResource != null}
									<ResourceBoundary
											resource={solanaContractsAccountsProgramsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaContractsAccountsPrograms({ id, label, open, active })}
									{@const solanaContractsAccountsProgramsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$programs({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaContractsAccountsProgramsResource != null}
									<ResourceBoundary
											resource={solanaContractsAccountsProgramsResource}
									>
										{#snippet children(solanaProgram)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<SolanaProgramsView
													selection={solanaContractsAccountsProgramsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'solana-assets-token-accounts',
											label: 'Token accounts',
											ownsSection: true,
										},
										{
											id: 'solana-assets-token-mints',
											label: 'Token mints',
											ownsSection: true,
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

								{#snippet MarkerSolanaAssetsNativeAssets(_context, Content)}
									{@const solanaAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if solanaAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={solanaAssetsNativeAssetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaAssetsNativeAssets({ id, label, open, active })}
									{@const solanaAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if solanaAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={solanaAssetsNativeAssetsResource}
									>
										{#snippet children(assetInstance)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<AssetInstancesView
													selection={solanaAssetsNativeAssetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerSolanaAssetsTokenAccounts(_context, Content)}
									{@const solanaAssetsTokenAccountsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$tokenAccounts({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaAssetsTokenAccountsResource != null}
									<ResourceBoundary
											resource={solanaAssetsTokenAccountsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaAssetsTokenAccounts({ id, label, open, active })}
									{@const solanaAssetsTokenAccountsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$tokenAccounts({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaAssetsTokenAccountsResource != null}
									<ResourceBoundary
											resource={solanaAssetsTokenAccountsResource}
									>
										{#snippet children(solanaTokenAccount)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<SolanaTokenAccountsView
													selection={solanaAssetsTokenAccountsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerSolanaAssetsTokenMints(_context, Content)}
									{@const solanaAssetsTokenMintsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$tokenMints({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaAssetsTokenMintsResource != null}
									<ResourceBoundary
											resource={solanaAssetsTokenMintsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaAssetsTokenMints({ id, label, open, active })}
									{@const solanaAssetsTokenMintsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$tokenMints({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if solanaAssetsTokenMintsResource != null}
									<ResourceBoundary
											resource={solanaAssetsTokenMintsResource}
									>
										{#snippet children(solanaTokenMint)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<SolanaTokenMintsView
													selection={solanaAssetsTokenMintsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerSolanaResourcesEndpoints(_context, Content)}
									{@const solanaResourcesEndpointsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
					})}
									{#if solanaResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={solanaResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionSolanaResourcesEndpoints({ id, label, open, active })}
									{@const solanaResourcesEndpointsResource = (networkApplicableSources([
					Source.Solana_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Solana_JsonRpc,
						], pendingEntity),
					})}
									{#if solanaResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={solanaResourcesEndpointsResource}
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
														{#each rpcEndpointsField.values as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'utxo-consensus-blocks',
											label: 'Blocks',
											ownsSection: true,
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

								{#snippet MarkerUtxoConsensusObservations(_context, Content)}
									{@const utxoChainActivityUtxoConsensusObservationsResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
							Source.Blockchair_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoChainActivityUtxoConsensusObservationsResource != null}
									<ResourceBoundary
											resource={utxoChainActivityUtxoConsensusObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionUtxoConsensusObservations({ id, label, open, active })}
									{@const utxoChainActivityUtxoConsensusObservationsResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
							Source.Blockchair_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoChainActivityUtxoConsensusObservationsResource != null}
									<ResourceBoundary
											resource={utxoChainActivityUtxoConsensusObservationsResource}
									>
										{#snippet children(networkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<Network_TimestampsView
													selection={utxoChainActivityUtxoConsensusObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerUtxoConsensusBlocks(_context, Content)}
									{@const utxoChainActivityUtxoConsensusBlocksResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
							Source.Blockchair_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoChainActivityUtxoConsensusBlocksResource != null}
									<ResourceBoundary
											resource={utxoChainActivityUtxoConsensusBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionUtxoConsensusBlocks({ id, label, open, active })}
									{@const utxoChainActivityUtxoConsensusBlocksResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
							Source.Blockchair_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoChainActivityUtxoConsensusBlocksResource != null}
									<ResourceBoundary
											resource={utxoChainActivityUtxoConsensusBlocksResource}
									>
										{#snippet children(utxoBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<UtxoBlocksView
													selection={utxoChainActivityUtxoConsensusBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'utxo-execution-mempool',
											label: 'Mempool',
											ownsSection: true,
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

								{#snippet MarkerUtxoExecutionTransactions(_context, Content)}
									{@const utxoTransactionGraphUtxoExecutionTransactionsResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
					Source.Zcashd_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
							Source.Blockchair_Rest,
							Source.Zcashd_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoTransactionGraphUtxoExecutionTransactionsResource != null}
									<ResourceBoundary
											resource={utxoTransactionGraphUtxoExecutionTransactionsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionUtxoExecutionTransactions({ id, label, open, active })}
									{@const utxoTransactionGraphUtxoExecutionTransactionsResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
					Source.Zcashd_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
							Source.Blockchair_Rest,
							Source.Zcashd_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoTransactionGraphUtxoExecutionTransactionsResource != null}
									<ResourceBoundary
											resource={utxoTransactionGraphUtxoExecutionTransactionsResource}
									>
										{#snippet children(utxoTransaction)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<UtxoTransactionsView
													selection={utxoTransactionGraphUtxoExecutionTransactionsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerUtxoExecutionMempool(_context, Content)}
									{@const utxoTransactionGraphUtxoExecutionMempoolResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoTransactionGraphUtxoExecutionMempoolResource != null}
									<ResourceBoundary
											resource={utxoTransactionGraphUtxoExecutionMempoolResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionUtxoExecutionMempool({ id, label, open, active })}
									{@const utxoTransactionGraphUtxoExecutionMempoolResource = (networkApplicableSources([
					Source.MempoolSpace_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.MempoolSpace_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if utxoTransactionGraphUtxoExecutionMempoolResource != null}
									<ResourceBoundary
											resource={utxoTransactionGraphUtxoExecutionMempoolResource}
									>
										{#snippet children(utxoTransaction)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<UtxoTransactionsView
													selection={utxoTransactionGraphUtxoExecutionMempoolResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerUtxoAssetsNativeAssets(_context, Content)}
									{@const utxoAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if utxoAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={utxoAssetsNativeAssetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionUtxoAssetsNativeAssets({ id, label, open, active })}
									{@const utxoAssetsNativeAssetsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : selection
					.$$nativeAssets({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if utxoAssetsNativeAssetsResource != null}
									<ResourceBoundary
											resource={utxoAssetsNativeAssetsResource}
									>
										{#snippet children(assetInstance)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<AssetInstancesView
													selection={utxoAssetsNativeAssetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerZcashShieldedPools(_context, Content)}
									{@const zcashShieldedProtocolZcashShieldedPoolsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$shieldedPools({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if zcashShieldedProtocolZcashShieldedPoolsResource != null}
									<ResourceBoundary
											resource={zcashShieldedProtocolZcashShieldedPoolsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionZcashShieldedPools({ id, label, open, active })}
									{@const zcashShieldedProtocolZcashShieldedPoolsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$shieldedPools({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if zcashShieldedProtocolZcashShieldedPoolsResource != null}
									<ResourceBoundary
											resource={zcashShieldedProtocolZcashShieldedPoolsResource}
									>
										{#snippet children(zcashShieldedPool)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<ZcashShieldedPoolsView
													selection={zcashShieldedProtocolZcashShieldedPoolsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'bittensor-chain-blocks',
											label: 'Blocks',
											ownsSection: true,
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

								{#snippet MarkerBittensorChainObservations(_context, Content)}
									{@const bittensorChainActivityBittensorChainObservationsResource = (networkApplicableSources([
					Source.Bittensor_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.Bittensor_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if bittensorChainActivityBittensorChainObservationsResource != null}
									<ResourceBoundary
											resource={bittensorChainActivityBittensorChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionBittensorChainObservations({ id, label, open, active })}
									{@const bittensorChainActivityBittensorChainObservationsResource = (networkApplicableSources([
					Source.Bittensor_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.Bittensor_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if bittensorChainActivityBittensorChainObservationsResource != null}
									<ResourceBoundary
											resource={bittensorChainActivityBittensorChainObservationsResource}
									>
										{#snippet children(bittensorNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BittensorNetwork_TimestampsView
													selection={bittensorChainActivityBittensorChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerBittensorChainBlocks(_context, Content)}
									{@const bittensorChainActivityBittensorChainBlocksResource = (networkApplicableSources([
					Source.Bittensor_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Bittensor_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if bittensorChainActivityBittensorChainBlocksResource != null}
									<ResourceBoundary
											resource={bittensorChainActivityBittensorChainBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionBittensorChainBlocks({ id, label, open, active })}
									{@const bittensorChainActivityBittensorChainBlocksResource = (networkApplicableSources([
					Source.Bittensor_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Bittensor_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if bittensorChainActivityBittensorChainBlocksResource != null}
									<ResourceBoundary
											resource={bittensorChainActivityBittensorChainBlocksResource}
									>
										{#snippet children(bittensorBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BittensorBlocksView
													selection={bittensorChainActivityBittensorChainBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerBittensorSubnetsSubnets(_context, Content)}
									{@const bittensorSubnetsSubnetsResource = (networkApplicableSources([
					Source.Bittensor_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$subnets({
						sources: networkApplicableSources([
							Source.Bittensor_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if bittensorSubnetsSubnetsResource != null}
									<ResourceBoundary
											resource={bittensorSubnetsSubnetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionBittensorSubnetsSubnets({ id, label, open, active })}
									{@const bittensorSubnetsSubnetsResource = (networkApplicableSources([
					Source.Bittensor_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$subnets({
						sources: networkApplicableSources([
							Source.Bittensor_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if bittensorSubnetsSubnetsResource != null}
									<ResourceBoundary
											resource={bittensorSubnetsSubnetsResource}
									>
										{#snippet children(bittensorSubnet)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<BittensorSubnetsView
													selection={bittensorSubnetsSubnetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'zero-g-storage-nodes',
											label: 'Storage nodes',
											ownsSection: true,
										},
										{
											id: 'zero-g-storage-data-blobs',
											label: 'Data blobs',
											ownsSection: true,
										},
										{
											id: 'zero-g-storage-log-entries',
											label: 'Storage log entries',
											ownsSection: true,
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

								{#snippet MarkerZeroGStorageObservations(_context, Content)}
									{@const zeroGStorageObservationsResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageObservationsResource != null}
									<ResourceBoundary
											resource={zeroGStorageObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionZeroGStorageObservations({ id, label, open, active })}
									{@const zeroGStorageObservationsResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageObservationsResource != null}
									<ResourceBoundary
											resource={zeroGStorageObservationsResource}
									>
										{#snippet children(zeroGNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<ZeroGNetwork_TimestampsView
													selection={zeroGStorageObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerZeroGStorageNodes(_context, Content)}
									{@const zeroGStorageNodesResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$storageNodes({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageNodesResource != null}
									<ResourceBoundary
											resource={zeroGStorageNodesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionZeroGStorageNodes({ id, label, open, active })}
									{@const zeroGStorageNodesResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$storageNodes({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageNodesResource != null}
									<ResourceBoundary
											resource={zeroGStorageNodesResource}
									>
										{#snippet children(zeroGStorageNode)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<ZeroGStorageNodesView
													selection={zeroGStorageNodesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerZeroGStorageDataBlobs(_context, Content)}
									{@const zeroGStorageDataBlobsResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$dataBlobs({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageDataBlobsResource != null}
									<ResourceBoundary
											resource={zeroGStorageDataBlobsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionZeroGStorageDataBlobs({ id, label, open, active })}
									{@const zeroGStorageDataBlobsResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$dataBlobs({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageDataBlobsResource != null}
									<ResourceBoundary
											resource={zeroGStorageDataBlobsResource}
									>
										{#snippet children(zeroGDataBlob)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<ZeroGDataBlobsView
													selection={zeroGStorageDataBlobsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerZeroGStorageLogEntries(_context, Content)}
									{@const zeroGStorageLogEntriesResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$storageLogEntries({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageLogEntriesResource != null}
									<ResourceBoundary
											resource={zeroGStorageLogEntriesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionZeroGStorageLogEntries({ id, label, open, active })}
									{@const zeroGStorageLogEntriesResource = (networkApplicableSources([
					Source.ZeroGStorageScan_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$storageLogEntries({
						sources: networkApplicableSources([
							Source.ZeroGStorageScan_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if zeroGStorageLogEntriesResource != null}
									<ResourceBoundary
											resource={zeroGStorageLogEntriesResource}
									>
										{#snippet children(zeroGStorageLogEntry)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<ZeroGStorageLogEntriesView
													selection={zeroGStorageLogEntriesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'filecoin-chain-tipsets',
											label: 'Tipsets',
											ownsSection: true,
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

								{#snippet MarkerFilecoinChainObservations(_context, Content)}
									{@const filecoinChainActivityFilecoinChainObservationsResource = (networkApplicableSources([
					Source.Lotus_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.Lotus_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if filecoinChainActivityFilecoinChainObservationsResource != null}
									<ResourceBoundary
											resource={filecoinChainActivityFilecoinChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionFilecoinChainObservations({ id, label, open, active })}
									{@const filecoinChainActivityFilecoinChainObservationsResource = (networkApplicableSources([
					Source.Lotus_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.Lotus_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if filecoinChainActivityFilecoinChainObservationsResource != null}
									<ResourceBoundary
											resource={filecoinChainActivityFilecoinChainObservationsResource}
									>
										{#snippet children(filecoinNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<FilecoinNetwork_TimestampsView
													selection={filecoinChainActivityFilecoinChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerFilecoinChainTipsets(_context, Content)}
									{@const filecoinChainActivityFilecoinChainTipsetsResource = (networkApplicableSources([
					Source.Lotus_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$tipsets({
						sources: networkApplicableSources([
							Source.Lotus_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if filecoinChainActivityFilecoinChainTipsetsResource != null}
									<ResourceBoundary
											resource={filecoinChainActivityFilecoinChainTipsetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionFilecoinChainTipsets({ id, label, open, active })}
									{@const filecoinChainActivityFilecoinChainTipsetsResource = (networkApplicableSources([
					Source.Lotus_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$tipsets({
						sources: networkApplicableSources([
							Source.Lotus_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if filecoinChainActivityFilecoinChainTipsetsResource != null}
									<ResourceBoundary
											resource={filecoinChainActivityFilecoinChainTipsetsResource}
									>
										{#snippet children(filecoinTipset)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<FilecoinTipsetsView
													selection={filecoinChainActivityFilecoinChainTipsetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerFilecoinResourcesEndpoints(_context, Content)}
									{@const filecoinResourcesEndpointsResource = (networkApplicableSources([
					Source.Lotus_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Lotus_JsonRpc,
						], pendingEntity),
					})}
									{#if filecoinResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={filecoinResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionFilecoinResourcesEndpoints({ id, label, open, active })}
									{@const filecoinResourcesEndpointsResource = (networkApplicableSources([
					Source.Lotus_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Lotus_JsonRpc,
						], pendingEntity),
					})}
									{#if filecoinResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={filecoinResourcesEndpointsResource}
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
														{#each rpcEndpointsField.values as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'near-chain-blocks',
											label: 'Blocks',
											ownsSection: true,
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

								{#snippet MarkerNearChainObservations(_context, Content)}
									{@const nearChainActivityNearChainObservationsResource = (networkApplicableSources([
					Source.NearRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.NearRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if nearChainActivityNearChainObservationsResource != null}
									<ResourceBoundary
											resource={nearChainActivityNearChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionNearChainObservations({ id, label, open, active })}
									{@const nearChainActivityNearChainObservationsResource = (networkApplicableSources([
					Source.NearRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.NearRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if nearChainActivityNearChainObservationsResource != null}
									<ResourceBoundary
											resource={nearChainActivityNearChainObservationsResource}
									>
										{#snippet children(nearNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<NearNetwork_TimestampsView
													selection={nearChainActivityNearChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerNearChainBlocks(_context, Content)}
									{@const nearChainActivityNearChainBlocksResource = (networkApplicableSources([
					Source.NearRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.NearRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if nearChainActivityNearChainBlocksResource != null}
									<ResourceBoundary
											resource={nearChainActivityNearChainBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionNearChainBlocks({ id, label, open, active })}
									{@const nearChainActivityNearChainBlocksResource = (networkApplicableSources([
					Source.NearRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.NearRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if nearChainActivityNearChainBlocksResource != null}
									<ResourceBoundary
											resource={nearChainActivityNearChainBlocksResource}
									>
										{#snippet children(nearBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<NearBlocksView
													selection={nearChainActivityNearChainBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerNearConsensusValidators(_context, Content)}
									{@const nearConsensusValidatorsResource = (networkApplicableSources([
					Source.NearRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.NearRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if nearConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={nearConsensusValidatorsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionNearConsensusValidators({ id, label, open, active })}
									{@const nearConsensusValidatorsResource = (networkApplicableSources([
					Source.NearRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.NearRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if nearConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={nearConsensusValidatorsResource}
									>
										{#snippet children(nearValidator)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<NearValidatorsView
													selection={nearConsensusValidatorsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerNearResourcesEndpoints(_context, Content)}
									{@const nearResourcesEndpointsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if nearResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={nearResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionNearResourcesEndpoints({ id, label, open, active })}
									{@const nearResourcesEndpointsResource = (networkApplicableSources([
					Source.Constants_Internal,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Constants_Internal,
						], pendingEntity),
					})}
									{#if nearResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={nearResourcesEndpointsResource}
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
														{#each rpcEndpointsField.values as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'monero-chain-blocks',
											label: 'Blocks',
											ownsSection: true,
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

								{#snippet MarkerMoneroChainObservations(_context, Content)}
									{@const moneroChainActivityMoneroChainObservationsResource = (networkApplicableSources([
					Source.MoneroDaemonRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.MoneroDaemonRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if moneroChainActivityMoneroChainObservationsResource != null}
									<ResourceBoundary
											resource={moneroChainActivityMoneroChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionMoneroChainObservations({ id, label, open, active })}
									{@const moneroChainActivityMoneroChainObservationsResource = (networkApplicableSources([
					Source.MoneroDaemonRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.MoneroDaemonRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if moneroChainActivityMoneroChainObservationsResource != null}
									<ResourceBoundary
											resource={moneroChainActivityMoneroChainObservationsResource}
									>
										{#snippet children(moneroNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<MoneroNetwork_TimestampsView
													selection={moneroChainActivityMoneroChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerMoneroChainBlocks(_context, Content)}
									{@const moneroChainActivityMoneroChainBlocksResource = (networkApplicableSources([
					Source.MoneroDaemonRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.MoneroDaemonRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if moneroChainActivityMoneroChainBlocksResource != null}
									<ResourceBoundary
											resource={moneroChainActivityMoneroChainBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionMoneroChainBlocks({ id, label, open, active })}
									{@const moneroChainActivityMoneroChainBlocksResource = (networkApplicableSources([
					Source.MoneroDaemonRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.MoneroDaemonRpc_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if moneroChainActivityMoneroChainBlocksResource != null}
									<ResourceBoundary
											resource={moneroChainActivityMoneroChainBlocksResource}
									>
										{#snippet children(moneroBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<MoneroBlocksView
													selection={moneroChainActivityMoneroChainBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerMoneroResourcesEndpoints(_context, Content)}
									{@const moneroResourcesEndpointsResource = (networkApplicableSources([
					Source.MoneroDaemonRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.MoneroDaemonRpc_JsonRpc,
						], pendingEntity),
					})}
									{#if moneroResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={moneroResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionMoneroResourcesEndpoints({ id, label, open, active })}
									{@const moneroResourcesEndpointsResource = (networkApplicableSources([
					Source.MoneroDaemonRpc_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.MoneroDaemonRpc_JsonRpc,
						], pendingEntity),
					})}
									{#if moneroResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={moneroResourcesEndpointsResource}
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
														{#each rpcEndpointsField.values as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'lightning-network-nodes',
											label: 'Nodes',
											ownsSection: true,
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

								{#snippet MarkerLightningNetworkObservations(_context, Content)}
									{@const lightningNetworkGraphLightningNetworkObservationsResource = (networkApplicableSources([
					Source.LightningMempoolSpace_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.LightningMempoolSpace_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if lightningNetworkGraphLightningNetworkObservationsResource != null}
									<ResourceBoundary
											resource={lightningNetworkGraphLightningNetworkObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionLightningNetworkObservations({ id, label, open, active })}
									{@const lightningNetworkGraphLightningNetworkObservationsResource = (networkApplicableSources([
					Source.LightningMempoolSpace_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.LightningMempoolSpace_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if lightningNetworkGraphLightningNetworkObservationsResource != null}
									<ResourceBoundary
											resource={lightningNetworkGraphLightningNetworkObservationsResource}
									>
										{#snippet children(lightningNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<LightningNetwork_TimestampsView
													selection={lightningNetworkGraphLightningNetworkObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerLightningNetworkNodes(_context, Content)}
									{@const lightningNetworkGraphLightningNetworkNodesResource = (networkApplicableSources([
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$nodes({
						sources: networkApplicableSources([
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if lightningNetworkGraphLightningNetworkNodesResource != null}
									<ResourceBoundary
											resource={lightningNetworkGraphLightningNetworkNodesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionLightningNetworkNodes({ id, label, open, active })}
									{@const lightningNetworkGraphLightningNetworkNodesResource = (networkApplicableSources([
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$nodes({
						sources: networkApplicableSources([
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if lightningNetworkGraphLightningNetworkNodesResource != null}
									<ResourceBoundary
											resource={lightningNetworkGraphLightningNetworkNodesResource}
									>
										{#snippet children(lightningNode)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<LightningNodesView
													selection={lightningNetworkGraphLightningNetworkNodesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'cardano-chain-blocks',
											label: 'Blocks',
											ownsSection: true,
										},
										{
											id: 'cardano-chain-transactions',
											label: 'Transactions',
											ownsSection: true,
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

								{#snippet MarkerCardanoChainObservations(_context, Content)}
									{@const cardanoChainActivityCardanoChainObservationsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoChainActivityCardanoChainObservationsResource != null}
									<ResourceBoundary
											resource={cardanoChainActivityCardanoChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoChainObservations({ id, label, open, active })}
									{@const cardanoChainActivityCardanoChainObservationsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoChainActivityCardanoChainObservationsResource != null}
									<ResourceBoundary
											resource={cardanoChainActivityCardanoChainObservationsResource}
									>
										{#snippet children(cardanoNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoNetwork_TimestampsView
													selection={cardanoChainActivityCardanoChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerCardanoChainBlocks(_context, Content)}
									{@const cardanoChainActivityCardanoChainBlocksResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoChainActivityCardanoChainBlocksResource != null}
									<ResourceBoundary
											resource={cardanoChainActivityCardanoChainBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoChainBlocks({ id, label, open, active })}
									{@const cardanoChainActivityCardanoChainBlocksResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoChainActivityCardanoChainBlocksResource != null}
									<ResourceBoundary
											resource={cardanoChainActivityCardanoChainBlocksResource}
									>
										{#snippet children(cardanoBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoBlocksView
													selection={cardanoChainActivityCardanoChainBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerCardanoChainTransactions(_context, Content)}
									{@const cardanoChainActivityCardanoChainTransactionsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoChainActivityCardanoChainTransactionsResource != null}
									<ResourceBoundary
											resource={cardanoChainActivityCardanoChainTransactionsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoChainTransactions({ id, label, open, active })}
									{@const cardanoChainActivityCardanoChainTransactionsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoChainActivityCardanoChainTransactionsResource != null}
									<ResourceBoundary
											resource={cardanoChainActivityCardanoChainTransactionsResource}
									>
										{#snippet children(cardanoTransaction)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoTransactionsView
													selection={cardanoChainActivityCardanoChainTransactionsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											id: 'cardano-stake-pools',
											label: 'Stake pools',
											ownsSection: true,
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

								{#snippet MarkerCardanoStakePools(_context, Content)}
									{@const cardanoStakeDelegationCardanoStakePoolsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$stakePools({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoStakeDelegationCardanoStakePoolsResource != null}
									<ResourceBoundary
											resource={cardanoStakeDelegationCardanoStakePoolsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoStakePools({ id, label, open, active })}
									{@const cardanoStakeDelegationCardanoStakePoolsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$stakePools({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoStakeDelegationCardanoStakePoolsResource != null}
									<ResourceBoundary
											resource={cardanoStakeDelegationCardanoStakePoolsResource}
									>
										{#snippet children(cardanoStakePool)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoStakePoolsView
													selection={cardanoStakeDelegationCardanoStakePoolsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'cardano-governance-proposals',
											label: 'Proposals',
											ownsSection: true,
										},
										{
											id: 'cardano-governance-committee',
											label: 'Committee epochs',
											ownsSection: true,
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

								{#snippet MarkerCardanoGovernanceDreps(_context, Content)}
									{@const cardanoGovernanceDrepsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$dReps({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoGovernanceDrepsResource != null}
									<ResourceBoundary
											resource={cardanoGovernanceDrepsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoGovernanceDreps({ id, label, open, active })}
									{@const cardanoGovernanceDrepsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$dReps({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoGovernanceDrepsResource != null}
									<ResourceBoundary
											resource={cardanoGovernanceDrepsResource}
									>
										{#snippet children(cardanoDRep)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoDRepsView
													selection={cardanoGovernanceDrepsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerCardanoGovernanceProposals(_context, Content)}
									{@const cardanoGovernanceProposalsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$governanceProposals({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoGovernanceProposalsResource != null}
									<ResourceBoundary
											resource={cardanoGovernanceProposalsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoGovernanceProposals({ id, label, open, active })}
									{@const cardanoGovernanceProposalsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$governanceProposals({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoGovernanceProposalsResource != null}
									<ResourceBoundary
											resource={cardanoGovernanceProposalsResource}
									>
										{#snippet children(cardanoGovernanceProposal)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoGovernanceProposalsView
													selection={cardanoGovernanceProposalsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerCardanoGovernanceCommittee(_context, Content)}
									{@const cardanoGovernanceCommitteeResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$committeeEpochs({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoGovernanceCommitteeResource != null}
									<ResourceBoundary
											resource={cardanoGovernanceCommitteeResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoGovernanceCommittee({ id, label, open, active })}
									{@const cardanoGovernanceCommitteeResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$committeeEpochs({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoGovernanceCommitteeResource != null}
									<ResourceBoundary
											resource={cardanoGovernanceCommitteeResource}
									>
										{#snippet children(cardanoCommitteeEpoch)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoCommittee_EpochsView
													selection={cardanoGovernanceCommitteeResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'cardano-protocol-parameters',
											label: 'Protocol parameters',
											ownsSection: true,
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

								{#snippet MarkerCardanoAssetsNative(_context, Content)}
									{@const cardanoAssetsProtocolCardanoAssetsNativeResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$assets({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoAssetsProtocolCardanoAssetsNativeResource != null}
									<ResourceBoundary
											resource={cardanoAssetsProtocolCardanoAssetsNativeResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoAssetsNative({ id, label, open, active })}
									{@const cardanoAssetsProtocolCardanoAssetsNativeResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$assets({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoAssetsProtocolCardanoAssetsNativeResource != null}
									<ResourceBoundary
											resource={cardanoAssetsProtocolCardanoAssetsNativeResource}
									>
										{#snippet children(cardanoNativeAsset)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoNativeAssetsView
													selection={cardanoAssetsProtocolCardanoAssetsNativeResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerCardanoProtocolParameters(_context, Content)}
									{@const cardanoAssetsProtocolCardanoProtocolParametersResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$protocolParameterEpochs({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoAssetsProtocolCardanoProtocolParametersResource != null}
									<ResourceBoundary
											resource={cardanoAssetsProtocolCardanoProtocolParametersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoProtocolParameters({ id, label, open, active })}
									{@const cardanoAssetsProtocolCardanoProtocolParametersResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$protocolParameterEpochs({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if cardanoAssetsProtocolCardanoProtocolParametersResource != null}
									<ResourceBoundary
											resource={cardanoAssetsProtocolCardanoProtocolParametersResource}
									>
										{#snippet children(cardanoProtocolParametersEpoch)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<CardanoProtocolParameters_EpochsView
													selection={cardanoAssetsProtocolCardanoProtocolParametersResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerCardanoResourcesEndpoints(_context, Content)}
									{@const cardanoResourcesEndpointsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
					})}
									{#if cardanoResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={cardanoResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionCardanoResourcesEndpoints({ id, label, open, active })}
									{@const cardanoResourcesEndpointsResource = (networkApplicableSources([
					Source.CardanoKoios_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.CardanoKoios_Rest,
						], pendingEntity),
					})}
									{#if cardanoResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={cardanoResourcesEndpointsResource}
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
														{#each restEndpointsField.values as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'tron-chain-blocks',
											label: 'Blocks',
											ownsSection: true,
										},
										{
											id: 'tron-chain-witnesses',
											label: 'Witnesses',
											ownsSection: true,
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

								{#snippet MarkerTronChainObservations(_context, Content)}
									{@const tronChainActivityTronChainObservationsResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tronChainActivityTronChainObservationsResource != null}
									<ResourceBoundary
											resource={tronChainActivityTronChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionTronChainObservations({ id, label, open, active })}
									{@const tronChainActivityTronChainObservationsResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tronChainActivityTronChainObservationsResource != null}
									<ResourceBoundary
											resource={tronChainActivityTronChainObservationsResource}
									>
										{#snippet children(tronNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<TronNetwork_TimestampsView
													selection={tronChainActivityTronChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerTronChainBlocks(_context, Content)}
									{@const tronChainActivityTronChainBlocksResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tronChainActivityTronChainBlocksResource != null}
									<ResourceBoundary
											resource={tronChainActivityTronChainBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionTronChainBlocks({ id, label, open, active })}
									{@const tronChainActivityTronChainBlocksResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tronChainActivityTronChainBlocksResource != null}
									<ResourceBoundary
											resource={tronChainActivityTronChainBlocksResource}
									>
										{#snippet children(tronBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<TronBlocksView
													selection={tronChainActivityTronChainBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerTronChainWitnesses(_context, Content)}
									{@const tronChainActivityTronChainWitnessesResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$witnesses({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tronChainActivityTronChainWitnessesResource != null}
									<ResourceBoundary
											resource={tronChainActivityTronChainWitnessesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionTronChainWitnesses({ id, label, open, active })}
									{@const tronChainActivityTronChainWitnessesResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$witnesses({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tronChainActivityTronChainWitnessesResource != null}
									<ResourceBoundary
											resource={tronChainActivityTronChainWitnessesResource}
									>
										{#snippet children(tronWitness)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<TronWitnessesView
													selection={tronChainActivityTronChainWitnessesResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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

								{#snippet MarkerTronResourcesEndpoints(_context, Content)}
									{@const tronResourcesEndpointsResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
					})}
									{#if tronResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={tronResourcesEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionTronResourcesEndpoints({ id, label, open, active })}
									{@const tronResourcesEndpointsResource = (networkApplicableSources([
					Source.TronGrid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.TronGrid_Rest,
						], pendingEntity),
					})}
									{#if tronResourcesEndpointsResource != null}
									<ResourceBoundary
											resource={tronResourcesEndpointsResource}
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
														{#each restEndpointsField.values as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerTonChainObservations(_context, Content)}
									{@const tonChainActivityTonChainObservationsResource = (networkApplicableSources([
					Source.TonApi_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.TonApi_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tonChainActivityTonChainObservationsResource != null}
									<ResourceBoundary
											resource={tonChainActivityTonChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionTonChainObservations({ id, label, open, active })}
									{@const tonChainActivityTonChainObservationsResource = (networkApplicableSources([
					Source.TonApi_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.TonApi_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if tonChainActivityTonChainObservationsResource != null}
									<ResourceBoundary
											resource={tonChainActivityTonChainObservationsResource}
									>
										{#snippet children(tonNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<TonNetwork_TimestampsView
													selection={tonChainActivityTonChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

							</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Xrpl}
		>
			{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-xrpl-chain-activity'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'xrpl-chain-ledgers',
											label: 'Ledgers',
											ownsSection: true,
										},
										{
											id: 'xrpl-chain-transactions',
											label: 'Transactions',
											ownsSection: true,
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

								{#snippet MarkerXrplChainLedgers(_context, Content)}
									{@const xrplChainActivityXrplChainLedgersResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$ledgers({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplChainActivityXrplChainLedgersResource != null}
									<ResourceBoundary
											resource={xrplChainActivityXrplChainLedgersResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionXrplChainLedgers({ id, label, open, active })}
									{@const xrplChainActivityXrplChainLedgersResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$ledgers({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplChainActivityXrplChainLedgersResource != null}
									<ResourceBoundary
											resource={xrplChainActivityXrplChainLedgersResource}
									>
										{#snippet children(xrplLedger)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<XrplLedgersView
													selection={xrplChainActivityXrplChainLedgersResource}
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
									{/if}
								{/snippet}

								{#snippet MarkerXrplChainTransactions(_context, Content)}
									{@const xrplChainActivityXrplChainTransactionsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplChainActivityXrplChainTransactionsResource != null}
									<ResourceBoundary
											resource={xrplChainActivityXrplChainTransactionsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionXrplChainTransactions({ id, label, open, active })}
									{@const xrplChainActivityXrplChainTransactionsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplChainActivityXrplChainTransactionsResource != null}
									<ResourceBoundary
											resource={xrplChainActivityXrplChainTransactionsResource}
									>
										{#snippet children(xrplTransaction)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<XrplTransactionsView
													selection={xrplChainActivityXrplChainTransactionsResource}
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
									{/if}
								{/snippet}

							</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Xrpl}
		>
			{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-xrpl-ledger-state'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'xrpl-ledger-state-accounts',
											label: 'Accounts',
											ownsSection: true,
										},
										{
											id: 'xrpl-ledger-state-entries',
											label: 'Ledger entries',
											ownsSection: true,
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

								{#snippet MarkerXrplLedgerStateAccounts(_context, Content)}
									{@const xrplLedgerStateAccountsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplLedgerStateAccountsResource != null}
									<ResourceBoundary
											resource={xrplLedgerStateAccountsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionXrplLedgerStateAccounts({ id, label, open, active })}
									{@const xrplLedgerStateAccountsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplLedgerStateAccountsResource != null}
									<ResourceBoundary
											resource={xrplLedgerStateAccountsResource}
									>
										{#snippet children(xrplAccount)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<XrplAccountsView
													selection={xrplLedgerStateAccountsResource}
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
									{/if}
								{/snippet}

								{#snippet MarkerXrplLedgerStateEntries(_context, Content)}
									{@const xrplLedgerStateEntriesResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$ledgerEntries({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplLedgerStateEntriesResource != null}
									<ResourceBoundary
											resource={xrplLedgerStateEntriesResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionXrplLedgerStateEntries({ id, label, open, active })}
									{@const xrplLedgerStateEntriesResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$ledgerEntries({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplLedgerStateEntriesResource != null}
									<ResourceBoundary
											resource={xrplLedgerStateEntriesResource}
									>
										{#snippet children(xrplLedgerEntry)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<XrplLedgerEntriesView
													selection={xrplLedgerStateEntriesResource}
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
									{/if}
								{/snippet}

							</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Xrpl}
		>
			{#snippet Applicable(projection)}
							<CollapsibleTabs
								id={viewDomId + '-carousel-xrpl-protocol-liquidity'}
								sectionIdPrefix={viewDomId}
								sections={
									[
										{
											id: 'xrpl-protocol-amendments',
											label: 'Amendments',
											ownsSection: true,
										},
										{
											id: 'xrpl-liquidity-amms',
											label: 'AMMs',
											ownsSection: true,
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

								{#snippet MarkerXrplProtocolAmendments(_context, Content)}
									{@const xrplProtocolLiquidityXrplProtocolAmendmentsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$amendments({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplProtocolLiquidityXrplProtocolAmendmentsResource != null}
									<ResourceBoundary
											resource={xrplProtocolLiquidityXrplProtocolAmendmentsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionXrplProtocolAmendments({ id, label, open, active })}
									{@const xrplProtocolLiquidityXrplProtocolAmendmentsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$amendments({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplProtocolLiquidityXrplProtocolAmendmentsResource != null}
									<ResourceBoundary
											resource={xrplProtocolLiquidityXrplProtocolAmendmentsResource}
									>
										{#snippet children(xrplAmendment)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<XrplAmendmentsView
													selection={xrplProtocolLiquidityXrplProtocolAmendmentsResource}
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
									{/if}
								{/snippet}

								{#snippet MarkerXrplLiquidityAmms(_context, Content)}
									{@const xrplProtocolLiquidityXrplLiquidityAmmsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$amms({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplProtocolLiquidityXrplLiquidityAmmsResource != null}
									<ResourceBoundary
											resource={xrplProtocolLiquidityXrplLiquidityAmmsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionXrplLiquidityAmms({ id, label, open, active })}
									{@const xrplProtocolLiquidityXrplLiquidityAmmsResource = (networkApplicableSources([
					Source.Xrpl_Rippled,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$amms({
						sources: networkApplicableSources([
							Source.Xrpl_Rippled,
						], pendingEntity),
						limit: 16,
					})}
									{#if xrplProtocolLiquidityXrplLiquidityAmmsResource != null}
									<ResourceBoundary
											resource={xrplProtocolLiquidityXrplLiquidityAmmsResource}
									>
										{#snippet children(xrplAmm)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<XrplAmmsView
													selection={xrplProtocolLiquidityXrplLiquidityAmmsResource}
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
									{/if}
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
											id: 'hedera-chain-blocks',
											label: 'Blocks',
											ownsSection: true,
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

								{#snippet MarkerHederaChainBlocks(_context, Content)}
									{@const hederaChainActivityHederaChainBlocksResource = (networkApplicableSources([
					Source.HederaMirrorNode_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.HederaMirrorNode_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hederaChainActivityHederaChainBlocksResource != null}
									<ResourceBoundary
											resource={hederaChainActivityHederaChainBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHederaChainBlocks({ id, label, open, active })}
									{@const hederaChainActivityHederaChainBlocksResource = (networkApplicableSources([
					Source.HederaMirrorNode_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.HederaMirrorNode_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hederaChainActivityHederaChainBlocksResource != null}
									<ResourceBoundary
											resource={hederaChainActivityHederaChainBlocksResource}
									>
										{#snippet children(hederaBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HederaBlocksView
													selection={hederaChainActivityHederaChainBlocksResource}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerHederaAccounts(_context, Content)}
									{@const hederaAccountsTokensHederaAccountsResource = (networkApplicableSources([
					Source.HederaMirrorNode_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.HederaMirrorNode_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hederaAccountsTokensHederaAccountsResource != null}
									<ResourceBoundary
											resource={hederaAccountsTokensHederaAccountsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHederaAccounts({ id, label, open, active })}
									{@const hederaAccountsTokensHederaAccountsResource = (networkApplicableSources([
					Source.HederaMirrorNode_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$accounts({
						sources: networkApplicableSources([
							Source.HederaMirrorNode_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hederaAccountsTokensHederaAccountsResource != null}
									<ResourceBoundary
											resource={hederaAccountsTokensHederaAccountsResource}
									>
										{#snippet children(hederaAccount)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HederaAccountsView
													selection={hederaAccountsTokensHederaAccountsResource}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'hyperliquid-chain-blocks',
											label: 'Blocks',
											ownsSection: true,
										},
										{
											id: 'hyperliquid-chain-transactions',
											label: 'Transactions',
											ownsSection: true,
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

								{#snippet MarkerHyperliquidChainObservations(_context, Content)}
									{@const hyperliquidChainActivityHyperliquidChainObservationsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidChainActivityHyperliquidChainObservationsResource != null}
									<ResourceBoundary
											resource={hyperliquidChainActivityHyperliquidChainObservationsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidChainObservations({ id, label, open, active })}
									{@const hyperliquidChainActivityHyperliquidChainObservationsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$timestamps({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidChainActivityHyperliquidChainObservationsResource != null}
									<ResourceBoundary
											resource={hyperliquidChainActivityHyperliquidChainObservationsResource}
									>
										{#snippet children(hyperliquidNetworkTimestamp)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HyperliquidNetwork_TimestampsView
													selection={hyperliquidChainActivityHyperliquidChainObservationsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerHyperliquidChainBlocks(_context, Content)}
									{@const hyperliquidChainActivityHyperliquidChainBlocksResource = (networkApplicableSources([
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidChainActivityHyperliquidChainBlocksResource != null}
									<ResourceBoundary
											resource={hyperliquidChainActivityHyperliquidChainBlocksResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidChainBlocks({ id, label, open, active })}
									{@const hyperliquidChainActivityHyperliquidChainBlocksResource = (networkApplicableSources([
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$blocks({
						sources: networkApplicableSources([
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidChainActivityHyperliquidChainBlocksResource != null}
									<ResourceBoundary
											resource={hyperliquidChainActivityHyperliquidChainBlocksResource}
									>
										{#snippet children(hyperliquidBlock)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HyperliquidBlocksView
													selection={hyperliquidChainActivityHyperliquidChainBlocksResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerHyperliquidChainTransactions(_context, Content)}
									{@const hyperliquidChainActivityHyperliquidChainTransactionsResource = (networkApplicableSources([
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidChainActivityHyperliquidChainTransactionsResource != null}
									<ResourceBoundary
											resource={hyperliquidChainActivityHyperliquidChainTransactionsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidChainTransactions({ id, label, open, active })}
									{@const hyperliquidChainActivityHyperliquidChainTransactionsResource = (networkApplicableSources([
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$transactions({
						sources: networkApplicableSources([
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidChainActivityHyperliquidChainTransactionsResource != null}
									<ResourceBoundary
											resource={hyperliquidChainActivityHyperliquidChainTransactionsResource}
									>
										{#snippet children(hyperliquidTransaction)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HyperliquidTransactionsView
													selection={hyperliquidChainActivityHyperliquidChainTransactionsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
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

								{#snippet MarkerHyperliquidConsensusValidators(_context, Content)}
									{@const hyperliquidConsensusValidatorsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={hyperliquidConsensusValidatorsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidConsensusValidators({ id, label, open, active })}
									{@const hyperliquidConsensusValidatorsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$validators({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidConsensusValidatorsResource != null}
									<ResourceBoundary
											resource={hyperliquidConsensusValidatorsResource}
									>
										{#snippet children(hyperliquidValidator)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HyperliquidValidatorsView
													selection={hyperliquidConsensusValidatorsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'hyperliquid-markets-spot-assets',
											label: 'Spot assets',
											ownsSection: true,
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

								{#snippet MarkerHyperliquidMarketsPerps(_context, Content)}
									{@const hyperliquidMarketsPerpsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$perpMarkets({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidMarketsPerpsResource != null}
									<ResourceBoundary
											resource={hyperliquidMarketsPerpsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidMarketsPerps({ id, label, open, active })}
									{@const hyperliquidMarketsPerpsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$perpMarkets({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidMarketsPerpsResource != null}
									<ResourceBoundary
											resource={hyperliquidMarketsPerpsResource}
									>
										{#snippet children(hyperliquidPerpMarket)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HyperliquidPerpMarketsView
													selection={hyperliquidMarketsPerpsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
								{/snippet}

								{#snippet MarkerHyperliquidMarketsSpotAssets(_context, Content)}
									{@const hyperliquidMarketsSpotAssetsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$spotAssets({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidMarketsSpotAssetsResource != null}
									<ResourceBoundary
											resource={hyperliquidMarketsSpotAssetsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidMarketsSpotAssets({ id, label, open, active })}
									{@const hyperliquidMarketsSpotAssetsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.$$spotAssets({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
						limit: 16,
					})}
									{#if hyperliquidMarketsSpotAssetsResource != null}
									<ResourceBoundary
											resource={hyperliquidMarketsSpotAssetsResource}
									>
										{#snippet children(hyperliquidSpotAsset)}
											<section
												id={id}
												aria-labelledby={`${id}:marker`}
												data-scroll-marker-label={label}
												data-column-item="flexible"
												data-column
												data-active={active}
											>
												<HyperliquidSpotAssetsView
													selection={hyperliquidMarketsSpotAssetsResource}
													CollapsibleProps={{ canToggle: false }}
													collapsible={false}
													data-column-item="flexible"
													data-card
													data-scroll-container
													open={open}
													title={label}
													id={`${id}-list`}
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
									{/if}
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
											ownsSection: true,
										},
										{
											id: 'hyperliquid-resources-rest-endpoints',
											label: 'REST endpoints',
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

								{#snippet MarkerHyperliquidResourcesRpcEndpoints(_context, Content)}
									{@const hyperliquidResourcesRpcEndpointsResource = (networkApplicableSources([
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
					})}
									{#if hyperliquidResourcesRpcEndpointsResource != null}
									<ResourceBoundary
											resource={hyperliquidResourcesRpcEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidResourcesRpcEndpoints({ id, label, open, active })}
									{@const hyperliquidResourcesRpcEndpointsResource = (networkApplicableSources([
					Source.Hyperliquid_JsonRpc,
				], pendingEntity)).length === 0 ? undefined : projection
					.rpcEndpoints({
						sources: networkApplicableSources([
							Source.Hyperliquid_JsonRpc,
						], pendingEntity),
					})}
									{#if hyperliquidResourcesRpcEndpointsResource != null}
									<ResourceBoundary
											resource={hyperliquidResourcesRpcEndpointsResource}
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
														{#each rpcEndpointsField.values as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
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
									{/if}
								{/snippet}

								{#snippet MarkerHyperliquidResourcesRestEndpoints(_context, Content)}
									{@const hyperliquidResourcesRestEndpointsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
					})}
									{#if hyperliquidResourcesRestEndpointsResource != null}
									<ResourceBoundary
											resource={hyperliquidResourcesRestEndpointsResource}
									>
										{#snippet children(_resolved)}
											{@render Content()}
										{/snippet}

										{#snippet PendingContent()}
											{@render Content()}
										{/snippet}

										{#snippet FailedContent(_error, _retry)}
											{@render Content()}
										{/snippet}
									</ResourceBoundary>
									{/if}
								{/snippet}

								{#snippet SectionHyperliquidResourcesRestEndpoints({ id, label, open, active })}
									{@const hyperliquidResourcesRestEndpointsResource = (networkApplicableSources([
					Source.Hyperliquid_Rest,
				], pendingEntity)).length === 0 ? undefined : projection
					.restEndpoints({
						sources: networkApplicableSources([
							Source.Hyperliquid_Rest,
						], pendingEntity),
					})}
									{#if hyperliquidResourcesRestEndpointsResource != null}
									<ResourceBoundary
											resource={hyperliquidResourcesRestEndpointsResource}
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
														{#each restEndpointsField.values as rESTEndpoint, rESTEndpointIndex (rESTEndpointIndex)}
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
									{/if}
								{/snippet}

							</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
