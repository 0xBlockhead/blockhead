<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { Caip2Namespace, Caip2Reference, networkByCaip2, NetworkExecutionModel, NetworkLedgerModel, NetworkNamespace } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.Network>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Network>>
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
	const network = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			namespace: true,
			ledgerModels: true,
			executionModels: true,
			$networkStack: true,
			environment: true,
			$icon: true,
			$$nativeAssets: true,
			$$blockExplorerUrls: true,
			$$faucetUrls: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? '')].filter(Boolean).join(' ') || [prefetched.caip2 == null ? '' : String((`${(prefetched.caip2).namespace}:${(prefetched.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network')
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
	import TronNetwork_TimestampsView from '$/views/TronNetwork_TimestampsView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import TronWitnessesView from '$/views/TronWitnessesView.svelte'
	import TronTokensView from '$/views/TronTokensView.svelte'
	import TronTokenTransfersView from '$/views/TronTokenTransfersView.svelte'
	import HyperliquidNetwork_TimestampsView from '$/views/HyperliquidNetwork_TimestampsView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
	import HyperliquidValidatorsView from '$/views/HyperliquidValidatorsView.svelte'
	import HyperliquidPerpMarketsView from '$/views/HyperliquidPerpMarketsView.svelte'
	import HyperliquidSpotAssetsView from '$/views/HyperliquidSpotAssetsView.svelte'
	import HyperliquidSpotPairsView from '$/views/HyperliquidSpotPairsView.svelte'
	import HyperliquidVaultsView from '$/views/HyperliquidVaultsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm') && pendingEntity.caip2 !== undefined && pendingEntity.caip2.namespace !== undefined && pendingEntity.caip2 !== undefined && pendingEntity.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
			caip2: `${String(pendingEntity.caip2.namespace ?? '')}:${String(pendingEntity.caip2.reference ?? '')}`,
		}) : pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('CosmosSdk') && pendingEntity.caip2 !== undefined && pendingEntity.caip2.namespace !== undefined && pendingEntity.caip2 !== undefined && pendingEntity.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
			caip2: `${String(pendingEntity.caip2.namespace ?? '')}:${String(pendingEntity.caip2.reference ?? '')}`,
		}) : pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('Evm') && pendingEntity.caip2 !== undefined && pendingEntity.caip2.namespace !== undefined && pendingEntity.caip2 !== undefined && pendingEntity.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.caip2.namespace) + ':' + String(pendingEntity.caip2.reference))].slug ?? ''),
		}) : pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('SolanaRuntime') && pendingEntity.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
			networkSlug: String(pendingEntity.slug ?? ''),
		}) : pendingEntity.executionModels !== undefined && pendingEntity.executionModels.values.includes('PolkadotRuntime') && pendingEntity.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
			networkSlug: String(pendingEntity.slug ?? ''),
		}) : pendingEntity.ledgerModels !== undefined && pendingEntity.ledgerModels.values.includes('Utxo') && pendingEntity.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
			networkSlug: String(pendingEntity.slug ?? ''),
		}) : pendingEntity.caip2 !== undefined && pendingEntity.caip2.namespace !== undefined && pendingEntity.caip2 !== undefined && pendingEntity.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
			caip2: `${String(pendingEntity.caip2.namespace ?? '')}:${String(pendingEntity.caip2.reference ?? '')}`,
		}) : pendingEntity.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
			networkSlug: String(pendingEntity.slug ?? ''),
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
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || [prefetched.caip2 == null ? '' : String((`${(prefetched.caip2).namespace}:${(prefetched.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'Network'}
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
				{@const caip20 = prefetched.caip2}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
						<div>
							<dt>Upgrade</dt>
							<dd>
								<ResourceBoundary
									resource={
										selection.Evm.$$upgrades({
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
													(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2 !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2.reference !== undefined && ethereumNetworkUpgrade[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
														caip2: `${String(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
														upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
						<div>
							<dt>Block</dt>
							<dd>
								<ResourceBoundary
									resource={
										selection.Evm.$$blocks({
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
													(evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2.reference !== undefined && evmBlock[EntityMetaKey.Selector].blockNumber !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
														caip2: `${String(evmBlock[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(evmBlock[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
														blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
						<div>
							<dt>Epoch</dt>
							<dd>
								<ResourceBoundary
									resource={
										selection.Evm.$$beaconEpochs({
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
													(beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && beaconEpoch[EntityMetaKey.Selector].$network !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference !== undefined && beaconEpoch[EntityMetaKey.Selector].epoch !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
														caip2: `${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(beaconEpoch[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
														epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
						<div>
							<dt>Slot</dt>
							<dd>
								<ResourceBoundary
									resource={
										selection.Evm.$$beaconSlots({
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
													(beaconSlot[EntityMetaKey.Selector].$network !== undefined && beaconSlot[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconSlot[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && beaconSlot[EntityMetaKey.Selector].$network !== undefined && beaconSlot[EntityMetaKey.Selector].$network.caip2 !== undefined && beaconSlot[EntityMetaKey.Selector].$network.caip2.reference !== undefined && beaconSlot[EntityMetaKey.Selector].slot !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]', {
														caip2: `${String(beaconSlot[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(beaconSlot[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
														slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
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
							{@const name = prefetched.name}
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
							{@const namespace = prefetched.namespace}
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
							{@const ledgerModels = prefetched.ledgerModels}
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
							{@const executionModels = prefetched.executionModels}
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
				{#snippet children(networkStack)}
					{#if networkStack != null && networkStack[EntityMetaKey.Selector] != null}
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
						resource={
							selection({
								fields: {
									environment: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const environment = prefetched.environment}
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
					{@const caip2 = prefetched.caip2}
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
			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection.Evm.consensusProtocol({
							sources: [
								Source.Constants_Internal,
							],
							fields: {
								consensusProtocol: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const consensusProtocol = prefetched.consensusProtocol}
						{#if consensusProtocol !== undefined && consensusProtocol !== null}
							<div>
								<dt>Consensus</dt>
								<dd>
									{String((consensusProtocolByProtocol[String(consensusProtocol)]?.label ?? (String((consensusProtocol) ?? ''))) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

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
						selection.Evm.registryStatus({
							fields: {
								registryStatus: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const registryStatus = prefetched.registryStatus}
						{#if registryStatus !== undefined && registryStatus !== null}
							<div>
								<dt>Registry name status</dt>
								<dd>
									{String((registryStatus) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

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
						selection.Evm.shortName({
							fields: {
								shortName: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const shortName = prefetched.shortName}
						{#if shortName !== undefined && shortName !== null}
							<div>
								<dt>Short name</dt>
								<dd>
									{String((shortName) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

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
						selection.Evm.peeringId({
							fields: {
								peeringId: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const peeringId = prefetched.peeringId}
						{#if peeringId !== undefined && peeringId !== null}
							<div>
								<dt>Peering ID</dt>
								<dd>
									<NumberValue value={Number(peeringId)} />
								</dd>
							</div>
						{/if}
					{/snippet}

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
						selection.Evm.slip44({
							fields: {
								slip44: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const slip44 = prefetched.slip44}
						{#if slip44 !== undefined && slip44 !== null}
							<div>
								<dt>SLIP-44</dt>
								<dd>
									<NumberValue value={Number(slip44)} />
								</dd>
							</div>
						{/if}
					{/snippet}

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection.ZeroG.chainId({
						fields: {
							chainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainId = prefetched.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue value={Number(chainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={selection.Lightning.$settlementNetwork}
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
											(network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
												caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
											}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('CosmosSdk') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
												caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
											}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
												networkSlug: String(networkByCaip2[String(String(network[EntityMetaKey.Selector].caip2.namespace) + ':' + String(network[EntityMetaKey.Selector].caip2.reference))].slug ?? ''),
											}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('SolanaRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
												networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
											}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('PolkadotRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
												networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
											}) : network[EntityMetaKey.Selector].ledgerModels !== undefined && network[EntityMetaKey.Selector].ledgerModels.values.includes('Utxo') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
												networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
											}) : network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
												caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
											}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
												networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EthereumExecutionUpgradesView
												selection={
													selection.Evm.$$executionUpgrades({
														sources: [
															Source.Constants_Internal,
														],
														limit: 512,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmExecutionBlocks({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmBlocksView
												selection={
													selection.Evm.$$blocks({
														sources: [
															Source.Voltaire_JsonRpc,
														],
														limit: 16,
														count: true,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmExecutionTransactions({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmTransactionsView
												selection={
													selection.Evm.$$transactions({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmExecutionMempool({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmNetwork_Txpool_TimestampsView
												selection={
													selection.Evm.$$txpoolTimestamps({
														sources: [
															Source.Voltaire_JsonRpc,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mempool', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmExecutionGasBlocks({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmNetwork_GasFee_BlocksView
												selection={
													selection.Evm.$$gasFeeBlocks({
														sources: [
															Source.Voltaire_JsonRpc,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/fee-market', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmExecutionGasEstimates({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmNetwork_GasEstimate_TimestampsView
												selection={
													selection.Evm.$$gasEstimateTimestamps({
														sources: [
															Source.Blockscout_Rest,
															Source.Etherscan_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/gas-estimates', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmExecutionEndpoints({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<UrlsView
												selection={
													selection.Evm.$$rpcUrls({
														sources: [
															Source.Constants_Internal,
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
															Source.Lifi_Rest,
														],
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rpc-urls', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusProtocol: true,
							executionModels: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.consensusProtocol === 'EthereumBeacon' && resolvedEntity.executionModels.values.includes('Evm')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EthereumConsensusUpgradesView
												selection={
													selection.Evm.$$consensusUpgrades({
														sources: [
															Source.Constants_Internal,
														],
														limit: 512,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusFinality({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EthereumBeaconFinality_TimestampsView
												selection={
													selection.Evm.$$beaconFinalityTimestamps({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/finality', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusCommittees({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconCommitteesView
												selection={
													selection.Evm.$$beaconCommittees({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/committees', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusSyncCommittees({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconSyncCommitteesView
												selection={
													selection.Evm.$$beaconSyncCommittees({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/sync-committees', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusAttestations({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconAttestationsView
												selection={
													selection.Evm.$$beaconAttestations({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/attestations', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusWithdrawals({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconWithdrawalsView
												selection={
													selection.Evm.$$beaconWithdrawals({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/withdrawals', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusSlashings({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconSlashingsView
												selection={
													selection.Evm.$$beaconSlashings({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slashings', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusValidators({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconValidatorsView
												selection={
													selection.Evm.$$beaconValidators({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validators', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusEpochs({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconEpochsView
												selection={
													selection.Evm.$$beaconEpochs({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epochs', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusSlots({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<BeaconSlotsView
												selection={
													selection.Evm.$$beaconSlots({
														sources: [
															Source.Beacon_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slots', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusMevRelays({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<MevRelaysView
												selection={
													selection.Evm.$$mevRelays({
														sources: [
															Source.Constants_Internal,
														],
														limit: 64,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relays', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusMevBuilders({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<MevBuildersView
												selection={
													selection.Evm.$$mevBuilders({
														sources: [
															Source.MevRelay_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builders', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusMevBoost({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<MevRelay_ProposerPayloadDeliveredsView
												selection={
													selection.Evm.$$mevProposerPayloadDelivered({
														sources: [
															Source.MevRelay_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/payloads', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmConsensusEndpoints({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<ResourceBoundary
												resource={
													selection({
														sources: [
															Source.Constants_Internal,
														],
														fields: {
															consensusEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const consensusEndpoints = entity.consensusEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmBlobsView
												selection={
													selection.Evm.$$blobs({
														sources: [
															Source.Voltaire_JsonRpc,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blobs', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmContractsView
												selection={
													selection.Evm.$$precompiles({
														sources: [
															Source.Constants_Internal,
														],
														fields: {
															precompileName: true,
														},
														limit: 64,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/precompiles', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmContractsVerified({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmContractsView
												selection={
													selection.Evm.$$contracts({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmContractsSmartAccounts({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<Erc4337SmartAccountsView
												selection={
													selection.Evm.$$erc4337SmartAccounts({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/smart-accounts', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmContractsBundlers({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<Erc4337BundlersView
												selection={
													selection.Evm.$$erc4337Bundlers({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundlers', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmContractsPaymasters({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<Erc4337PaymastersView
												selection={
													selection.Evm.$$erc4337Paymasters({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/paymasters', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmContractsUserOperations({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmUserOperationsView
												selection={
													selection.Evm.$$userOperations({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/user-operations', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmContractsFactories({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<Erc4337AccountFactoriesView
												selection={
													selection.Evm.$$erc4337AccountFactories({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factories', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
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
										selection({
											fields: {
												executionModels: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<ResourceBoundary
												resource={
													selection.Evm.$nativeCoin({
														sources: [
															Source.Constants_Internal,
														],
														fields: {
															name: true,
															symbol: true,
														},
													})
												}
											>
												{#snippet children(coin)}
													{#if coin != null && coin[EntityMetaKey.Selector] != null}
														<CoinView
															selection={select(EntityType.Coin, coin[EntityMetaKey.Selector], { sources: selection.sources })}
															prefetched={coin}
															href={
																(coin[EntityMetaKey.Selector].coinId !== undefined ? resolve('/(assets)/coin/[coinId]', {
																	coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
																}) : undefined)
															}
															layout={EntityLayout.Summary}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmAssetsNativeInstance({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<ResourceBoundary
												resource={
													selection.Evm.$nativeCoinInstance({
														sources: [
															Source.Constants_Internal,
														],
														fields: {
															symbol: true,
															name: true,
															$network: true,
														},
													})
												}
											>
												{#snippet children(evmCoinInstance)}
													{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
														<EvmCoinInstanceView
															selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector], { sources: selection.sources })}
															prefetched={evmCoinInstance}
															href={
																(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
																	chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
																	coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
																}) : undefined)
															}
															layout={EntityLayout.Summary}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmAssetsNativeAssets({ id, label, open })}
								<AssetInstancesView
									selection={selection.$$nativeAssets}
									href={
										(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/native-assets', {
											caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
										}) : undefined)
									}
									CollapsibleProps={{ canToggle: false }}
									open={open}
									title={label}
									id={`${id}-list`}
								/>
							{/snippet}

							{#snippet SectionEvmAssetsBridges({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmNetworkBridgesView
												selection={
													selection.Evm.$$bridges({
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
															Source.Lifi_Rest,
														],
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/bridges', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmAssetsErc20Transfers({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmTokenTransfersView
												selection={
													selection.Evm.$$erc20TokenTransfers({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-20-transfers', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmAssetsNftTransfers({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmTokenTransfersView
												selection={
													selection.Evm.$$nftTokenTransfers({
														sources: [
															Source.Blockscout_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/nft-transfers', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('Evm')}
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
							class='network-view-collapsible-network-topology'
							scrollContainerProps={{
								'data-row': 'start align-start',
							}}
						>
							{#snippet Summary({})}
								<header data-row-item="flexible" data-row="wrap gap-4">
									<HeadingComponent>Network topology</HeadingComponent>
								</header>
							{/snippet}

							{#snippet SectionEvmNetworkTopologyUpgrades({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EthereumNetworkUpgradesView
												selection={
													selection.Evm.$$upgrades({
														sources: [
															Source.Constants_Internal,
														],
														limit: 512,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/upgrades', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmNetworkTopologyParentLayer({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<ResourceBoundary
												resource={
													selection.Evm.$parent({
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
															Source.L2Beat_Rest,
														],
													})
												}
											>
												{#snippet children(network)}
													{#if network == null || network[EntityMetaKey.Selector] == null}
														<p data-text="muted">Parent network is not listed for this network.</p>
													{:else}
														<NetworkView
															selection={select(EntityType.Network, network[EntityMetaKey.Selector], { sources: selection.sources })}
															prefetched={network}
															href={
																(network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
																	caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('CosmosSdk') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
																	caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
																	networkSlug: String(networkByCaip2[String(String(network[EntityMetaKey.Selector].caip2.namespace) + ':' + String(network[EntityMetaKey.Selector].caip2.reference))].slug ?? ''),
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('SolanaRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('PolkadotRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : network[EntityMetaKey.Selector].ledgerModels !== undefined && network[EntityMetaKey.Selector].ledgerModels.values.includes('Utxo') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
																	caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
																}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : undefined)
															}
															layout={EntityLayout.Summary}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmNetworkTopologyRollup({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<ResourceBoundary
												resource={
													selection.Evm.$rollup({
														sources: [
															Source.L2Beat_Rest,
														],
													})
												}
											>
												{#snippet children(evmRollup)}
													{#if evmRollup == null || evmRollup[EntityMetaKey.Selector] == null}
														<p data-text="muted">Rollup is not listed for this network.</p>
													{:else}
														<EvmRollupView
															selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector], { sources: selection.sources })}
															prefetched={evmRollup}
															href={
																(evmRollup[EntityMetaKey.Selector].$network !== undefined && evmRollup[EntityMetaKey.Selector].$network.caip2 !== undefined && evmRollup[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && evmRollup[EntityMetaKey.Selector].$network !== undefined && evmRollup[EntityMetaKey.Selector].$network.caip2 !== undefined && evmRollup[EntityMetaKey.Selector].$network.caip2.reference !== undefined && evmRollup[EntityMetaKey.Selector].projectId !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
																	caip2: `${String(evmRollup[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(evmRollup[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
																	projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
																}) : undefined)
															}
															layout={EntityLayout.Summary}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmNetworkTopologySiblingShards({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<NetworksView
												selection={
													selection.Evm.$$siblingShardNetworks({
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
														],
														limit: 16,
													})
												}
												href={resolve('/(explore)/networks')}
												CollapsibleProps={{ canToggle: false }}
												emptyText='No sibling shard networks listed for this network yet.'
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmNetworkTopologyTestnets({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<NetworksView
												selection={
													selection.Evm.$$testnets({
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
														],
														limit: 16,
													})
												}
												href={resolve('/(explore)/networks')}
												CollapsibleProps={{ canToggle: false }}
												emptyText='No testnets listed for this network yet.'
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmNetworkTopologyMainnet({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<ResourceBoundary
												resource={
													selection.Evm.$mainnet({
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
														],
													})
												}
											>
												{#snippet children(network)}
													{#if network == null || network[EntityMetaKey.Selector] == null}
														<p data-text="muted">Mainnet is not listed for this network.</p>
													{:else}
														<NetworkView
															selection={select(EntityType.Network, network[EntityMetaKey.Selector], { sources: selection.sources })}
															prefetched={network}
															href={
																(network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
																	caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('CosmosSdk') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
																	caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
																	networkSlug: String(networkByCaip2[String(String(network[EntityMetaKey.Selector].caip2.namespace) + ':' + String(network[EntityMetaKey.Selector].caip2.reference))].slug ?? ''),
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('SolanaRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('PolkadotRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : network[EntityMetaKey.Selector].ledgerModels !== undefined && network[EntityMetaKey.Selector].ledgerModels.values.includes('Utxo') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
																	caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
																}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
																	networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
																}) : undefined)
															}
															layout={EntityLayout.Summary}
															open={false}
														/>
													{/if}
												{/snippet}
											</ResourceBoundary>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmNetworkTopologyChildLayers({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<NetworksView
												selection={
													selection.Evm.$$childLayers({
														sources: [
															Source.Chainlist_Rest,
															Source.EthereumLists_Rest,
															Source.L2Beat_Rest,
														],
														limit: 16,
													})
												}
												href={resolve('/(explore)/networks')}
												CollapsibleProps={{ canToggle: false }}
												emptyText='No child layer networks listed for this network yet.'
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionEvmNetworkTopologySettledRollups({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('Evm') && resolvedEntity.executionModels.values.includes('Evm')}
											<EvmRollupsView
												selection={
													selection.Evm.$$settledRollups({
														sources: [
															Source.L2Beat_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												emptyText='No settled rollups listed for this network yet.'
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('CosmosSdk')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('CosmosSdk') && resolvedEntity.executionModels.values.includes('CosmosSdk')}
											<CosmosBlocksView
												selection={
													selection.Cosmos.$$blocks({
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionCosmosConsensusValidators({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('CosmosSdk') && resolvedEntity.executionModels.values.includes('CosmosSdk')}
											<CosmosValidatorsView
												selection={
													selection.Cosmos.$$validators({
														sources: [
															Source.CosmosSdk_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validators', {
														caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('CosmosSdk')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('CosmosSdk') && resolvedEntity.executionModels.values.includes('CosmosSdk')}
											<CosmosAccountsView
												selection={
													selection.Cosmos.$$accounts({
														sources: [
															Source.CosmosSdk_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('CosmosSdk')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('CosmosSdk') && resolvedEntity.executionModels.values.includes('CosmosSdk')}
											<CosmosGovernanceProposalsView
												selection={
													selection.Cosmos.$$governanceProposals({
														sources: [
															Source.CosmosSdk_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/governance', {
														networkSlug: selection.entitySelector.slug,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('CosmosSdk')}
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
									resource={
										selection({
											fields: {
												executionModels: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('CosmosSdk') && resolvedEntity.executionModels.values.includes('CosmosSdk')}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															restEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const restEndpoints = entity.restEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime') && resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
											<PolkadotBlocksView
												selection={
													selection.Polkadot.$$blocks({
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionPolkadotConsensusValidators({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime') && resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
											<PolkadotValidatorsView
												selection={
													selection.Polkadot.$$validators({
														sources: [
															Source.Polkadot_JsonRpc,
															Source.SubstrateSidecar_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
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
										})
									}
									href={
										(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/native-assets', {
											caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
										}) : undefined)
									}
									CollapsibleProps={{ canToggle: false }}
									open={open}
									title={label}
									id={`${id}-list`}
								/>
							{/snippet}

							{#snippet SectionPolkadotAssetsRegistered({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime') && resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
											<PolkadotAssetsView
												selection={
													selection.Polkadot.$$assets({
														sources: [
															Source.Polkadot_JsonRpc,
															Source.SubstrateSidecar_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionPolkadotAssetsBalances({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime') && resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
											<PolkadotAssetBalance_TimestampsView
												selection={
													selection.Polkadot.$$assetBalanceTimestamps({
														sources: [
															Source.Polkadot_JsonRpc,
															Source.SubstrateSidecar_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime') && resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
											<PolkadotReferendumsView
												selection={
													selection.Polkadot.$$referendums({
														sources: [
															Source.Polkadot_JsonRpc,
															Source.SubstrateSidecar_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
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
									resource={
										selection({
											fields: {
												executionModels: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('PolkadotRuntime') && resolvedEntity.executionModels.values.includes('PolkadotRuntime')}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															rpcEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const rpcEndpoints = entity.rpcEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('SolanaRuntime')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<SolanaBlocksView
												selection={
													selection.Solana.$$blocks({
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionSolanaExecutionTransactions({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<SolanaTransactionsView
												selection={
													selection.Solana.$$transactions({
														sources: [
															Source.Solana_JsonRpc,
															Source.Helius_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('SolanaRuntime')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<SolanaValidatorsView
												selection={
													selection.Solana.$$validators({
														sources: [
															Source.Solana_JsonRpc,
															Source.Helius_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('SolanaRuntime')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<SolanaAccountsView
												selection={
													selection.Solana.$$accounts({
														sources: [
															Source.Solana_JsonRpc,
															Source.Helius_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionSolanaContractsAccountsPrograms({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<SolanaProgramsView
												selection={
													selection.Solana.$$programs({
														sources: [
															Source.Solana_JsonRpc,
															Source.Helius_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/programs', {
														networkSlug: selection.entitySelector.slug,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('SolanaRuntime')}
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
										})
									}
									href={
										(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/native-assets', {
											caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
										}) : undefined)
									}
									CollapsibleProps={{ canToggle: false }}
									open={open}
									title={label}
									id={`${id}-list`}
								/>
							{/snippet}

							{#snippet SectionSolanaAssetsTokenAccounts({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<SolanaTokenAccountsView
												selection={
													selection.Solana.$$tokenAccounts({
														sources: [
															Source.Solana_JsonRpc,
															Source.Helius_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-accounts', {
														networkSlug: selection.entitySelector.slug,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionSolanaAssetsTokenMints({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<SolanaTokenMintsView
												selection={
													selection.Solana.$$tokenMints({
														sources: [
															Source.Solana_JsonRpc,
															Source.Helius_Rest,
														],
														limit: 16,
													})
												}
												href={
													(selection.entitySelector.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-mints', {
														networkSlug: selection.entitySelector.slug,
													}) : undefined)
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('SolanaRuntime')}
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
									resource={
										selection({
											fields: {
												executionModels: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('SolanaRuntime') && resolvedEntity.executionModels.values.includes('SolanaRuntime')}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															rpcEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const rpcEndpoints = entity.rpcEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.ledgerModels.values.includes('Utxo')}
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
										})
									}
									href={
										(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/observations', {
											caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
										}) : undefined)
									}
									CollapsibleProps={{ canToggle: false }}
									open={open}
									title={label}
									id={`${id}-list`}
								/>
							{/snippet}

							{#snippet SectionUtxoConsensusBlocks({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.ledgerModels.values.includes('Utxo') && resolvedEntity.ledgerModels.values.includes('Utxo')}
											<UtxoBlocksView
												selection={
													selection.Utxo.$$blocks({
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.ledgerModels.values.includes('Utxo')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.ledgerModels.values.includes('Utxo') && resolvedEntity.ledgerModels.values.includes('Utxo')}
											<UtxoTransactionsView
												selection={
													selection.Utxo.$$transactions({
														sources: [
															Source.MempoolSpace_Rest,
															Source.Blockchair_Rest,
															Source.Zcashd_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionUtxoExecutionMempool({ id, label, open })}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.ledgerModels.values.includes('Utxo') && resolvedEntity.ledgerModels.values.includes('Utxo')}
											<UtxoTransactionsView
												selection={
													selection.Utxo.$$transactions({
														sources: [
															Source.MempoolSpace_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.ledgerModels.values.includes('Utxo')}
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
										})
									}
									href={
										(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/native-assets', {
											caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
										}) : undefined)
									}
									CollapsibleProps={{ canToggle: false }}
									open={open}
									title={label}
									id={`${id}-list`}
								/>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.executionModels.values.includes('ZcashShielded')}
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
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.executionModels.values.includes('ZcashShielded') && resolvedEntity.executionModels.values.includes('ZcashShielded')}
											<ZcashShieldedPoolsView
												selection={
													selection.Zcash.$$shieldedPools({
														sources: [
															Source.Zcashd_JsonRpc,
														],
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Bittensor'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Bittensor' && resolvedEntity.namespace === 'Bittensor'}
											<BittensorNetwork_TimestampsView
												selection={
													selection.Bittensor.$$timestamps({
														sources: [
															Source.Bittensor_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionBittensorChainBlocks({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Bittensor' && resolvedEntity.namespace === 'Bittensor'}
											<BittensorBlocksView
												selection={
													selection.Bittensor.$$blocks({
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Bittensor'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Bittensor' && resolvedEntity.namespace === 'Bittensor'}
											<BittensorSubnetsView
												selection={
													selection.Bittensor.$$subnets({
														sources: [
															Source.Bittensor_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'ZeroG'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'ZeroG' && resolvedEntity.namespace === 'ZeroG'}
											<ZeroGNetwork_TimestampsView
												selection={
													selection.ZeroG.$$timestamps({
														sources: [
															Source.ZeroGStorageScan_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionZeroGStorageNodes({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'ZeroG' && resolvedEntity.namespace === 'ZeroG'}
											<ZeroGStorageNodesView
												selection={
													selection.ZeroG.$$storageNodes({
														sources: [
															Source.ZeroGStorageScan_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionZeroGStorageDataBlobs({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'ZeroG' && resolvedEntity.namespace === 'ZeroG'}
											<ZeroGDataBlobsView
												selection={
													selection.ZeroG.$$dataBlobs({
														sources: [
															Source.ZeroGStorageScan_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionZeroGStorageLogEntries({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'ZeroG' && resolvedEntity.namespace === 'ZeroG'}
											<ZeroGStorageLogEntriesView
												selection={
													selection.ZeroG.$$storageLogEntries({
														sources: [
															Source.ZeroGStorageScan_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Quilibrium'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Quilibrium' && resolvedEntity.namespace === 'Quilibrium'}
											<QuilibriumFramesView
												selection={
													selection.Quilibrium.$$frames({
														sources: [
															Source.QuilibriumNode_Grpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionQuilibriumConsensusProvers({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Quilibrium' && resolvedEntity.namespace === 'Quilibrium'}
											<QuilibriumProversView
												selection={
													selection.Quilibrium.$$provers({
														sources: [
															Source.QuilibriumNode_Grpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Quilibrium'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Quilibrium' && resolvedEntity.namespace === 'Quilibrium'}
											<QuilibriumShardsView
												selection={
													selection.Quilibrium.$$shards({
														sources: [
															Source.QuilibriumNode_Grpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionQuilibriumStateAccounts({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Quilibrium' && resolvedEntity.namespace === 'Quilibrium'}
											<QuilibriumAccountsView
												selection={
													selection.Quilibrium.$$accounts({
														sources: [
															Source.QuilibriumNode_Grpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Filecoin'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Filecoin' && resolvedEntity.namespace === 'Filecoin'}
											<FilecoinNetwork_TimestampsView
												selection={
													selection.Filecoin.$$timestamps({
														sources: [
															Source.Lotus_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionFilecoinChainTipsets({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Filecoin' && resolvedEntity.namespace === 'Filecoin'}
											<FilecoinTipsetsView
												selection={
													selection.Filecoin.$$tipsets({
														sources: [
															Source.Lotus_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Filecoin'}
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
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Filecoin' && resolvedEntity.namespace === 'Filecoin'}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															rpcEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const rpcEndpoints = entity.rpcEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Near'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Near' && resolvedEntity.namespace === 'Near'}
											<NearNetwork_TimestampsView
												selection={
													selection.Near.$$timestamps({
														sources: [
															Source.NearRpc_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionNearChainBlocks({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Near' && resolvedEntity.namespace === 'Near'}
											<NearBlocksView
												selection={
													selection.Near.$$blocks({
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Near'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Near' && resolvedEntity.namespace === 'Near'}
											<NearValidatorsView
												selection={
													selection.Near.$$validators({
														sources: [
															Source.NearRpc_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Near'}
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
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Near' && resolvedEntity.namespace === 'Near'}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															rpcEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const rpcEndpoints = entity.rpcEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Monero'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Monero' && resolvedEntity.namespace === 'Monero'}
											<MoneroNetwork_TimestampsView
												selection={
													selection.Monero.$$timestamps({
														sources: [
															Source.MoneroDaemonRpc_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionMoneroChainBlocks({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Monero' && resolvedEntity.namespace === 'Monero'}
											<MoneroBlocksView
												selection={
													selection.Monero.$$blocks({
														sources: [
															Source.MoneroDaemonRpc_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Monero'}
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
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Monero' && resolvedEntity.namespace === 'Monero'}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															rpcEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const rpcEndpoints = entity.rpcEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Lightning'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Lightning' && resolvedEntity.namespace === 'Lightning'}
											<LightningNetwork_TimestampsView
												selection={
													selection.Lightning.$$timestamps({
														sources: [
															Source.LightningMempoolSpace_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionLightningNetworkNodes({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Lightning' && resolvedEntity.namespace === 'Lightning'}
											<LightningNodesView
												selection={
													selection.Lightning.$$nodes({
														sources: [
															Source.LightningMempoolSpace_Rest,
															Source.LightningLnd_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionLightningNetworkChannels({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Lightning' && resolvedEntity.namespace === 'Lightning'}
											<LightningChannelsView
												selection={
													selection.Lightning.$$channels({
														sources: [
															Source.LightningMempoolSpace_Rest,
															Source.LightningLnd_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Lightning'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Lightning' && resolvedEntity.namespace === 'Lightning'}
											<BlockheadLightningInvoicesView
												selection={
													selection.Lightning.$$invoices({
														sources: [
															Source.LightningLnd_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionLightningLocalPayments({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Lightning' && resolvedEntity.namespace === 'Lightning'}
											<BlockheadLightningPaymentsView
												selection={
													selection.Lightning.$$payments({
														sources: [
															Source.LightningLnd_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionLightningLocalNodeStates({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Lightning' && resolvedEntity.namespace === 'Lightning'}
											<BlockheadLightningNodeStatesView
												selection={
													selection.Lightning.$$localNodeStates({
														sources: [
															Source.Local_Internal,
															Source.LightningLnd_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Tron'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Tron' && resolvedEntity.namespace === 'Tron'}
											<TronNetwork_TimestampsView
												selection={
													selection.Tron.$$timestamps({
														sources: [
															Source.TronGrid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionTronChainBlocks({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Tron' && resolvedEntity.namespace === 'Tron'}
											<TronBlocksView
												selection={
													selection.Tron.$$blocks({
														sources: [
															Source.TronGrid_Rest,
															Source.TronFullNode_Rest,
															Source.TronSolidityNode_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionTronChainWitnesses({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Tron' && resolvedEntity.namespace === 'Tron'}
											<TronWitnessesView
												selection={
													selection.Tron.$$witnesses({
														sources: [
															Source.TronGrid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Tron'}
						<CollapsibleTabs
							id={viewDomId + '-carousel-tron-assets'}
							sectionIdPrefix={viewDomId}
							sections={
								[
									{
										id: 'tron-assets-tokens',
										label: 'Tokens',
									},
									{
										id: 'tron-assets-transfers',
										label: 'Token transfers',
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

							{#snippet SectionTronAssetsTokens({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Tron' && resolvedEntity.namespace === 'Tron'}
											<TronTokensView
												selection={
													selection.Tron.$$tokens({
														sources: [
															Source.TronGrid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionTronAssetsTransfers({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Tron' && resolvedEntity.namespace === 'Tron'}
											<TronTokenTransfersView
												selection={
													selection.Tron.$$tokenTransfers({
														sources: [
															Source.TronGrid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Tron'}
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
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Tron' && resolvedEntity.namespace === 'Tron'}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															restEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const restEndpoints = entity.restEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Hyperliquid'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidNetwork_TimestampsView
												selection={
													selection.Hyperliquid.$$timestamps({
														sources: [
															Source.Hyperliquid_Rest,
															Source.Hyperliquid_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionHyperliquidChainBlocks({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidBlocksView
												selection={
													selection.Hyperliquid.$$blocks({
														sources: [
															Source.Hyperliquid_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionHyperliquidChainTransactions({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidTransactionsView
												selection={
													selection.Hyperliquid.$$transactions({
														sources: [
															Source.Hyperliquid_JsonRpc,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Hyperliquid'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidValidatorsView
												selection={
													selection.Hyperliquid.$$validators({
														sources: [
															Source.Hyperliquid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Hyperliquid'}
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
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidPerpMarketsView
												selection={
													selection.Hyperliquid.$$perpMarkets({
														sources: [
															Source.Hyperliquid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionHyperliquidMarketsSpotAssets({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidSpotAssetsView
												selection={
													selection.Hyperliquid.$$spotAssets({
														sources: [
															Source.Hyperliquid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionHyperliquidMarketsSpotPairs({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidSpotPairsView
												selection={
													selection.Hyperliquid.$$spotPairs({
														sources: [
															Source.Hyperliquid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionHyperliquidMarketsVaults({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<HyperliquidVaultsView
												selection={
													selection.Hyperliquid.$$vaults({
														sources: [
															Source.Hyperliquid_Rest,
														],
														limit: 16,
													})
												}
												CollapsibleProps={{ canToggle: false }}
												open={open}
												title={label}
												id={`${id}-list`}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.namespace === 'Hyperliquid'}
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
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															rpcEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const rpcEndpoints = entity.rpcEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

							{#snippet SectionHyperliquidResourcesRestEndpoints({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
											fields: {
												namespace: true,
											},
										})
									}
								>
									{#snippet children(entity)}
										{@const resolvedEntity = { ...pendingEntity, ...entity }}
										{#if resolvedEntity.namespace === 'Hyperliquid' && resolvedEntity.namespace === 'Hyperliquid'}
											<ResourceBoundary
												resource={
													selection({
														fields: {
															restEndpoints: true,
														},
													})
												}
											>
												{#snippet children(entity)}
													{@const restEndpoints = entity.restEndpoints}
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
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
