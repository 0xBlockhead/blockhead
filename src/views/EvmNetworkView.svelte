<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetwork>>
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

	const evmNetwork = $derived(selection({
		sources: open ? [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
			Source.Lifi_Rest,
		] : [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			environment: true,
			$icon: true,
			shortName: true,
			registryStatus: true,
			consensusProtocol: true,
			peeringId: true,
			slip44: true,
			...(open && {
				$nativeCoinInstance: true,
				$parent: true,
				$mainnet: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [selection.entitySelector.caip2 == null ? '' : String((`${(selection.entitySelector.caip2).namespace}:${(selection.entitySelector.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'EVM network')
	const viewDomId = $derived('evm-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
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
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmPrecompilesView from '$/views/EvmPrecompilesView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import Erc4337SmartAccountsView from '$/views/Erc4337SmartAccountsView.svelte'
	import Erc4337BundlersView from '$/views/Erc4337BundlersView.svelte'
	import Erc4337PaymastersView from '$/views/Erc4337PaymastersView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import Erc4337AccountFactoriesView from '$/views/Erc4337AccountFactoriesView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import EvmNetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
	import EvmNetworksView from '$/views/EvmNetworksView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import EvmRollupsView from '$/views/EvmRollupsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (({ ...selection.entitySelector, ...prefetched })?.caip2 != null && ({ ...selection.entitySelector, ...prefetched })?.caip2?.namespace != null && ({ ...selection.entitySelector, ...prefetched })?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).caip2.reference)}`,
		}) : ({ ...selection.entitySelector, ...prefetched })?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).slug),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={evmNetwork}>
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
		<ResourceBoundary
			resource={evmNetwork}
			placeholderText="Resolving name..."
		>
			{#snippet Pending()}
				{@const caip2 = ({ ...selection.entitySelector, ...prefetched }).caip2}
				{#if caip2 != null}
					<span>
						Chain {String(caip2.reference ?? '')}
					</span>
				{:else}
					EVM network
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const name = entity.name}
				{#if name}
					{String(name ?? '')}
				{:else if entity.caip2 != null}
					<span>
						Chain {String(entity.caip2.reference ?? '')}
					</span>
				{:else}
					EVM network
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetwork}>
			{#snippet Pending()}
				{@const caip2 = ({ ...selection.entitySelector, ...prefetched }).caip2}
				{#if caip2 != null}
					<span>
						Chain {String(caip2.reference ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const caip2 = entity.caip2 ?? selection.entitySelector.caip2 ?? prefetched.caip2}
				{#if caip2 != null}
					<span>
						Chain {String(caip2.reference ?? '')}
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

	{#snippet Content({ open: contentOpen })}
		<dl class='network-summary-head' data-column-item="center">
			<div>
				<dt>Upgrade</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.EthereumNetworkUpgrade>('$$upgrades', {
								sources: [
									Source.Constants_Internal,
								],
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow.entitySelector.activationTimestampMs ?? fieldRow.activationTimestampMs, 'desc'],
								],
							}).first()
						}
						placeholderText='Loading latest upgrade...'
					>
						{#snippet Pending()}
							<span data-text="muted">-</span>
						{/snippet}

						{#snippet children(ethereumNetworkUpgrade)}
							{#if ethereumNetworkUpgrade != null}
								{@const ethereumNetworkUpgradeSelector = ethereumNetworkUpgrade.entitySelector}
								<EthereumNetworkUpgradeView
									selection={
										select(EntityType.EthereumNetworkUpgrade, ethereumNetworkUpgradeSelector, {
											sources: [
												Source.Constants_Internal,
											],
										})
									}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
											caip2: `${String(({ ...ethereumNetworkUpgradeSelector, ...ethereumNetworkUpgrade }).$network.caip2.namespace)}:${String(({ ...ethereumNetworkUpgradeSelector, ...ethereumNetworkUpgrade }).$network.caip2.reference)}`,
											upgradeSlug: String(({ ...ethereumNetworkUpgradeSelector, ...ethereumNetworkUpgrade }).slug),
										})
									}
									prefetched={{ ...ethereumNetworkUpgradeSelector, ...ethereumNetworkUpgrade }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">-</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.EvmBlock>('$$blocks', {
								sources: [
									Source.Voltaire_JsonRpc,
								],
								limit: 1,
								count: true,
								orderBy: [
									[({ fieldRow }) => fieldRow.entitySelector.blockNumber ?? fieldRow.blockNumber, 'desc'],
								],
							}).first()
						}
						placeholderText='Loading latest block...'
					>
						{#snippet Pending()}
							<span data-text="muted">-</span>
						{/snippet}

						{#snippet children(evmBlock)}
							{#if evmBlock != null}
								{@const evmBlockSelector = evmBlock.entitySelector}
								<EvmBlockView
									selection={
										select(EntityType.EvmBlock, evmBlockSelector, {
											sources: [
												Source.Voltaire_JsonRpc,
											],
										})
									}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
											caip2: `${String(({ ...evmBlockSelector, ...evmBlock }).$network.caip2.namespace)}:${String(({ ...evmBlockSelector, ...evmBlock }).$network.caip2.reference)}`,
											blockNumber: String(({ ...evmBlockSelector, ...evmBlock }).blockNumber),
										})
									}
									prefetched={{ ...evmBlockSelector, ...evmBlock }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">-</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.BeaconEpoch>('$$beaconEpochs', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow.entitySelector.epoch ?? fieldRow.epoch, 'desc'],
								],
							}).first()
						}
						placeholderText='Loading latest epoch...'
					>
						{#snippet Pending()}
							<span data-text="muted">-</span>
						{/snippet}

						{#snippet children(beaconEpoch)}
							{#if beaconEpoch != null}
								{@const beaconEpochSelector = beaconEpoch.entitySelector}
								<BeaconEpochView
									selection={
										select(EntityType.BeaconEpoch, beaconEpochSelector, {
											sources: [
												Source.Beacon_Rest,
											],
										})
									}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
											caip2: `${String(({ ...beaconEpochSelector, ...beaconEpoch }).$network.caip2.namespace)}:${String(({ ...beaconEpochSelector, ...beaconEpoch }).$network.caip2.reference)}`,
											epoch: String(({ ...beaconEpochSelector, ...beaconEpoch }).epoch),
										})
									}
									prefetched={{ ...beaconEpochSelector, ...beaconEpoch }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">-</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.BeaconSlot>('$$beaconSlots', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow.entitySelector.slot ?? fieldRow.slot, 'desc'],
								],
							}).first()
						}
						placeholderText='Loading latest slot...'
					>
						{#snippet Pending()}
							<span data-text="muted">-</span>
						{/snippet}

						{#snippet children(beaconSlot)}
							{#if beaconSlot != null}
								{@const beaconSlotSelector = beaconSlot.entitySelector}
								<BeaconSlotView
									selection={
										select(EntityType.BeaconSlot, beaconSlotSelector, {
											sources: [
												Source.Beacon_Rest,
											],
										})
									}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]', {
											caip2: `${String(({ ...beaconSlotSelector, ...beaconSlot }).$network.caip2.namespace)}:${String(({ ...beaconSlotSelector, ...beaconSlot }).$network.caip2.reference)}`,
											slot: String(({ ...beaconSlotSelector, ...beaconSlot }).slot),
										})
									}
									prefetched={{ ...beaconSlotSelector, ...beaconSlot }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">-</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={evmNetwork}>
				{#snippet Pending()}
					{@const environment = prefetched.environment ?? selection.entitySelector.environment}
					{#if environment !== undefined && environment !== null}
						<div>
							<dt>Environment</dt>
							<dd>
								{String((networkEnvironmentByEnvironment[String(environment)]?.label ?? (String((environment) ?? ''))) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const environment = entity.environment ?? selection.entitySelector.environment ?? prefetched.environment}
					{#if environment !== undefined && environment !== null}
						<div>
							<dt>Environment</dt>
							<dd>
								{String((networkEnvironmentByEnvironment[String(environment)]?.label ?? (String((environment) ?? ''))) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$nativeCoinInstance')}
				>
					{#snippet children(evmCoinInstance)}
						{#if evmCoinInstance != null}
							<div>
								<dt>Native currency</dt>
								<dd>
									<EvmCoinInstanceView
										selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
										prefetched={evmCoinInstance}
										href={
											resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
												chainId: String(evmCoinInstance.entitySelector.$network.caip2.reference),
												coinInstanceSlug: String(
													(
														evmCoinInstance.entitySelector.type === 'NativeCurrency' ?
															'native'
														:
															evmCoinInstance.entitySelector.$contract.address
													)
												),
											})
										}
										layout={EntityLayout.Title}
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
					resource={selection[EntityProxyField]<EntityType.Network, false>('$parent')}
				>
					{#snippet children(network)}
						{#if network != null}
							<div>
								<dt>Parent</dt>
								<dd>
									<NetworkView
										selection={select(EntityType.Network, network.entitySelector)}
										prefetched={network}
										href={
											(network.entitySelector?.caip2 != null && network.entitySelector?.caip2?.namespace != null && network.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
												caip2: `${String(network.entitySelector.caip2.namespace)}:${String(network.entitySelector.caip2.reference)}`,
											}) : network.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
												networkSlug: String(network.entitySelector.slug),
											}) : undefined)
										}
										layout={EntityLayout.Title}
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
					resource={selection[EntityProxyField]<EntityType.Network, false>('$mainnet')}
				>
					{#snippet children(network)}
						{#if network != null}
							<div>
								<dt>Mainnet</dt>
								<dd>
									<NetworkView
										selection={select(EntityType.Network, network.entitySelector)}
										prefetched={network}
										href={
											(network.entitySelector?.caip2 != null && network.entitySelector?.caip2?.namespace != null && network.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
												caip2: `${String(network.entitySelector.caip2.namespace)}:${String(network.entitySelector.caip2.reference)}`,
											}) : network.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
												networkSlug: String(network.entitySelector.slug),
											}) : undefined)
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmNetwork}>
					{#snippet Pending()}
						{@const consensusProtocol = prefetched.consensusProtocol ?? selection.entitySelector.consensusProtocol}
						{#if consensusProtocol !== undefined && consensusProtocol !== null}
							<div>
								<dt>Consensus</dt>
								<dd>
									{String((consensusProtocolByProtocol[String(consensusProtocol)]?.label ?? (String((consensusProtocol) ?? ''))) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const consensusProtocol = entity.consensusProtocol ?? selection.entitySelector.consensusProtocol ?? prefetched.consensusProtocol}
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
				<ResourceBoundary resource={evmNetwork}>
					{#snippet Pending()}
						{@const registryStatus = prefetched.registryStatus ?? selection.entitySelector.registryStatus}
						{#if registryStatus !== undefined && registryStatus !== null}
							<div>
								<dt>Registry status</dt>
								<dd>
									{String((registryStatus) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const registryStatus = entity.registryStatus ?? selection.entitySelector.registryStatus ?? prefetched.registryStatus}
						{#if registryStatus !== undefined && registryStatus !== null}
							<div>
								<dt>Registry status</dt>
								<dd>
									{String((registryStatus) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmNetwork}>
					{#snippet Pending()}
						{@const peeringId = prefetched.peeringId ?? selection.entitySelector.peeringId}
						{#if peeringId !== undefined && peeringId !== null}
							<div>
								<dt>Peering ID</dt>
								<dd>
									<NumberValue value={Number(peeringId)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const peeringId = entity.peeringId ?? selection.entitySelector.peeringId ?? prefetched.peeringId}
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
				<ResourceBoundary resource={evmNetwork}>
					{#snippet Pending()}
						{@const slip44 = prefetched.slip44 ?? selection.entitySelector.slip44}
						{#if slip44 !== undefined && slip44 !== null}
							<div>
								<dt>SLIP-44</dt>
								<dd>
									<NumberValue value={Number(slip44)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const slip44 = entity.slip44 ?? selection.entitySelector.slip44 ?? prefetched.slip44}
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-execution'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'execution-upgrades',
							label: 'Upgrades',
						},
						{
							id: 'execution-blocks',
							label: 'Blocks',
						},
						{
							id: 'execution-transactions',
							label: 'Transactions',
						},
						{
							id: 'execution-mempool',
							label: 'Mempool',
						},
						{
							id: 'execution-gas-blocks',
							label: 'Fee market',
						},
						{
							id: 'execution-gas-estimates',
							label: 'Gas estimates',
						},
						{
							id: 'execution-endpoints',
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

				{#snippet SectionExecutionUpgrades({ id, label, open })}
					<EthereumExecutionUpgradesView
						selection={
							selection[EntityProxyField]<EntityType.EthereumExecutionUpgrade>('$$executionUpgrades', {
								sources: [
									Source.Constants_Internal,
								],
								limit: 512,
							})
						}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/upgrades', {
								caip2: `${String(selection.entitySelector.caip2.namespace)}:${String(selection.entitySelector.caip2.reference)}`,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionExecutionBlocks({ id, label, open })}
					<EvmBlocksView
						selection={
							selection[EntityProxyField]<EntityType.EvmBlock>('$$blocks', {
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

				{#snippet SectionExecutionTransactions({ id, label, open })}
					<EvmTransactionsView
						selection={
							selection[EntityProxyField]<EntityType.EvmTransaction>('$$transactions', {
								sources: [
									Source.Blockscout_Rest,
									Source.Voltaire_JsonRpc,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionExecutionMempool({ id, label, open })}
					<EvmNetwork_Txpool_TimestampsView
						selection={
							selection[EntityProxyField]<EntityType.EvmNetwork_Txpool_Timestamp>('$$txpoolTimestamps', {
								sources: [
									Source.Voltaire_JsonRpc,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionExecutionGasBlocks({ id, label, open })}
					<EvmNetwork_GasFee_BlocksView
						selection={
							selection[EntityProxyField]<EntityType.EvmNetwork_GasFee_Block>('$$gasFeeBlocks', {
								sources: [
									Source.Voltaire_JsonRpc,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionExecutionGasEstimates({ id, label, open })}
					<EvmNetwork_GasEstimate_TimestampsView
						selection={
							selection[EntityProxyField]<EntityType.EvmNetwork_GasEstimate_Timestamp>('$$gasEstimateTimestamps', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionExecutionEndpoints({ id, label, open })}
					<UrlsView
						selection={
							selection[EntityProxyField]<EntityType.Url>('$$rpcUrls', {
								sources: [
									Source.Constants_Internal,
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
									Source.Lifi_Rest,
								],
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-consensus-block-production'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'consensus-upgrades',
							label: 'Upgrades',
						},
						{
							id: 'consensus-finality',
							label: 'Finality',
						},
						{
							id: 'consensus-committees',
							label: 'Committees',
						},
						{
							id: 'consensus-sync-committees',
							label: 'Sync committees',
						},
						{
							id: 'consensus-attestations',
							label: 'Attestations',
						},
						{
							id: 'consensus-withdrawals',
							label: 'Withdrawals',
						},
						{
							id: 'consensus-slashings',
							label: 'Slashings',
						},
						{
							id: 'consensus-validators',
							label: 'Validators',
						},
						{
							id: 'consensus-epochs',
							label: 'Epochs',
						},
						{
							id: 'consensus-slots',
							label: 'Slots',
						},
						{
							id: 'consensus-mev-relays',
							label: 'Relays',
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

				{#snippet SectionConsensusUpgrades({ id, label, open })}
					<EthereumConsensusUpgradesView
						selection={
							selection[EntityProxyField]<EntityType.EthereumConsensusUpgrade>('$$consensusUpgrades', {
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
				{/snippet}

				{#snippet SectionConsensusFinality({ id, label, open })}
					<EthereumBeaconFinality_TimestampsView
						selection={
							selection[EntityProxyField]<EntityType.EthereumBeaconFinality_Timestamp>('$$beaconFinalityTimestamps', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusCommittees({ id, label, open })}
					<BeaconCommitteesView
						selection={
							selection[EntityProxyField]<EntityType.BeaconCommittee>('$$beaconCommittees', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusSyncCommittees({ id, label, open })}
					<BeaconSyncCommitteesView
						selection={
							selection[EntityProxyField]<EntityType.BeaconSyncCommittee>('$$beaconSyncCommittees', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusAttestations({ id, label, open })}
					<BeaconAttestationsView
						selection={
							selection[EntityProxyField]<EntityType.BeaconAttestation>('$$beaconAttestations', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusWithdrawals({ id, label, open })}
					<BeaconWithdrawalsView
						selection={
							selection[EntityProxyField]<EntityType.BeaconWithdrawal>('$$beaconWithdrawals', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusSlashings({ id, label, open })}
					<BeaconSlashingsView
						selection={
							selection[EntityProxyField]<EntityType.BeaconSlashing>('$$beaconSlashings', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusValidators({ id, label, open })}
					<BeaconValidatorsView
						selection={
							selection[EntityProxyField]<EntityType.BeaconValidator>('$$beaconValidators', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusEpochs({ id, label, open })}
					<BeaconEpochsView
						selection={
							selection[EntityProxyField]<EntityType.BeaconEpoch>('$$beaconEpochs', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusSlots({ id, label, open })}
					<BeaconSlotsView
						selection={
							selection[EntityProxyField]<EntityType.BeaconSlot>('$$beaconSlots', {
								sources: [
									Source.Beacon_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionConsensusMevRelays({ id, label, open })}
					<MevRelaysView
						selection={
							selection[EntityProxyField]<EntityType.MevRelay>('$$mevRelays', {
								sources: [
									Source.Constants_Internal,
								],
								limit: 64,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-data-availability'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'data-availability-blobs',
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

				{#snippet SectionDataAvailabilityBlobs({ id, label, open })}
					<EvmBlobsView
						selection={
							selection[EntityProxyField]<EntityType.EvmBlob>('$$blobs', {
								sources: [
									Source.Voltaire_JsonRpc,
									Source.Blobscan_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-contracts-accounts'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'contracts-precompiles',
							label: 'Precompiles',
						},
						{
							id: 'contracts-verified',
							label: 'Verified contracts',
						},
						{
							id: 'contracts-smart-accounts',
							label: 'Smart accounts',
						},
						{
							id: 'contracts-bundlers',
							label: 'Bundlers',
						},
						{
							id: 'contracts-paymasters',
							label: 'Paymasters',
						},
						{
							id: 'contracts-user-operations',
							label: 'User operations',
						},
						{
							id: 'contracts-factories',
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

				{#snippet SectionContractsPrecompiles({ id, label, open })}
					<EvmPrecompilesView
						selection={
							selection[EntityProxyField]<EntityType.EvmContract>('$$precompiles', {
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
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/precompiles', {
								caip2: `${String(selection.entitySelector.caip2.namespace)}:${String(selection.entitySelector.caip2.reference)}`,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionContractsVerified({ id, label, open })}
					<EvmContractsView
						selection={
							selection[EntityProxyField]<EntityType.EvmContract>('$$contracts', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts', {
								caip2: `${String(selection.entitySelector.caip2.namespace)}:${String(selection.entitySelector.caip2.reference)}`,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionContractsSmartAccounts({ id, label, open })}
					<Erc4337SmartAccountsView
						selection={
							selection[EntityProxyField]<EntityType.Erc4337SmartAccount>('$$erc4337SmartAccounts', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionContractsBundlers({ id, label, open })}
					<Erc4337BundlersView
						selection={
							selection[EntityProxyField]<EntityType.Erc4337Bundler>('$$erc4337Bundlers', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionContractsPaymasters({ id, label, open })}
					<Erc4337PaymastersView
						selection={
							selection[EntityProxyField]<EntityType.Erc4337Paymaster>('$$erc4337Paymasters', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionContractsUserOperations({ id, label, open })}
					<EvmUserOperationsView
						selection={
							selection[EntityProxyField]<EntityType.EvmUserOperation>('$$userOperations', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionContractsFactories({ id, label, open })}
					<Erc4337AccountFactoriesView
						selection={
							selection[EntityProxyField]<EntityType.Erc4337AccountFactory>('$$erc4337AccountFactories', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-assets'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'assets-native-coin',
							label: 'Native coin',
						},
						{
							id: 'assets-native-instance',
							label: 'Native coin instance',
						},
						{
							id: 'assets-native-assets',
							label: 'Native assets',
						},
						{
							id: 'assets-bridges',
							label: 'Bridges',
						},
						{
							id: 'assets-erc20-transfers',
							label: 'ERC-20 transfers',
						},
						{
							id: 'assets-nft-transfers',
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

				{#snippet SectionAssetsNativeCoin({ id, label, open })}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.Coin, false>('$nativeCoin')}
					>
						{#snippet children(coin)}
							<EntitiesList
								entityType={EntityType.Coin}
								id={`${id}-list`}
								title={label}
								collapsible={false}
								items={coin == null ? [] : [coin]}
								getKey={(coin) => coin[EntityMetaKey.SelectorKey]}
							>
								{#snippet Item({ item: coin })}
									<CoinView
										selection={select(EntityType.Coin, coin.entitySelector)}
										prefetched={coin}
										href={
											resolve('/(assets)/coin/[coinId]', {
												coinId: String(coin.entitySelector.coinId),
											})
										}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionAssetsNativeInstance({ id, label, open })}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$nativeCoinInstance')}
					>
						{#snippet children(evmCoinInstance)}
							<EntitiesList
								entityType={EntityType.EvmCoinInstance}
								id={`${id}-list`}
								title={label}
								collapsible={false}
								items={evmCoinInstance == null ? [] : [evmCoinInstance]}
								getKey={(evmCoinInstance) => evmCoinInstance[EntityMetaKey.SelectorKey]}
							>
								{#snippet Item({ item: evmCoinInstance })}
									<EvmCoinInstanceView
										selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
										prefetched={evmCoinInstance}
										href={
											resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
												chainId: String(evmCoinInstance.entitySelector.$network.caip2.reference),
												coinInstanceSlug: String(
													(
														evmCoinInstance.entitySelector.type === 'NativeCurrency' ?
															'native'
														:
															evmCoinInstance.entitySelector.$contract.address
													)
												),
											})
										}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionAssetsNativeAssets({ id, label, open })}
					<AssetInstancesView
						selection={selection[EntityProxyField]<EntityType.AssetInstance>('$$nativeAssets')}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/native-assets', {
								caip2: `${String(selection.entitySelector.caip2.namespace)}:${String(selection.entitySelector.caip2.reference)}`,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAssetsBridges({ id, label, open })}
					<EvmNetworkBridgesView
						selection={
							selection[EntityProxyField]<EntityType.EvmNetworkBridge>('$$bridges', {
								sources: [
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
									Source.Lifi_Rest,
								],
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAssetsErc20Transfers({ id, label, open })}
					<EvmTokenTransfersView
						selection={
							selection[EntityProxyField]<EntityType.EvmTokenTransfer>('$$erc20TokenTransfers', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAssetsNftTransfers({ id, label, open })}
					<EvmTokenTransfersView
						selection={
							selection[EntityProxyField]<EntityType.EvmTokenTransfer>('$$nftTokenTransfers', {
								sources: [
									Source.Blockscout_Rest,
								],
								limit: 16,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-resources'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'resources-faucets',
							label: 'Faucets',
						},
						{
							id: 'resources-block-explorers',
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

				{#snippet SectionResourcesFaucets({ id, label, open })}
					<UrlsView
						selection={
							selection[EntityProxyField]<EntityType.Url>('$$faucetUrls', {
								sources: [
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
								],
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionResourcesBlockExplorers({ id, label, open })}
					<UrlsView
						selection={
							selection[EntityProxyField]<EntityType.Url>('$$blockExplorerUrls', {
								sources: [
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
									Source.Lifi_Rest,
								],
							})
						}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-topology'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'topology-upgrades',
							label: 'Upgrades',
						},
						{
							id: 'topology-parent-layer',
							label: 'Parent',
						},
						{
							id: 'topology-rollup',
							label: 'Rollup',
						},
						{
							id: 'topology-sibling-shards',
							label: 'Shards',
						},
						{
							id: 'topology-testnets',
							label: 'Testnets',
						},
						{
							id: 'topology-mainnet',
							label: 'Mainnet',
						},
						{
							id: 'topology-child-layers',
							label: 'Layers',
						},
						{
							id: 'topology-settled-rollups',
							label: 'Settled rollups',
						},
					]
				}
				data-card
				class='network-view-collapsible-topology'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Topology</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTopologyUpgrades({ id, label, open })}
					<EthereumNetworkUpgradesView
						selection={
							selection[EntityProxyField]<EntityType.EthereumNetworkUpgrade>('$$upgrades', {
								sources: [
									Source.Constants_Internal,
								],
								limit: 512,
							})
						}
						href={resolve('/upgrades')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTopologyParentLayer({ id, label, open })}
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.Network, false>('$parent', {
								sources: [
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
									Source.L2Beat_Rest,
								],
							})
						}
					>
						{#snippet children(network)}
							<EntitiesList
								entityType={EntityType.Network}
								id={`${id}-list`}
								title={label}
								collapsible={false}
								items={network == null ? [] : [network]}
								getKey={(network) => network[EntityMetaKey.SelectorKey]}
							>
								{#snippet Item({ item: network })}
									<NetworkView
										selection={select(EntityType.Network, network.entitySelector)}
										prefetched={network}
										href={
											(network.entitySelector?.caip2 != null && network.entitySelector?.caip2?.namespace != null && network.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
												caip2: `${String(network.entitySelector.caip2.namespace)}:${String(network.entitySelector.caip2.reference)}`,
											}) : network.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
												networkSlug: String(network.entitySelector.slug),
											}) : undefined)
										}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionTopologyRollup({ id, label, open })}
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.EvmRollup, false>('$rollup', {
								sources: [
									Source.L2Beat_Rest,
								],
							})
						}
					>
						{#snippet children(evmRollup)}
							<EntitiesList
								entityType={EntityType.EvmRollup}
								id={`${id}-list`}
								title={label}
								collapsible={false}
								items={evmRollup == null ? [] : [evmRollup]}
								getKey={(evmRollup) => evmRollup[EntityMetaKey.SelectorKey]}
							>
								{#snippet Item({ item: evmRollup })}
									<EvmRollupView
										selection={select(EntityType.EvmRollup, evmRollup.entitySelector)}
										prefetched={evmRollup}
										href={
											resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
												caip2: `${String(evmRollup.entitySelector.$network.caip2.namespace)}:${String(evmRollup.entitySelector.$network.caip2.reference)}`,
												projectId: String(evmRollup.entitySelector.projectId),
											})
										}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionTopologySiblingShards({ id, label, open })}
					<EvmNetworksView
						selection={
							selection[EntityProxyField]<EntityType.EvmNetwork>('$$siblingShardNetworks', {
								sources: [
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
								],
								limit: 16,
							})
						}
						href={resolve('/(explore)/evm-networks')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTopologyTestnets({ id, label, open })}
					<NetworksView
						selection={
							selection[EntityProxyField]<EntityType.Network>('$$testnets', {
								sources: [
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
								],
								limit: 16,
							})
						}
						href={resolve('/(explore)/networks')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTopologyMainnet({ id, label, open })}
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.Network, false>('$mainnet', {
								sources: [
									Source.Chainlist_Rest,
									Source.EthereumLists_Rest,
								],
							})
						}
					>
						{#snippet children(network)}
							<EntitiesList
								entityType={EntityType.Network}
								id={`${id}-list`}
								title={label}
								collapsible={false}
								items={network == null ? [] : [network]}
								getKey={(network) => network[EntityMetaKey.SelectorKey]}
							>
								{#snippet Item({ item: network })}
									<NetworkView
										selection={select(EntityType.Network, network.entitySelector)}
										prefetched={network}
										href={
											(network.entitySelector?.caip2 != null && network.entitySelector?.caip2?.namespace != null && network.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
												caip2: `${String(network.entitySelector.caip2.namespace)}:${String(network.entitySelector.caip2.reference)}`,
											}) : network.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
												networkSlug: String(network.entitySelector.slug),
											}) : undefined)
										}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionTopologyChildLayers({ id, label, open })}
					<NetworksView
						selection={
							selection[EntityProxyField]<EntityType.Network>('$$childLayers', {
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
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTopologySettledRollups({ id, label, open })}
					<EvmRollupsView
						selection={
							selection[EntityProxyField]<EntityType.EvmRollup>('$$settledRollups', {
								sources: [
									Source.L2Beat_Rest,
								],
								limit: 16,
							})
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
</EntityView>
