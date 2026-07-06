<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			$icon: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? '')].filter(Boolean).join(' ') || [prefetched.caip2 == null ? '' : String((`${(prefetched.caip2).namespace}:${(prefetched.caip2).reference}`) ?? '')].filter(Boolean).join(' ') || 'EVM network')
	const viewDomId = $derived('evm-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
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
	import MevBuildersView from '$/views/MevBuildersView.svelte'
	import MevRelay_ProposerPayloadDeliveredRowsView from '$/views/MevRelay_ProposerPayloadDeliveredRowsView.svelte'
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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.caip2 !== undefined && pendingEntity.caip2.namespace !== undefined && pendingEntity.caip2 !== undefined && pendingEntity.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
			caip2: `${String(pendingEntity.caip2.namespace ?? '')}:${String(pendingEntity.caip2.reference ?? '')}`,
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
				{@const caip2 = selection.entitySelector.caip2 ?? prefetched.caip2}
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
				{:else if (selection.entitySelector.caip2 ?? prefetched.caip2) != null}
					{@const caip2 = selection.entitySelector.caip2 ?? prefetched.caip2}
					<span>
						Chain {String(caip2.reference ?? '')}
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
				{@const caip2 = selection.entitySelector.caip2 ?? prefetched.caip2}
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
									[({ fieldRow }) => fieldRow.valueIndex ?? Number.NEGATIVE_INFINITY, 'desc'],
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.consensusProtocol === 'EthereumBeacon'}
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
							consensusProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.consensusProtocol === 'EthereumBeacon'}
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
						<div>
							<dt>Environment</dt>
							<dd>
								{String((networkEnvironmentByEnvironment[String(environment)]?.label ?? (String((environment) ?? ''))) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const environment = resolvedEntity.environment}
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

			<div>
				<dt>CAIP-2</dt>
				<dd>
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
								<TruncatedValue value={caip2 == null ? '' : String((`${(caip2).namespace}:${(caip2).reference}`) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const caip2 = resolvedEntity.caip2}
							{#if caip2 !== undefined && caip2 !== null}
								<TruncatedValue value={caip2 == null ? '' : String((`${(caip2).namespace}:${(caip2).reference}`) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$nativeCoinInstance', {
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
											(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
												chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
												coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
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
					resource={selection[EntityProxyField]<EntityType.Network, false>('$parent')}
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
											(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$mainnet')}
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
											(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
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

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const consensusProtocol = resolvedEntity.consensusProtocol}
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
						selection({
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

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const registryStatus = resolvedEntity.registryStatus}
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
						selection({
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

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const peeringId = resolvedEntity.peeringId}
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
						selection({
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

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const slip44 = resolvedEntity.slip44}
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
								caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
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
				{/snippet}

				{#snippet SectionExecutionTransactions({ id, label, open })}
					<EvmTransactionsView
						selection={
							selection[EntityProxyField]<EntityType.EvmTransaction>('$$transactions', {
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
				{/snippet}

				{#snippet SectionExecutionGasEstimates({ id, label, open })}
					<EvmNetwork_GasEstimate_TimestampsView
						selection={
							selection[EntityProxyField]<EntityType.EvmNetwork_GasEstimate_Timestamp>('$$gasEstimateTimestamps', {
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
				{/snippet}

			</CollapsibleTabs>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{#if resolvedEntity.consensusProtocol === 'EthereumBeacon'}
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
									{
										id: 'consensus-mev-builders',
										label: 'Builders',
									},
									{
										id: 'consensus-mev-boost',
										label: 'MEV-Boost',
									},
									{
										id: 'consensus-endpoints',
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
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/upgrades', {
											caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
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
							{/snippet}

							{#snippet SectionConsensusMevBuilders({ id, label, open })}
								<MevBuildersView
									selection={
										selection[EntityProxyField]<EntityType.MevBuilder>('$$mevBuilders', {
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
							{/snippet}

							{#snippet SectionConsensusMevBoost({ id, label, open })}
								<MevRelay_ProposerPayloadDeliveredRowsView
									selection={
										selection[EntityProxyField]<EntityType.MevRelay_ProposerPayloadDelivered>('$$mevProposerPayloadDelivered', {
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
							{/snippet}

							{#snippet SectionConsensusEndpoints({ id, label, open })}
								<ResourceBoundary
									resource={
										selection({
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
							{/snippet}

						</CollapsibleTabs>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							description: 'Catalog precompiles active at the chain head according to the execution upgrade schedule.',
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
								caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
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
								caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
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
						resource={
							selection[EntityProxyField]<EntityType.Coin, false>('$nativeCoin', {
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
									selection={select(EntityType.Coin, coin[EntityMetaKey.Selector])}
									prefetched={coin}
									href={
										(coin[EntityMetaKey.Selector].coinId !== undefined ? resolve('/(assets)/coin/[coinId]', {
											coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionAssetsNativeInstance({ id, label, open })}
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$nativeCoinInstance', {
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
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionAssetsNativeAssets({ id, label, open })}
					<AssetInstancesView
						selection={
							selection[EntityProxyField]<EntityType.AssetInstance>('$$nativeAssets', {
								sources: [
									Source.Constants_Internal,
								],
							})
						}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/native-assets', {
								caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
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
						href={
							(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/faucets', {
								caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
							}) : undefined)
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No faucet URLs listed for this network yet.'
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
						href={
							(selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.namespace !== undefined && selection.entitySelector.caip2 !== undefined && selection.entitySelector.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/block-explorers', {
								caip2: `${String(selection.entitySelector.caip2.namespace ?? '')}:${String(selection.entitySelector.caip2.reference ?? '')}`,
							}) : undefined)
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No block explorer URLs listed for this network yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-relationshipModel'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'relationshipModel-upgrades',
							label: 'Upgrades',
						},
						{
							id: 'relationshipModel-parent-layer',
							label: 'Parent',
						},
						{
							id: 'relationshipModel-rollup',
							label: 'Rollup',
						},
						{
							id: 'relationshipModel-sibling-shards',
							label: 'Shards',
						},
						{
							id: 'relationshipModel-testnets',
							label: 'Testnets',
						},
						{
							id: 'relationshipModel-mainnet',
							label: 'Mainnet',
						},
						{
							id: 'relationshipModel-child-layers',
							label: 'Layers',
						},
						{
							id: 'relationshipModel-settled-rollups',
							label: 'Settled rollups',
						},
					]
				}
				data-card
				class='network-view-collapsible-relationshipModel'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Relationship model</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRelationshipModelUpgrades({ id, label, open })}
					<EthereumNetworkUpgradesView
						selection={
							selection[EntityProxyField]<EntityType.EthereumNetworkUpgrade>('$$upgrades', {
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
				{/snippet}

				{#snippet SectionRelationshipModelParentLayer({ id, label, open })}
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
							{#if network == null || network[EntityMetaKey.Selector] == null}
								<p data-text="muted">Parent network is not listed for this network.</p>
							{:else}
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
				{/snippet}

				{#snippet SectionRelationshipModelRollup({ id, label, open })}
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
							{#if evmRollup == null || evmRollup[EntityMetaKey.Selector] == null}
								<p data-text="muted">Rollup is not listed for this network.</p>
							{:else}
								<EvmRollupView
									selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector])}
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
				{/snippet}

				{#snippet SectionRelationshipModelSiblingShards({ id, label, open })}
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
						emptyText='No sibling shard networks listed for this network yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRelationshipModelTestnets({ id, label, open })}
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
						emptyText='No testnets listed for this network yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRelationshipModelMainnet({ id, label, open })}
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
							{#if network == null || network[EntityMetaKey.Selector] == null}
								<p data-text="muted">Mainnet is not listed for this network.</p>
							{:else}
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
				{/snippet}

				{#snippet SectionRelationshipModelChildLayers({ id, label, open })}
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
						emptyText='No child layer networks listed for this network yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRelationshipModelSettledRollups({ id, label, open })}
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
						emptyText='No settled rollups listed for this network yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
