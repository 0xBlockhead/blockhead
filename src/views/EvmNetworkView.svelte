<script lang="ts">
	// Types/constants
	import {
		consensusProtocolByProtocol,
	} from '$/constants/EvmNetwork.ts'

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
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type EvmNetworkViewSelector =
		| EntitySelector<typeof schema, EntityType.EvmNetwork>
		| { chainId: number }


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EvmNetworkViewSelector
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const networkSelector: EntitySelector<typeof schema, EntityType.EvmNetwork> = $derived(
		'chainId' in selector ?
			{
				caip2: {
					namespace: 'eip155',
					reference: String(selector.chainId),
				},
			}
		:
		selector
	)

	const chainId = $derived(
		Number(networkSelector.caip2.reference),
	)

	const separateConsensusProtocol = $derived(
		beaconRestBaseByExecutionChainId[chainId]?.consensusProtocol,
	)

	const showNetworkDetails = $derived(
		layout === EntityLayout.SummaryDetails,
	)

	const network = $derived(
		proxy(
			EntityType.EvmNetwork,
			networkSelector,
			{
				sources: (
				showNetworkDetails ?
					[
						Source.Constants_Internal,
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
						Source.Superchain_Github,
						Source.Lifi_Rest,
					]
				:
					[
						Source.Constants_Internal,
					]
				),
			}
		)
	)

	

	

	

	const networkBlocks = $derived(network.field('$$blocks', {
		sources: [
			Source.Voltaire_JsonRpc,
		],
		limit: 16,
		count: true,
	}))

	const networkBeaconSlots = $derived(network.field('$$beaconSlots', {
		sources: [
			Source.Beacon_Rest,
		],
		limit: 1,
	}))

	const networkEnvironment = $derived(network.environment)

	

	const networkNativeCoin = $derived(network.$nativeCoin)

	const networkNativeCoinInstance = $derived(network.$nativeCoinInstance)

	const networkParent = $derived(network.$parent)

	const networkMainnet = $derived(network.$mainnet({
		sources: [
			Source.Superchain_Github,
			Source.Chainlist_Rest,
		],
	}))

	const networkIcon = $derived(network.$icon({
		sources: [
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
		],
	}))

	const networkName = $derived(network.name({
		sources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
		],
	}))

	const networkUpgrades = $derived(network.field('$$upgrades'))

	

	const networkConsensusProtocol = $derived(network.consensusProtocol({
		sources: [
			Source.Constants_Internal,
		],
	}))

	

	

	

	const networkBridges = $derived(network.field('$$bridges', {
		sources: [
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
		],
	}))

	const networkRollup = $derived(network.$rollup({
		sources: [
			Source.L2Beat_Rest,
		],
	}))

	// (Derived)
	const resolvedHref = $derived(
		href ?? `/network/${networkSelector.caip2.namespace}:${networkSelector.caip2.reference}`,
	)

	const networkSelectorKey = $derived(
		stringify(networkSelector),
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
	import MevBuildersView from '$/views/MevBuildersView.svelte'
	import MevRelaysView from '$/views/MevRelaysView.svelte'
	import MevRelay_ProposerPayloadDeliveredRowsView from '$/views/MevRelay_ProposerPayloadDeliveredRowsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork}
	entitySelector={networkSelector}
	{layout}
	href={resolvedHref}
	bind:open
>
	{#snippet Icon()}
		{#if showNetworkDetails}
			<ResourceBoundary
				resource={networkIcon}
			>
				{#snippet Pending()}
					<IconComponent />
				{/snippet}

				{#snippet children(icon)}
					{#if icon?.[EntityMetaKey.Selector].url}
						<IconComponent
							src={icon[EntityMetaKey.Selector].url}
							alt=""
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<IconComponent />
		{/if}
	{/snippet}

	{#snippet Value()}
		<span>
			Chain {String(chainId)}
		</span>
	{/snippet}

	{#snippet Title()}
		{#if showNetworkDetails}
			<ResourceBoundary
				resource={networkName}
				placeholderText="Resolving name…"
			>
				{#snippet Pending()}
					<span>
						Chain {String(chainId)}
					</span>
				{/snippet}

				{#snippet children(name)}
					{#if name}
						{name}
					{:else}
						<span>
							Chain {String(chainId)}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<span>
				Chain {String(chainId)}
			</span>
		{/if}
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
						resource={networkUpgrades}
						placeholderText="Loading upgrades…"
					>
						{#snippet Pending()}
							<span data-text="muted">—</span>
						{/snippet}

						{#snippet children(upgrades)}
							{@const upgradeSelector = upgrades.values
								.filter((upgrade) => (
									upgrade.activationTimestampMs !== undefined
									&& upgrade.activationTimestampMs <= Date.now()
								))
								.toSorted((leftUpgrade, rightUpgrade) => (
									(rightUpgrade.activationTimestampMs ?? 0)
										- (leftUpgrade.activationTimestampMs ?? 0)
								))[0]
								?.[EntityMetaKey.Selector]}
							{#if upgradeSelector !== undefined}
								<EthereumNetworkUpgradeView
									selector={upgradeSelector}
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
						resource={networkBlocks}
						placeholderText="Loading head block…"
					>
						{#snippet Pending()}
							<span data-text="muted">—</span>
						{/snippet}

						{#snippet children(blocks)}
							{@const currentBlocks = networkBlocks.current ?? blocks}
							{#if currentBlocks.totalCount !== undefined && currentBlocks.totalCount > 0}
								<EvmBlockView
									selector={{
										$network: networkSelector,
										blockNumber: BigInt(currentBlocks.totalCount - 1),
									}}
									layout={EntityLayout.Value}

									open={false}
									/>
							{:else}
								{@const latestBlock = currentBlocks.values.toSorted((leftBlock, rightBlock) => (
									('blockNumber' in rightBlock[EntityMetaKey.Selector] ? rightBlock[EntityMetaKey.Selector].blockNumber : -1n)
									=== ('blockNumber' in leftBlock[EntityMetaKey.Selector] ? leftBlock[EntityMetaKey.Selector].blockNumber : -1n) ?
										0
									: ('blockNumber' in rightBlock[EntityMetaKey.Selector] ? rightBlock[EntityMetaKey.Selector].blockNumber : -1n)
										> ('blockNumber' in leftBlock[EntityMetaKey.Selector] ? leftBlock[EntityMetaKey.Selector].blockNumber : -1n) ?
										1
									:
										-1
								))[0]}
								{#if latestBlock !== undefined}
									<EvmBlockView
										selector={latestBlock[EntityMetaKey.Selector]}
										layout={EntityLayout.Value}

										open={false}
										/>
								{:else}
									<span data-text="muted">—</span>
								{/if}
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
								resource={networkBeaconSlots}
							placeholderText="Loading head epoch…"
						>
							{#snippet Pending()}
								<span data-text="muted">—</span>
							{/snippet}

							{#snippet children(beaconSlots)}
								{@const headSlot = (
									beaconSlots.values
										.toSorted((leftSlot, rightSlot) => (
											rightSlot[EntityMetaKey.Selector].slot - leftSlot[EntityMetaKey.Selector].slot
										))[0]
										?.[EntityMetaKey.Selector].slot
								)}
								{#if headSlot !== undefined}
									<BeaconEpochView
										selector={{
											$network: networkSelector,
											epoch: Math.floor(headSlot / slotsPerEpoch),
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
								resource={networkBeaconSlots}
							placeholderText="Loading head slot…"
						>
							{#snippet Pending()}
								<span data-text="muted">—</span>
							{/snippet}

							{#snippet children(beaconSlots)}
								{@const headSlot = (
									beaconSlots.values
										.toSorted((leftSlot, rightSlot) => (
											rightSlot[EntityMetaKey.Selector].slot - leftSlot[EntityMetaKey.Selector].slot
										))[0]
										?.[EntityMetaKey.Selector].slot
								)}
								{#if headSlot !== undefined}
									<BeaconSlotView
										selector={{
											$network: networkSelector,
											slot: headSlot,
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

		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={networkEnvironment}>
				{#snippet children(environment)}
					{#if environment !== undefined}
						<div>
							<dt>Environment</dt>
							<dd>{networkEnvironmentByEnvironment[environment].label}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary resource={network.layerNumber}>
					{#snippet children(layerNumber)}
						{#if layerNumber !== undefined}
						<div>
							<dt>Layer</dt>
							<dd>
								<NumberValue value={layerNumber} />
							</dd>
						</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary resource={networkNativeCoinInstance}>
					{#snippet children(nativeCoinInstance)}
						{#if nativeCoinInstance?.entitySelector !== undefined}
						<div>
							<dt>Native currency</dt>
							<dd>
								<a
									href={resolve(
										'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
										{
											chainId: String(chainId),
											coinInstanceSlug: 'native',
										},
									)}
								>
									<ResourceBoundary resource={networkNativeCoin}>
										{#snippet children(nativeCoin)}
											{nativeCoin?.entitySelector.coinId ?? `Chain ${chainId} native`}
										{/snippet}
									</ResourceBoundary>
								</a>
							</dd>
						</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary resource={networkParent}>
					{#snippet children(parentNetwork)}
						{#if parentNetwork?.entitySelector !== undefined}
						<div>
							<dt>Parent</dt>
							<dd>
								<NetworkView
									selector={parentNetwork.entitySelector}
									layout={EntityLayout.Title}

									open={false}
									/>
							</dd>
						</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary resource={networkEnvironment}>
					{#snippet children(environment)}
						{#if environment === NetworkEnvironment.Testnet}
							<ResourceBoundary
								resource={networkMainnet}
							>
								{#snippet children(mainnet)}
									{#if mainnet?.entitySelector !== undefined}
						<div>
							<dt>Mainnet</dt>
							<dd>
								<NetworkView
									selector={mainnet.entitySelector}
									layout={EntityLayout.Title}

									open={false}
									/>
							</dd>
						</div>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={networkConsensusProtocol}
				>
					{#snippet children(consensusProtocol)}
					{#if (consensusProtocol ?? separateConsensusProtocol) !== undefined}
						<div>
							<dt>Consensus</dt>
							<dd>{consensusProtocolByProtocol[consensusProtocol ?? separateConsensusProtocol].label}</dd>
						</div>
					{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<div>
				<dt>CAIP-2</dt>
				<dd data-row="inline wrap"><code>eip155:{String(chainId)}</code></dd>
			</div>

			{#if open}
				<ResourceBoundary resource={network.registryStatus}>
					{#snippet children(registryStatus)}
					{#if registryStatus !== undefined}
						<div>
							<dt>Registry status</dt>
							<dd>{registryStatus}</dd>
						</div>
					{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary resource={network.peeringId}>
					{#snippet children(peeringId)}
					{#if (
						peeringId !== undefined
						&& peeringId !== chainId
					)}
						<div>
							<dt>Peering ID</dt>
							<dd>{String(peeringId)}</dd>
						</div>
					{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary resource={network.slip44}>
					{#snippet children(slip44)}
					{#if slip44 !== undefined}
						<div>
							<dt>SLIP-44</dt>
							<dd>{String(slip44)}</dd>
						</div>
					{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({})}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-execution`}
			sectionIdPrefix={networkSelectorKey}
			sections={[
				{ id: 'execution-upgrades', label: 'Upgrades' },
				{ id: 'execution-blocks', label: 'Blocks' },
				{ id: 'execution-transactions', label: 'Transactions' },
				{ id: 'execution-mempool', label: 'Mempool' },
				{ id: 'execution-gas-blocks', label: 'Fee market' },
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
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$executionUpgrades',
								}}
								id={`${id}-list`}

								title={label}
							/>
						{/snippet}

						{#snippet SectionExecutionBlocks({ id })}
								<EvmBlocksView
										href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks', {
											caip2: `${networkSelector.caip2.namespace}:${networkSelector.caip2.reference}`,
										})}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$blocks',
								}}
								id={`${id}-list`}

							/>
						{/snippet}

						{#snippet SectionExecutionTransactions({ id })}
							<EvmTransactionsView
								CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions', {
										caip2: `${networkSelector.caip2.namespace}:${networkSelector.caip2.reference}`,
									})}
								resource={network.field('$$transactions', {
									sources: [Source.Blockscout_Rest],
									limit: 8,
								})}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionExecutionMempool({ id, label })}
							<EvmNetwork_Txpool_TimestampsView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
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
									selector: networkSelector,
									fieldName: '$$gasFeeBlocks',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionExecutionEndpoints({ id, label })}
							<UrlsView
								CollapsibleProps={{ canToggle: false }}
								enrich={false}
								href={resolvedHref}
								emptyText="No execution endpoints listed for this network yet."
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
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

			{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
				<CollapsibleTabs
					id={`${networkSelectorKey}:carousel-consensus`}
					sectionIdPrefix={networkSelectorKey}
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
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
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
										selector: networkSelector,
										fieldName: '$$mevBuilders',
									}}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}

							{#snippet SectionConsensusMevBoost({ id })}
								<MevRelay_ProposerPayloadDeliveredRowsView
									entityFieldReference={{
										entityType: EntityType.EvmNetwork,
										selector: networkSelector,
										fieldName: '$$mevProposerPayloadDelivered',
									}}
									id={`${id}-deliveries`}

									title="MEV-Boost deliveries"
								/>
							{/snippet}

							{#snippet SectionConsensusEndpoints({ id, label })}
								<EvmNetworkConsensusEndpointsView
									CollapsibleProps={{ canToggle: false }}
									selector={networkSelector}
									id={`${id}-list`}
									title={label}
								/>
							{/snippet}
				</CollapsibleTabs>
			{/if}

			<CollapsibleTabs
				id={`${networkSelectorKey}:carousel-data-availability`}
				sectionIdPrefix={networkSelectorKey}
				sections={[
					{ id: 'data-availability-blobs', label: 'Blobs' },
				]}
				data-card
				class="network-view-collapsible-data-availability"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Data Availability</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionDataAvailabilityBlobs({ id, label })}
					<EvmBlobsView
						entityFieldReference={{
							entityType: EntityType.EvmNetwork,
							selector: networkSelector,
							fieldName: '$$blobs',
							}}
								href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blobs', {
									caip2: `${networkSelector.caip2.namespace}:${networkSelector.caip2.reference}`,
								})}
						id={`${id}-list`}

						title={label}
					/>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${networkSelectorKey}:carousel-contracts-accounts`}
				sectionIdPrefix={networkSelectorKey}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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
									selector: networkSelector,
									fieldName: '$$precompiles',
								}}
								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsContracts({ id })}
								<EvmContractsView
										href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts', {
											caip2: `${networkSelector.caip2.namespace}:${networkSelector.caip2.reference}`,
										})}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$contracts',
								}}

								id={`${id}-list`}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsSmartAccounts({ id, label })}
							<Erc4337SmartAccountsView
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$erc4337SmartAccounts',
								}}
								id={`${id}-list`}

								title={label}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsBundlers({ id, label })}
							<Erc4337BundlersView
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$erc4337Bundlers',
								}}
								id={`${id}-list`}

								title={label}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsPaymasters({ id, label })}
							<Erc4337PaymastersView
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$erc4337Paymasters',
								}}
								id={`${id}-list`}

								title={label}
							/>
						{/snippet}

						{#snippet SectionContractsAccountsUserOperations({ id })}
							<EvmUserOperationsView
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$userOperations',
								}}
								id={`${id}-list`}

							/>
						{/snippet}

						{#snippet SectionContractsAccountsFactories({ id })}
							<Erc4337AccountFactoriesView
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$erc4337AccountFactories',
								}}
								id={`${id}-list`}

								title="Account factories"
							/>
						{/snippet}
			</CollapsibleTabs>

			<ResourceBoundary
				resource={networkBridges}
			>
				{#snippet children(bridges)}
				<CollapsibleTabs
					id={`${networkSelectorKey}:carousel-assets`}
					sectionIdPrefix={networkSelectorKey}
						sections={[
							{ id: 'assets-native-coin', label: 'Native coin' },
							...(
								bridges.values.length ?
									([{ id: 'assets-bridges', label: 'Bridges' }] as const)
								:
									[]
							),
							{ id: 'assets-erc-20', label: 'ERC-20' },
							{ id: 'assets-nfts', label: 'NFTs' },
					]}
					data-card
					class="network-view-collapsible-assets"
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Assets</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionAssetsNativeCoin({ id, label })}
							<EntitiesList
								collapsible={false}
								entityType={EntityType.Coin}
								id={`${id}-list`}
								title={label}
								UnorderedListProps={{ orientation: ListOrientation.Column }}
							>
								{#snippet body()}
										<ResourceBoundary resource={networkNativeCoinInstance}>
										{#snippet children(nativeCoinInstance)}
											{#if nativeCoinInstance?.entitySelector !== undefined}
												<EvmCoinInstanceView
													selector={nativeCoinInstance.entitySelector}
													layout={EntityLayout.Summary}
													title="Native coin"
												/>
											{:else}
												<p data-text="muted">
													No native coin deployment mapped for this network.
												</p>
											{/if}
										{/snippet}
									</ResourceBoundary>

										<ResourceBoundary resource={networkNativeCoin}>
										{#snippet children(nativeCoin)}
											{#if nativeCoin?.entitySelector !== undefined}
												<CoinView
													selector={nativeCoin.entitySelector}
													layout={EntityLayout.Summary}
												/>
											{:else}
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
											{/if}
										{/snippet}
									</ResourceBoundary>
								{/snippet}
							</EntitiesList>
							{/snippet}

						{#snippet SectionAssetsBridges({ id, label })}
							<NetworkBridgesView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$bridges',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionAssetsErc20({ id, label })}
							<EvmTokenTransfersView
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$erc20TokenTransfers',
								}}
								id={`${id}-list`}

								title={label}
							/>
						{/snippet}

						{#snippet SectionAssetsNfts({ id, label })}
							<EvmTokenTransfersView
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$nftTokenTransfers',
								}}
								id={`${id}-list`}

								title={label}
							/>
						{/snippet}
				</CollapsibleTabs>
				{/snippet}
			</ResourceBoundary>

			<CollapsibleTabs
				id={`${networkSelectorKey}:carousel-resources`}
				sectionIdPrefix={networkSelectorKey}
				sections={[
					{ id: 'resources-faucets', label: 'Faucets' },
					{ id: 'resources-block-explorers', label: 'Block explorers' },
				]}
				data-card
				class="network-view-collapsible-resources"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
						{#snippet Summary({})}
							<header data-row-item="flexible" data-row="wrap gap-4">
								<HeadingComponent>Resources</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionResourcesFaucets({ id, label })}
							<UrlsView
								CollapsibleProps={{ canToggle: false }}
								enrich={false}
								href={resolvedHref}
								emptyText="No faucets listed for this network yet."
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
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
								enrich={false}
								href={resolvedHref}
								emptyText="No block explorers listed for this network yet."
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
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

			<CollapsibleTabs
				id={`${networkSelectorKey}:carousel-topology`}
				sectionIdPrefix={networkSelectorKey}
				sections={[
					{ id: 'topology-upgrades', label: 'Upgrades' },
					{ id: 'topology-parent-layer', label: 'Parent' },
					{ id: 'topology-rollup', label: 'Rollup' },
					{ id: 'topology-sibling-shards', label: 'Shards' },
					{ id: 'topology-testnets', label: 'Testnets' },
					{ id: 'topology-mainnet', label: 'Mainnet' },
					{ id: 'topology-child-layers', label: 'Layers' },
					{ id: 'topology-settled-rollups', label: 'Settled rollups' },
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
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
									fieldName: '$$upgrades',
								}}
								id={`${id}-list`}

								title={label}
							/>
						{/snippet}

						{#snippet SectionTopologyParentLayer({ id, label })}
								<ResourceBoundary resource={networkParent}>
								{#snippet children(parentNetwork)}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										{#if parentNetwork?.entitySelector !== undefined}
											<NetworkView
												selector={parentNetwork.entitySelector}
												layout={EntityLayout.Title}

												open={false}
												/>
										{:else}
											<p data-text="muted">
												No parent layer mapped for this network.
											</p>
										{/if}
									{/snippet}
								</EntitiesList>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionTopologyRollup({ id, label })}
							<ResourceBoundary
									resource={networkRollup}
							>
								{#snippet children(rollup)}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.EvmRollup}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										{#if rollup?.entitySelector.projectId !== undefined}
											<EvmRollupView
												selector={rollup.entitySelector}
												layout={EntityLayout.Summary}

											/>
										{:else}
											<p data-text="muted">
												No rollup metadata mapped for this network.
											</p>
										{/if}
									{/snippet}
								</EntitiesList>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionTopologySiblingShards({ id, label })}
							<EvmNetworksView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/networks')}
								entityFieldReference={{
									entityType: EntityType.EvmNetwork,
									selector: networkSelector,
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
									entityType: EntityType.Network,
									selector: networkSelector,
									fieldName: '$$testnets',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}

						{#snippet SectionTopologyMainnet({ id, label })}
							<ResourceBoundary
									resource={networkMainnet}
							>
								{#snippet children(mainnet)}
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									id={`${id}-list`}
									title={label}
								>
									{#snippet body({})}
										{#if mainnet?.entitySelector !== undefined}
											<NetworkView
												selector={mainnet.entitySelector}
												layout={EntityLayout.Title}

												open={false}
												/>
										{:else}
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
										{/if}
									{/snippet}
								</EntitiesList>
								{/snippet}
							</ResourceBoundary>
						{/snippet}

						{#snippet SectionTopologyChildLayers({ id, label })}
							<NetworksView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/networks')}
								entityFieldReference={{
									entityType: EntityType.Network,
									selector: networkSelector,
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
									selector: networkSelector,
									fieldName: '$$settledRollups',
								}}
								id={`${id}-list`}
								title={label}
							/>
						{/snippet}
			</CollapsibleTabs>
		{/snippet}
</EntityView>
