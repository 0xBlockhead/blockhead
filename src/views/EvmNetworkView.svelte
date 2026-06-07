<script lang="ts">
	// Types/constants
	import {
		consensusProtocolByProtocol,
	} from '$/constants/EvmNetwork.ts'

	import { catalogCoinUsdMarketIdByCoinId } from '$/constants/MarketCatalog.ts'

	import {
		NetworkEnvironment,
		NetworkNamespace,
		networkEnvironmentByEnvironment,
	} from '$/constants/Network.ts'

	import {
		beaconRestBaseByExecutionChainId,
		slotsPerEpoch,
	} from '$/constants/BeaconConsensus.ts'

	import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type EvmNetworkViewEntityId =
		| EntityId<typeof schema, EntityType.EvmNetwork>
		| { chainId: number }


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EvmNetworkViewEntityId
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const _entityId: EntityId<typeof schema, EntityType.EvmNetwork> = $derived(
		'chainId' in entityId ?
			{
				caip2: {
					namespace: 'eip155',
					reference: String(entityId.chainId),
				},
			}
		:
		entityId
	)

	const chainId = $derived(
		Number(_entityId.caip2.reference),
	)

	const separateConsensusProtocol = $derived(
		beaconRestBaseByExecutionChainId[chainId]?.consensusProtocol,
	)

	const networkSummaryHead = useEntity(
		EntityType.EvmNetwork,
		_entityId,
		{
			blockHeight: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$blocks: {
				$: [
					Source.Voltaire_JsonRpc,
				],
				$limit: 16,
			},
			$$gasEstimateTimestamps: {
				$: [
					Source.Etherscan_Rest,
				],
				$limit: 1,
			},
			$$upgrades: {},
			...(separateConsensusProtocol != null && {
				$$beaconEpochs: {
					$: [
						Source.Beacon_Rest,
					],
					$limit: 1,
				},
				$$beaconSlots: {
					$: [
						Source.Beacon_Rest,
					],
					$limit: 1,
				},
			}),
		},
	)

	const network = useEntity(
		EntityType.EvmNetwork,
		_entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Superchain_Github,
				Source.Lifi_Rest,
				...(
					open ?
						[
							Source.MevRelay_Rest,
						]
					:
						[]
				),
			],
			name: {},
			$$siblingShardNetworks: {},
			namespace: {},
			environment: {},
			consensusEndpoints: {},
			$icon: {},
			$nativeCoin: {},
			$nativeCoinInstance: {},
			shortName: {},
			registryStatus: {},
			slip44: {},
			peeringId: {},
			$$blockExplorerUrls: {
				$: [
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
					Source.Lifi_Rest,
				],
			},
			$$faucetUrls: {},
			$$bridges: {
				$: [
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
				],
			},
			$rollup: {
				$: [
					Source.L2Beat_Rest,
				],
			},
			$$settledRollups: {
				$: [
					Source.L2Beat_Rest,
				],
			},
			$$upgrades: {},
			$$executionUpgrades: {},
			$$consensusUpgrades: {},
			consensusProtocol: {
				$: [
					Source.Constants_Internal,
				],
			},
			$case: {
				namespace: {
					[NetworkNamespace.Evm]: {
						$parent: {},
						$$childLayers: {},
						$$testnets: {
							$: [
								Source.Superchain_Github,
								Source.Chainlist_Rest,
							],
						},
						$mainnet: {
							$: [
								Source.Superchain_Github,
								Source.Chainlist_Rest,
							],
						},
						layerNumber: {},
					},
				},
			},
			...(open && {
				$$gasFeeBlocks: {
					$: [
						Source.Voltaire_JsonRpc,
					],
					$limit: 64,
				},
				$$gasEstimateTimestamps: {
					$: [
						Source.Etherscan_Rest,
					],
					$limit: 64,
				},
				$$txpoolTimestamps: {
					$: [
						Source.Voltaire_JsonRpc,
					],
					$limit: 64,
				},
				$$mevProposerPayloadDelivered: {
					$: [
						Source.MevRelay_Rest,
					],
					$limit: 32,
				},
				$$beaconFinalityTimestamps: {
					$: [
						Source.Beacon_Rest,
					],
					$limit: 1,
				},
				$$beaconValidators: {
					$: [
						Source.Beacon_Rest,
					],
					$limit: 48,
				},
				$$erc4337SmartAccounts: {
					$: [
						Source.Blockscout_Rest,
					],
					$limit: 16,
				},
				$$userOperations: {
					$: [
						Source.Blockscout_Rest,
					],
					$limit: 16,
				},
				$$erc20TokenTransfers: {
					$: [
						Source.Blockscout_Rest,
					],
					$limit: 16,
				},
				$$nftTokenTransfers: {
					$: [
						Source.Blockscout_Rest,
					],
					$limit: 16,
				},
			}),
		},
	)


	// (Derived)
	const resolvedHref = $derived(
		href ?? `/network/${_entityId.caip2.namespace}:${_entityId.caip2.reference}`,
	)

	const networkIdKey = $derived(
		stringify(_entityId),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconCommitteesView from '$/views/BeaconCommitteesView.svelte'
	import EvmNetworkConsensusEndpointsView from '$/views/EvmNetworkConsensusEndpointsView.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import BeaconSyncCommitteesView from '$/views/BeaconSyncCommitteesView.svelte'
	import BeaconValidatorsView from '$/views/BeaconValidatorsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmPrecompilesView from '$/views/EvmPrecompilesView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkConsensusUpgradesView from '$/views/EthereumConsensusUpgradesView.svelte'
	import NetworkExecutionUpgradesView from '$/views/EthereumExecutionUpgradesView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
	import EvmNetwork_GasEstimate_TimestampsView from '$/views/EvmNetwork_GasEstimate_TimestampsView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
	import EvmRollupsView from '$/views/EvmRollupsView.svelte'
	import EvmNetwork_GasFee_BlocksView from '$/views/EvmNetwork_GasFee_BlocksView.svelte'
	import EvmNetwork_Txpool_TimestampsView from '$/views/EvmNetwork_Txpool_TimestampsView.svelte'
	import Erc4337AccountFactoriesView from '$/views/Erc4337AccountFactoriesView.svelte'
	import Erc4337BundlersView from '$/views/Erc4337BundlersView.svelte'
	import Erc4337PaymastersView from '$/views/Erc4337PaymastersView.svelte'
	import Erc4337SmartAccountsView from '$/views/Erc4337SmartAccountsView.svelte'
	import EthereumBeaconFinality_TimestampsView from '$/views/EthereumBeaconFinality_TimestampsView.svelte'
	import NetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import EvmNetworksView from '$/views/EvmNetworksView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import MevBuildersView from '$/views/MevBuildersView.svelte'
	import MevRelaysView from '$/views/MevRelaysView.svelte'
	import MevRelay_ProposerPayloadDeliveredRowsView from '$/views/MevRelay_ProposerPayloadDeliveredRowsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork}
	entityId={_entityId}
	{layout}
	href={resolvedHref}
	bind:open
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={network}
		>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(network)}
				{#if network.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						src={network.$icon[EntityMetaKey.Id].url}
						alt={network.name ?? ''}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			Chain {String(chainId)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={network}
			placeholderText="Resolving name…"
		>
			{#snippet Pending()}
				<span>
					Chain {String(chainId)}
				</span>
			{/snippet}

			{#snippet children(network)}
				{#if network.name}
					{network.name}
				{:else}
					<span>
						Chain {String(chainId)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution layer keyed by chain id applies transactions in block order; gas and fees are execution-layer notions.
		</p>
	{/snippet}

	{#snippet Content({
		open,
	})}
		<dl
			class="network-summary-head"
			data-column-item="center"
		>
			<div>
				<dt>Upgrade</dt>
				<dd>
					<ResourceBoundary
						resource={derive(
							networkSummaryHead,
							(network) => (
								network.$$upgrades
									?.filter((upgrade) => (
										upgrade.activationBlock !== undefined
										&& (
											network.blockHeight === undefined
											|| upgrade.activationBlock <= network.blockHeight
										)
									))
									.toSorted((leftUpgrade, rightUpgrade) => (
										(rightUpgrade.activationBlock ?? 0)
											- (leftUpgrade.activationBlock ?? 0)
									))[0]
									?.[EntityMetaKey.Id]
								?? network.$$upgrades
									?.filter((upgrade) => (
										upgrade.activationTimestampMs !== undefined
										&& upgrade.activationTimestampMs <= Date.now()
									))
									.toSorted((leftUpgrade, rightUpgrade) => (
										(rightUpgrade.activationTimestampMs ?? 0)
											- (leftUpgrade.activationTimestampMs ?? 0)
									))[0]
									?.[EntityMetaKey.Id]
							),
						)}
						placeholderText="Loading current upgrade…"
					>
						{#snippet children(upgradeId)}
							{#if upgradeId !== undefined}
								<EthereumNetworkUpgradeView
									entityId={upgradeId}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">—</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd
					data-row="inline wrap"
					id="network-summary-head-block"
				>
					<ResourceBoundary
						resource={derive(
							networkSummaryHead,
							(network) => {
								if (network.blockHeight !== undefined) {
									return network.blockHeight
								}
								return network.$$blocks
									?.toSorted((leftBlock, rightBlock) => (
										rightBlock[EntityMetaKey.Id].blockNumber
										=== leftBlock[EntityMetaKey.Id].blockNumber ?
											0
										:
											rightBlock[EntityMetaKey.Id].blockNumber
											> leftBlock[EntityMetaKey.Id].blockNumber ?
												1
											:
												-1
									))[0]
									?.[EntityMetaKey.Id].blockNumber
							},
						)}
						placeholderText="Loading head block…"
					>
						{#snippet children(blockNumber)}
							{#if blockNumber !== undefined}
								<EvmBlockView
									entityId={{
										$network: _entityId,
										blockNumber,
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">—</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
				<div>
					<dt>Epoch</dt>
					<dd>
						<ResourceBoundary
							resource={derive(
								networkSummaryHead,
								(network) => {
									if (network.$$beaconEpochs?.length) {
										return network.$$beaconEpochs
											.toSorted((leftEpoch, rightEpoch) => (
												rightEpoch[EntityMetaKey.Id].epoch - leftEpoch[EntityMetaKey.Id].epoch
											))[0]
											?.[EntityMetaKey.Id].epoch
									}
									if (!(network.$$beaconSlots?.length)) {
										return undefined
									}
									const headSlot = network.$$beaconSlots
										.toSorted((leftSlot, rightSlot) => (
											rightSlot[EntityMetaKey.Id].slot - leftSlot[EntityMetaKey.Id].slot
										))[0]
										?.[EntityMetaKey.Id].slot
									return (
										headSlot != null ?
											Math.floor(headSlot / slotsPerEpoch)
										:
											undefined
									)
								},
							)}
							placeholderText="Loading head epoch…"
						>
							{#snippet children(beaconHeadEpochValue)}
								{#if beaconHeadEpochValue !== undefined}
									<BeaconEpochView
										entityId={{
											$network: _entityId,
											epoch: beaconHeadEpochValue,
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<span data-text="muted">—</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
				<div>
					<dt>Slot</dt>
					<dd>
						<ResourceBoundary
							resource={derive(
								networkSummaryHead,
								(network) => {
									return network.$$beaconSlots
										?.toSorted((leftSlot, rightSlot) => (
											rightSlot[EntityMetaKey.Id].slot - leftSlot[EntityMetaKey.Id].slot
										))[0]
										?.[EntityMetaKey.Id].slot
								},
							)}
							placeholderText="Loading head slot…"
						>
							{#snippet children(beaconHeadSlotValue)}
								{#if beaconHeadSlotValue !== undefined}
									<BeaconSlotView
										entityId={{
											$network: _entityId,
											slot: beaconHeadSlotValue,
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<span data-text="muted">—</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Gas fee estimate</dt>
				<dd>
					<ResourceBoundary
						resource={derive(
							networkSummaryHead,
							(network) => (
								network.$$gasEstimateTimestamps
									?.toSorted((leftTimestamp, rightTimestamp) => (
										rightTimestamp[EntityMetaKey.Id].timestampMs
											- leftTimestamp[EntityMetaKey.Id].timestampMs
									))[0]
									?.[EntityMetaKey.Id]
							),
						)}
						placeholderText="Loading gas estimate…"
					>
						{#snippet children(gasEstimateId)}
							{#if gasEstimateId !== undefined}
								<EvmNetwork_GasEstimate_TimestampView
									entityId={gasEstimateId}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							{:else}
								<span data-text="muted">—</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Native currency price</dt>
				<dd>
					<ResourceBoundary
						resource={network}
						placeholderText="Loading native currency…"
					>
						{#snippet children(network)}
							{#if (
								network.$nativeCoin
								&& catalogCoinUsdMarketIdByCoinId[network.$nativeCoin[EntityMetaKey.Id].coinId] !== undefined
							)}
								<MarketPriceView
									entityId={{
										$market: catalogCoinUsdMarketIdByCoinId[network.$nativeCoin[EntityMetaKey.Id].coinId],
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">—</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if (
				network.current?.environment !== undefined
			)}
				<div>
					<dt>Environment</dt>
					<dd>
						<ResourceBoundary
							resource={network}
							placeholderText="Loading network…"
						>
							{#snippet children(network)}
								{networkEnvironmentByEnvironment[network.environment].label}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

				{#if (
					open
					&& network.current?.layerNumber !== undefined
				)}
				<div>
					<dt>Layer</dt>
					<dd>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								<NumberValue value={network.layerNumber} />
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& network.current?.$nativeCoinInstance?.[EntityMetaKey.Id] !== undefined
			)}
				<div>
					<dt>Native currency</dt>
					<dd>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								{#if network.$nativeCoinInstance}
									<EvmCoinInstanceView
										entityId={network.$nativeCoinInstance[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& network.current?.$parent?.[EntityMetaKey.Id] !== undefined
			)}
				<div>
					<dt>Parent</dt>
					<dd>
						<ResourceBoundary
							resource={network}
							placeholderText="Loading network…"
						>
								{#snippet children(network)}
									{#if network.$parent?.[EntityMetaKey.Id] !== undefined}
										<NetworkView
											entityId={network.$parent[EntityMetaKey.Id]}
											layout={EntityLayout.Title}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& network.current?.environment === NetworkEnvironment.Testnet
				&& network.current.$mainnet?.[EntityMetaKey.Id] !== undefined
			)}
				<div>
					<dt>Mainnet</dt>
					<dd>
						<ResourceBoundary
							resource={network}
							placeholderText="Loading network…"
						>
								{#snippet children(network)}
									{#if network.$mainnet?.[EntityMetaKey.Id] !== undefined}
										<NetworkView
											entityId={network.$mainnet[EntityMetaKey.Id]}
											layout={EntityLayout.Title}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& (
					network.current?.consensusProtocol !== undefined
					|| separateConsensusProtocol != null
				)
			)}
				<div>
					<dt>Consensus</dt>
					<dd>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								{#if (network.consensusProtocol ?? separateConsensusProtocol) !== undefined}
									{consensusProtocolByProtocol[network.consensusProtocol ?? separateConsensusProtocol].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>CAIP-2</dt>
				<dd data-row="inline wrap"><code>eip155:{String(chainId)}</code></dd>
			</div>

			{#if (
				open
				&& network.current?.registryStatus !== undefined
			)}
				<div>
					<dt>Registry status</dt>
					<dd>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								{network.registryStatus}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& network.current?.peeringId !== undefined
				&& network.current.peeringId !== chainId
			)}
				<div>
					<dt>Peering ID</dt>
					<dd>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								{String(network.peeringId)}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& network.current?.slip44 !== undefined
			)}
				<div>
					<dt>SLIP-44</dt>
					<dd>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								{String(network.slip44)}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({})}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<CollapsibleTabs
					id={`${networkIdKey}:carousel-execution`}
					sectionIdPrefix={networkIdKey}
					sections={[
						{ id: 'execution-upgrades', label: 'Upgrades' },
						{ id: 'execution-blocks', label: 'Blocks' },
						{ id: 'execution-transactions', label: 'Transactions' },
						{ id: 'execution-mempool', label: 'Mempool' },
						{ id: 'execution-gas-blocks', label: 'Fee market' },
						{ id: 'execution-gas-estimates', label: 'Gas oracles' },
						{ id: 'execution-endpoints', label: 'Endpoints' },
					]}
						data-card
						class="network-view-collapsible-execution"
						scrollContainerProps={{
							class: 'network-carousel-execution',
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Execution</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionExecutionUpgrades({ id, label })}
							<NetworkExecutionUpgradesView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$executionUpgrades',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionExecutionBlocks({ id })}
							<EvmBlocksView
								CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/blocks', {
										caip2Namespace: _entityId.caip2.namespace,
										caip2Reference: _entityId.caip2.reference,
									})}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$blocks',
								}}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionExecutionTransactions({ id })}
							<EvmTransactionsView
								CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/transactions', {
										caip2Namespace: _entityId.caip2.namespace,
										caip2Reference: _entityId.caip2.reference,
									})}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$transactions',
								}}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionExecutionMempool({ id, label })}
							<EvmNetwork_Txpool_TimestampsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$txpoolTimestamps',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionExecutionGasBlocks({ id, label })}
							<EvmNetwork_GasFee_BlocksView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$gasFeeBlocks',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionExecutionGasEstimates({ id, label })}
							<EvmNetwork_GasEstimate_TimestampsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$gasEstimateTimestamps',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionExecutionEndpoints({ id, label })}
							<UrlsView
								CollapsibleProps={{ canToggle: false }}
								href={resolvedHref}
								emptyText="No execution endpoints listed for this network yet."
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$rpcUrls',
								}}
								fieldSources={[
									Source.Constants_Internal,
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
									Source.Lifi_Rest,
								]}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}
					</CollapsibleTabs>
				{/snippet}
			</ResourceBoundary>

			{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<CollapsibleTabs
							id={`${networkIdKey}:carousel-consensus`}
							sectionIdPrefix={networkIdKey}
							sections={[
								{ id: 'consensus-upgrades', label: 'Upgrades' },
								{ id: 'consensus-finality', label: 'Finality' },
								{ id: 'consensus-committees', label: 'Committees' },
								{ id: 'consensus-sync-committees', label: 'Sync committees' },
								{ id: 'consensus-attestations', label: 'Attestations' },
								{ id: 'consensus-withdrawals', label: 'Withdrawals' },
								{ id: 'consensus-slashings', label: 'Slashings' },
								{ id: 'consensus-validators', label: 'Validators' },
								{ id: 'consensus-epochs', label: 'Epochs' },
								{ id: 'consensus-slots', label: 'Slots' },
								{ id: 'consensus-mev-relays', label: 'Relays' },
								{ id: 'consensus-mev-builders', label: 'Builders' },
								{ id: 'consensus-mev-boost', label: 'MEV-Boost' },
								{ id: 'consensus-endpoints', label: 'Endpoints' },
							]}
							data-card
							class="network-view-collapsible-consensus"
						>
							{#snippet Summary({})}
								<header data-row-item="flexible" data-row="wrap gap-4">
									<HeadingComponent>Consensus &amp; Block Production</HeadingComponent>
								</header>
							{/snippet}

							{#snippet SectionConsensusUpgrades({ id, label })}
								<NetworkConsensusUpgradesView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$consensusUpgrades',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusFinality({ id, label })}
								<EthereumBeaconFinality_TimestampsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconFinalityTimestamps',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusCommittees({ id, label })}
								<BeaconCommitteesView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconCommittees',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusSyncCommittees({ id, label })}
								<BeaconSyncCommitteesView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconSyncCommittees',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusAttestations({ id, label })}
								<BeaconAttestationsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconAttestations',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusWithdrawals({ id, label })}
								<BeaconWithdrawalsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconWithdrawals',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusSlashings({ id, label })}
								<BeaconSlashingsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconSlashings',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusValidators({ id })}
								<BeaconValidatorsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconValidators',
									}}
									id={`${id}-validators`}
									title="Recent proposers"
								/>
							{/snippet}

							{#snippet SectionConsensusEpochs({ id })}
								<BeaconEpochsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconEpochs',
									}}
									id={`${id}-list`}
								/>
							{/snippet}

							{#snippet SectionConsensusSlots({ id })}
								<BeaconSlotsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$beaconSlots',
									}}
									id={`${id}-list`}
								/>
							{/snippet}

							{#snippet SectionConsensusMevRelays({ id, label })}
								<MevRelaysView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$mevRelays',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusMevBuilders({ id, label })}
								<MevBuildersView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$mevBuilders',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusMevBoost({ id })}
								<MevRelay_ProposerPayloadDeliveredRowsView
									CollapsibleProps={{ canToggle: false }}
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										entityId: _entityId,
										fieldName: '$$mevProposerPayloadDelivered',
									}}
									id={`${id}-deliveries`}
									title="MEV-Boost deliveries"
								/>
							{/snippet}

							{#snippet SectionConsensusEndpoints({ id, label })}
								<EvmNetworkConsensusEndpointsView
									CollapsibleProps={{ canToggle: false }}
									entityId={_entityId}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}
						</CollapsibleTabs>
					{/snippet}
				</ResourceBoundary>
			{/if}

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-data-availability`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'data-availability-blobs', label: 'Blobs' },
				]}
				data-card
				class="network-view-collapsible-data-availability"
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Data Availability</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionDataAvailabilityBlobs({ id, label })}
					<EvmBlobsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId: _entityId,
							fieldName: '$$blobs',
						}}
							href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/blobs', {
								caip2Namespace: _entityId.caip2.namespace,
								caip2Reference: _entityId.caip2.reference,
							})}
						id={`${id}-list`}
						title={label}
					/>
				{/snippet}
			</CollapsibleTabs>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					<CollapsibleTabs
						id={`${networkIdKey}:carousel-contracts-accounts`}
						sectionIdPrefix={networkIdKey}
						sections={[
							{ id: 'contracts-accounts-precompiles', label: 'Precompiles' },
							{ id: 'contracts-accounts-contracts', label: 'Verified' },
							{ id: 'contracts-accounts-smart-accounts', label: 'Smart accounts' },
							{ id: 'contracts-accounts-bundlers', label: 'Bundlers' },
							{ id: 'contracts-accounts-paymasters', label: 'Paymasters' },
							{ id: 'contracts-accounts-user-operations', label: 'User operations' },
							{ id: 'contracts-accounts-factories', label: 'Factories' },
						]}
						data-card
						class="network-view-collapsible-contracts-accounts"
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Contracts &amp; Accounts</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionContractsAccountsPrecompiles({ id })}
							<EvmPrecompilesView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$precompiles',
								}}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsContracts({ id })}
							<EvmContractsView
								CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/contracts', {
										caip2Namespace: _entityId.caip2.namespace,
										caip2Reference: _entityId.caip2.reference,
									})}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$contracts',
								}}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsSmartAccounts({ id, label })}
							<Erc4337SmartAccountsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$erc4337SmartAccounts',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsBundlers({ id, label })}
							<Erc4337BundlersView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$erc4337Bundlers',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsPaymasters({ id, label })}
							<Erc4337PaymastersView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$erc4337Paymasters',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsUserOperations({ id })}
							<EvmUserOperationsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$userOperations',
								}}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsFactories({ id })}
							<Erc4337AccountFactoriesView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$erc4337AccountFactories',
								}}
								id={`${id}-list`}
								title="Account factories"
							/>
						{/snippet}
					</CollapsibleTabs>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					<CollapsibleTabs
						id={`${networkIdKey}:carousel-assets`}
						sectionIdPrefix={networkIdKey}
							sections={[
								{ id: 'assets-native-coin', label: 'Native coin' },
								...(
									(network.$$bridges ?? []).length ?
										([{ id: 'assets-bridges', label: 'Bridges' }] as const)
									:
										[]
								),
								{ id: 'assets-erc-20', label: 'ERC-20' },
								{ id: 'assets-nfts', label: 'NFTs' },
							]}
						data-card
						class="network-view-collapsible-assets"
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionAssetsNativeCoin({ id, label })}
							{@const assetRows = [
								...(
									network.$nativeCoinInstance ?
										[
											{
												id: 'native-coin-instance',
												type: 'native-coin-instance',
											},
										]
									:
										[]
								),
								...(
									network.$nativeCoin ?
										[
											{
												id: 'native-coin',
												type: 'native-coin',
											},
										]
									:
										[]
								),
								...(
									!network.$nativeCoin && network.$nativeCoinInstance ?
										[
											{
												id: 'native-coin-mapping-notice',
												type: 'native-coin-mapping-notice',
											},
										]
									:
										[]
								),
								...(
									!network.$nativeCoinInstance ?
										[
											{
												id: 'native-coin-missing-notice',
												type: 'native-coin-missing-notice',
											},
										]
									:
										[]
								),
							] as const}
							<EntitiesList
								collapsible={false}
								entityType={EntityType.Coin}
								getKey={(item) => item.id}
								id={`${id}-list`}
								items={assetRows}
								title={label}
								UnorderedListProps={{ orientation: ListOrientation.Column }}
							>
									{#snippet Item({ item })}
										{#if item.type === 'native-coin-instance'}
											{#if network.$nativeCoinInstance !== undefined}
												<EvmCoinInstanceView
													entityId={network.$nativeCoinInstance[EntityMetaKey.Id]}
													layout={EntityLayout.Summary}
													title="Native coin"
												/>
											{/if}
										{:else if item.type === 'native-coin'}
											{#if network.$nativeCoin !== undefined}
												<CoinView
													entityId={network.$nativeCoin[EntityMetaKey.Id]}
													layout={EntityLayout.Summary}
												/>
											{/if}
									{:else if item.type === 'native-coin-mapping-notice'}
										<div data-row="wrap align-center gap-2">
											<p data-text="muted">
												No logical coin catalog match for this native deployment.
											</p>
											<Tooltip contentProps={{ side: 'top' }}>
												{#snippet Content()}
													<p>
														The deployment still resolves through <code>CoinInstance</code>; the registry symbol just does not map to a catalog <code>Coin</code> yet.
													</p>
												{/snippet}
												<abbr
													class="entity-heading-tip"
													aria-label="Logical coin mapping"
												>ⓘ</abbr>
											</Tooltip>
										</div>
									{:else}
										<p data-text="muted">
											No native coin deployment mapped for this network.
										</p>
									{/if}
								{/snippet}
							</EntitiesList>
							{/snippet}

						{#snippet SectionAssetsBridges({ id, label })}
							<NetworkBridgesView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$bridges',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionAssetsErc20({ id, label })}
							<EvmTokenTransfersView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$erc20TokenTransfers',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionAssetsNfts({ id, label })}
							<EvmTokenTransfersView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$nftTokenTransfers',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}
					</CollapsibleTabs>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					<CollapsibleTabs
						id={`${networkIdKey}:carousel-resources`}
						sectionIdPrefix={networkIdKey}
						sections={[
							{ id: 'resources-faucets', label: 'Faucets' },
							{ id: 'resources-block-explorers', label: 'Block explorers' },
						]}
						data-card
						class="network-view-collapsible-resources"
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionResourcesFaucets({ id, label })}
							<UrlsView
								CollapsibleProps={{ canToggle: false }}
								href={resolvedHref}
								emptyText="No faucets listed for this network yet."
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$faucetUrls',
								}}
								fieldSources={[
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
								]}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionResourcesBlockExplorers({ id, label })}
							<UrlsView
								CollapsibleProps={{ canToggle: false }}
								href={resolvedHref}
								emptyText="No block explorers listed for this network yet."
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$blockExplorerUrls',
								}}
								fieldSources={[
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
									Source.Lifi_Rest,
								]}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}
					</CollapsibleTabs>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					<CollapsibleTabs
						id={`${networkIdKey}:carousel-topology`}
						sectionIdPrefix={networkIdKey}
						sections={[
							{ id: 'topology-upgrades', label: 'Upgrades' },
							...(
								network.$parent?.[EntityMetaKey.Id] !== undefined ?
									([{ id: 'topology-parent-layer', label: 'Parent' }] as const)
								:
									[]
							),
							...(
								network.$rollup?.[EntityMetaKey.Id].projectId !== undefined ?
									([{ id: 'topology-rollup', label: 'Rollup' }] as const)
								:
									[]
							),
							...(
								(network.$$siblingShardNetworks ?? []).length ?
									([{ id: 'topology-sibling-shards', label: 'Shards' }] as const)
								:
									[]
							),
							...(
								network.environment === NetworkEnvironment.Mainnet ?
									([{ id: 'topology-testnets', label: 'Testnets' }] as const)
								:
									[]
							),
							...(
								network.environment === NetworkEnvironment.Testnet ?
									([{ id: 'topology-mainnet', label: 'Mainnet' }] as const)
								:
									[]
							),
							...(
								(network.$$childLayers ?? []).length ?
									([{ id: 'topology-child-layers', label: 'Layers' }] as const)
								:
									[]
							),
							...(
								(network.$$settledRollups ?? []).length ?
									([{ id: 'topology-settled-rollups', label: 'Settled rollups' }] as const)
								:
									[]
							),
						]}
						data-card
						class="network-view-collapsible-topology"
						scrollContainerProps={{
							'data-row': 'start align-start',
						}}
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Topology</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionTopologyUpgrades({ id, label })}
							<EthereumNetworkUpgradesView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$upgrades',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionTopologyParentLayer({ id, label })}
							{#if network.$parent != null}
								{@const parentId = network.$parent[EntityMetaKey.Id]}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										<NetworkView
											entityId={parentId}
											layout={EntityLayout.Title}
											open={false}
										/>
									{/snippet}
								</EntitiesList>
							{/if}
						{/snippet}

						{#snippet SectionTopologyRollup({ id, label })}
							{#if (
								network.$rollup != null
								&& network.$rollup[EntityMetaKey.Id].projectId !== undefined
							)}
								{@const rollupId = network.$rollup[EntityMetaKey.Id]}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.EvmRollup}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										<EvmRollupView
											entityId={rollupId}
											layout={EntityLayout.Summary}
											open={false}
										/>
									{/snippet}
								</EntitiesList>
							{/if}
						{/snippet}

						{#snippet SectionTopologySiblingShards({ id, label })}
							<EvmNetworksView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/networks')}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$siblingShardNetworks',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionTopologyTestnets({ id, label })}
							<NetworksView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/networks')}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$testnets',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionTopologyMainnet({ id, label })}
							{#if network.$mainnet != null}
								{@const mainnetId = network.$mainnet[EntityMetaKey.Id]}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										<NetworkView
											entityId={mainnetId}
											layout={EntityLayout.Title}
											open={false}
										/>
									{/snippet}
								</EntitiesList>
							{:else}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										<div class="entity-details">
											<div data-row="wrap align-center gap-2">
												<p data-text="muted">
													No mapped mainnet.
												</p>
												<Tooltip contentProps={{ side: 'top' }}>
													{#snippet Content()}
														<p>
															Testnets often advertise a canonical Ethereum mainnet chain id so wallets and explorers can show “paired” networks in docs and defaults.
														</p>
														<p>
															Without recorded bridge or lineage metadata, tools cannot infer which mainnet row corresponds to a given rollup or devnet id.
														</p>
													{/snippet}
													<abbr
														class="entity-heading-tip"
														aria-label="Mainnet mapping"
													>ⓘ</abbr>
												</Tooltip>
											</div>
										</div>
									{/snippet}
								</EntitiesList>
							{/if}
						{/snippet}

						{#snippet SectionTopologyChildLayers({ id, label })}
							<NetworksView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/networks')}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$childLayers',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionTopologySettledRollups({ id, label })}
							<EvmRollupsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									entityId: _entityId,
									fieldName: '$$settledRollups',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}
					</CollapsibleTabs>
				{/snippet}
			</ResourceBoundary>
		{/snippet}
</EntityView>
