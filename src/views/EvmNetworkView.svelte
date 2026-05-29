<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'
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


	// Context
	import { resolve } from '$app/paths'


	// State
	type EvmNetworkViewEntityId =
		| EntityId<typeof schema, EntityType.EvmNetwork>
		| { chainId: number }

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

	if ('chainId' in entityId) {
		entityId = {
			caip2: {
				namespace: 'eip155',
				reference: String(entityId.chainId),
			},
		}
	}


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const resolvedHref = $derived(
		href ?? resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]',
			{ ...caip2RouteParamsFromEvmChainId(Number(entityId.caip2.reference)) },
		),
	)

	const chainId = $derived(
		Number(entityId.caip2.reference),
	)

	const separateConsensusProtocol = $derived(
		beaconRestBaseByExecutionChainId[chainId]?.consensusProtocol,
	)

	const networkSummaryHead = useEntity(
		EntityType.EvmNetwork,
		entityId,
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
		entityId,
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
			executionEndpoints: {},
			$$rpcUrls: {},
			$$blockExplorerUrls: {},
			$icon: {},
			$nativeCoin: {},
			$nativeCoinInstance: {},
			shortName: {},
			registryStatus: {},
			slip44: {},
			peeringId: {},
			$$faucetUrls: {},
			$$bridges: {
				$: [
					Source.Chainlist_Rest,
					Source.EthereumLists_Rest,
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
			}),
		},
	)

	const networkIdKey = $derived(
		stringify(entityId),
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
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import BeaconValidatorsView from '$/views/BeaconValidatorsView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmPrecompilesView from '$/views/EvmPrecompilesView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkConsensusUpgradesView from '$/views/EthereumConsensusUpgradesView.svelte'
	import NetworkExecutionUpgradesView from '$/views/EthereumExecutionUpgradesView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
	import EvmNetwork_GasEstimate_TimestampsView from '$/views/EvmNetwork_GasEstimate_TimestampsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
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
	import NetworksView from '$/views/EvmNetworksView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import MevRelay_ProposerPayloadDeliveredRowsView from '$/views/MevRelay_ProposerPayloadDeliveredRowsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork}
	{entityId}
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
				{@render Value()}
			{/snippet}

			{#snippet children(network)}
				{#if network.name}
					{network.name}
				{:else}
					{@render Value()}
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
										: rightBlock[EntityMetaKey.Id].blockNumber
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
										$network: { caip2: entityId.caip2 },
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
											$network: { caip2: entityId.caip2 },
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
											$network: { caip2: entityId.caip2 },
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
									showTypeAnnotation={false}
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
				network.environment !== undefined
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
				&& network.layerNumber !== undefined
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
				&& network.shortName !== undefined
			)}
				<div>
					<dt>Short name</dt>
					<dd>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								<code>{network.shortName}</code>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& network.$nativeCoinInstance?.[EntityMetaKey.Id] !== undefined
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
				&& network.$parent?.[EntityMetaKey.Id].caip2 !== undefined
			)}
				<div>
					<dt>Parent</dt>
					<dd>
						<ResourceBoundary
							resource={network}
							placeholderText="Loading network…"
						>
							{#snippet children(network)}
								<EvmNetworkView
									entityId={network.$parent[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& network.environment === NetworkEnvironment.Testnet
				&& network.$mainnet?.[EntityMetaKey.Id].caip2 !== undefined
			)}
				<div>
					<dt>Mainnet</dt>
					<dd>
						<ResourceBoundary
							resource={network}
							placeholderText="Loading network…"
						>
							{#snippet children(network)}
								<EvmNetworkView
									entityId={network.$mainnet[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& (
					network.consensusProtocol !== undefined
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
				&& network.registryStatus !== undefined
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
				&& network.peeringId !== undefined
				&& network.peeringId !== chainId
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
				&& network.slip44 !== undefined
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
						{ id: 'execution-blocks', label: 'Blocks' },
						{ id: 'execution-transactions', label: 'Transactions' },
						{ id: 'execution-mempool', label: 'Mempool' },
						{ id: 'execution-user-operations', label: 'User operations' },
						{ id: 'execution-blobs', label: 'Blobs' },
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
							<HeadingComponent>Activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionExecutionBlocks({ id })}
						<EvmBlocksView
							CollapsibleProps={{ canToggle: false }}
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/blocks',
								{
									...caip2RouteParamsFromEvmChainId(chainId),
								},
							)}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$blocks',
							}}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionExecutionTransactions({ id })}
						<EvmTransactionsView
							CollapsibleProps={{ canToggle: false }}
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/transactions',
								{
									...caip2RouteParamsFromEvmChainId(chainId),
								},
							)}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
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
								entityId,
								fieldName: '$$txpoolTimestamps',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionExecutionUserOperations({ id })}
						<EvmUserOperationsView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$userOperations',
							}}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionExecutionBlobs({ id, label })}
						<EvmBlobsView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$blobs',
							}}
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/blobs',
								{
									...caip2RouteParamsFromEvmChainId(chainId),
								},
							)}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ResourceBoundary>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-economics`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'economics-assets', label: 'Native asset' },
				{ id: 'economics-gas-blocks', label: 'Fee market' },
				{ id: 'economics-gas-estimates', label: 'Gas oracles' },
			]}
			data-card
			class="network-view-collapsible-economics"
		>
			{#snippet Summary({})}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Fees &amp; DA</HeadingComponent>
					<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Native coin deployment, block-keyed fee-market snapshots from <code>eth_feeHistory</code>, and explorer gas-oracle suggestions.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Fees and data availability sections"
							>ⓘ</abbr>
					</Tooltip>
				</header>
			{/snippet}

			{#snippet SectionEconomicsAssets({})}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
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
							id={`${networkIdKey}:economics-assets`}
							title="Native coin"
							showSummary={false}
							items={assetRows}
						>
							{#snippet Item({ item })}
								{#if item.type === 'native-coin-instance'}
									<EvmCoinInstanceView
										entityId={network.$nativeCoinInstance[EntityMetaKey.Id]}
										layout={EntityLayout.Summary}
										title="Native coin"
									/>
								{:else if item.type === 'native-coin'}
									<CoinView
										entityId={network.$nativeCoin[EntityMetaKey.Id]}
										layout={EntityLayout.Summary}
									/>
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
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionEconomicsGasBlocks({ id, label })}
				<EvmNetwork_GasFee_BlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.EvmNetwork,
						entityId,
						fieldName: '$$gasFeeBlocks',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionEconomicsGasEstimates({ id, label })}
				<EvmNetwork_GasEstimate_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.EvmNetwork,
						entityId,
						fieldName: '$$gasEstimateTimestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

		</CollapsibleTabs>

		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<CollapsibleTabs
					id={`${networkIdKey}:carousel-erc-4337`}
					sectionIdPrefix={networkIdKey}
					sections={[
						{ id: 'erc-4337-smart-accounts', label: 'Smart accounts' },
						{ id: 'erc-4337-bundlers', label: 'Bundlers' },
						{ id: 'erc-4337-paymasters', label: 'Paymasters' },
						{ id: 'erc-4337-user-operations', label: 'User operations' },
						{ id: 'erc-4337-factories', label: 'Factories' },
					]}
					data-card
					class="network-view-collapsible-erc-4337"
				>
					{#snippet Summary({})}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Accounts</HeadingComponent>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Smart accounts, bundlers, paymasters, and account factories Blockscout indexes for this chain. Recent user operations appear with activity.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="ERC-4337 on this network"
								>ⓘ</abbr>
							</Tooltip>
						</header>
					{/snippet}

					{#snippet SectionErc4337SmartAccounts({ id, label })}
						<Erc4337SmartAccountsView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$erc4337SmartAccounts',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionErc4337Bundlers({ id, label })}
						<Erc4337BundlersView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$erc4337Bundlers',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionErc4337Paymasters({ id, label })}
						<Erc4337PaymastersView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$erc4337Paymasters',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionErc4337UserOperations({ id })}
						<EvmUserOperationsView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$userOperations',
							}}
							id={`${id}-list`}
						/>
					{/snippet}

					{#snippet SectionErc4337Factories({ id })}
						<Erc4337AccountFactoriesView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$erc4337AccountFactories',
							}}
							id={`${id}-list`}
							title="Account factories"
						/>
					{/snippet}
				</CollapsibleTabs>
			{/snippet}
		</ResourceBoundary>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-data-storage`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'data-precompiles', label: 'Precompiles' },
				{ id: 'data-contracts', label: 'Verified' },
				{ id: 'data-execution-upgrades', label: 'Upgrades' },
			]}
			data-card
			class="network-view-collapsible-data-storage"
		>
			{#snippet Summary({})}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Contracts &amp; Code</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDataPrecompiles({ id })}
				<EvmPrecompilesView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.EvmNetwork,
						entityId,
						fieldName: '$$precompiles',
					}}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionDataContracts({ id })}
				<EvmContractsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve(
						'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/contracts',
						{
							...caip2RouteParamsFromEvmChainId(chainId),
						},
					)}
					entityFieldReference={{
						entityType: EntityType.EvmNetwork,
						entityId,
						fieldName: '$$contracts',
					}}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionDataExecutionUpgrades({ id, label })}
				<NetworkExecutionUpgradesView
					CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId,
							fieldName: '$$executionUpgrades',
						}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<CollapsibleTabs
					id={`${networkIdKey}:carousel-topology`}
					sectionIdPrefix={networkIdKey}
					sections={[
						{ id: 'topology-upgrades', label: 'Upgrades' },
						...(
							network.$parent?.[EntityMetaKey.Id].caip2 !== undefined ?
								([{ id: 'topology-parent-layer', label: 'Parent' }] as const)
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
							(network.$$bridges ?? []).length ?
								([{ id: 'topology-bridges', label: 'Bridges' }] as const)
							:
								[]
						),
						...(
							(network.$$faucetUrls ?? []).length ?
								([{ id: 'topology-faucets', label: 'Faucets' }] as const)
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
							<HeadingComponent>Topology &amp; Bridges</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionTopologyUpgrades({ id, label })}
						<EthereumNetworkUpgradesView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$upgrades',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionTopologyParentLayer({ id, label })}
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.EvmNetwork}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										<EvmNetworkView
											entityId={network.$parent[EntityMetaKey.Id]}
											layout={EntityLayout.Title}
											open={false}
										/>
									{/snippet}
								</EntitiesList>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionTopologySiblingShards({ id, label })}
						<NetworksView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/networks')}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
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
								entityId,
								fieldName: '$$testnets',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionTopologyMainnet({ id, label })}
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								{#if network.$mainnet?.[EntityMetaKey.Id].caip2 !== undefined}
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EvmNetwork}
										id={`${id}-list`}
										title={label}
									>
										{#snippet body({})}
											<EvmNetworkView
												entityId={network.$mainnet[EntityMetaKey.Id]}
												layout={EntityLayout.Title}
												open={false}
											/>
										{/snippet}
									</EntitiesList>
								{:else}
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EvmNetwork}
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
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionTopologyChildLayers({ id, label })}
						<NetworksView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/networks')}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$childLayers',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionTopologyBridges({ id, label })}
						<NetworkBridgesView
							CollapsibleProps={{ canToggle: false }}
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
								fieldName: '$$bridges',
							}}
							id={`${id}-list`}
							title={label}
						/>
					{/snippet}

					{#snippet SectionTopologyFaucets({ id, label })}
						<UrlsView
							CollapsibleProps={{ canToggle: false }}
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]',
								{
									...caip2RouteParamsFromEvmChainId(chainId),
								},
							)}
							emptyText="No faucets listed for this network yet."
							entityFieldReference={{
								entityType: EntityType.EvmNetwork,
								entityId,
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
				</CollapsibleTabs>
			{/snippet}
		</ResourceBoundary>

		{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-consensus`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'beacon-finality', label: 'Finality' },
					{ id: 'beacon-validators', label: 'Validators' },
					{ id: 'beacon-epochs', label: 'Epochs' },
					{ id: 'beacon-slots', label: 'Slots' },
					{ id: 'consensus-upgrades', label: 'Upgrades' },
				]}
				data-card
				class="network-view-collapsible-consensus"
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Consensus &amp; Validators</HeadingComponent>
					</header>
				{/snippet}


				{#snippet SectionBeaconFinality({ id, label })}
					<EthereumBeaconFinality_TimestampsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId,
							fieldName: '$$beaconFinalityTimestamps',
						}}
						id={`${id}-list`}
						title={label}
					/>
				{/snippet}

				{#snippet SectionBeaconValidators({ id })}
					<BeaconValidatorsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId,
							fieldName: '$$beaconValidators',
						}}
						id={`${id}-validators`}
						title="Recent proposers"
					/>
				{/snippet}

				{#snippet SectionBeaconEpochs({ id })}
					<BeaconEpochsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId,
							fieldName: '$$beaconEpochs',
						}}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBeaconSlots({ id })}
					<BeaconSlotsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId,
							fieldName: '$$beaconSlots',
						}}
						id={`${id}-list`}
					/>
				{/snippet}
				{#snippet SectionConsensusUpgrades({ id, label })}
					<NetworkConsensusUpgradesView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId,
							fieldName: '$$consensusUpgrades',
						}}
						id={`${id}-list`}
						title={label}
					/>
				{/snippet}
			</CollapsibleTabs>
		{/if}

		{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-block-production`}
				sectionIdPrefix={networkIdKey}
				sections={[{ id: 'block-production-mev-boost', label: 'MEV-Boost' }]}
				data-card
				class="network-view-collapsible-block-production"
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Block Production</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBlockProductionMevBoost({ id })}
					<MevRelay_ProposerPayloadDeliveredRowsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							entityId,
							fieldName: '$$mevProposerPayloadDelivered',
						}}
						id={`${id}-deliveries`}
						title="MEV-Boost deliveries"
					/>
				{/snippet}
			</CollapsibleTabs>
		{/if}

		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				{#if (network.$$rpcUrls ?? []).length || (network.$$blockExplorerUrls ?? []).length}
					<CollapsibleTabs
						id={`${networkIdKey}:carousel-infrastructure`}
						sectionIdPrefix={networkIdKey}
						sections={[
							...((network.$$rpcUrls ?? []).length ? ([{ id: 'infrastructure-providers', label: 'RPC endpoints' }] as const) : []),
							...((network.$$blockExplorerUrls ?? []).length ? ([{ id: 'infrastructure-explorers', label: 'Explorers' }] as const) : []),
						]}
						data-card
						class="network-view-collapsible-infrastructure"
					>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Infrastructure</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionInfrastructureProviders({ id, label })}
							<UrlsView CollapsibleProps={{ canToggle: false }} href={resolvedHref} emptyText="No RPC endpoints listed for this network yet." entityFieldReference={{ entityType: EntityType.EvmNetwork, entityId, fieldName: '$$rpcUrls' }} fieldSources={[Source.Constants_Internal, Source.Chainlist_Rest, Source.EthereumLists_Rest, Source.Lifi_Rest]} id={`${id}-list`} title={label} />
						{/snippet}

						{#snippet SectionInfrastructureExplorers({ id, label })}
							<UrlsView CollapsibleProps={{ canToggle: false }} href={resolvedHref} emptyText="No block explorers listed for this network yet." entityFieldReference={{ entityType: EntityType.EvmNetwork, entityId, fieldName: '$$blockExplorerUrls' }} fieldSources={[Source.Chainlist_Rest, Source.EthereumLists_Rest, Source.Lifi_Rest]} id={`${id}-list`} title={label} />
						{/snippet}
					</CollapsibleTabs>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
