<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'
	import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
	import {
		consensusProtocolForExecutionChainId,
		slotsPerEpoch,
	} from '$/constants/BeaconConsensus.ts'
	import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { type Entity, type EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		HeadingTitle,
	}: {
		children?: Snippet
		entityId: EntityId<typeof schema, EntityType.Network>
		href: string
		layout?: EntityLayout
		open?: boolean
		HeadingTitle?: Snippet
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const networkIdKey = $derived(
		stringify(entityId),
	)

	const networkHref = (targetNetworkChainId: number) => (
		resolve(
			'/(explore)/(networks)/network/[networkId]',
			{ networkId: String(targetNetworkChainId) },
		)
	)

	const separateConsensusProtocol = consensusProtocolForExecutionChainId(entityId.chainId)

	const networkSummaryHead = useEntity(
		EntityType.Network,
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

	const headBlockNumber = derive(
		networkSummaryHead,
		(network) => {
			if (network.blockHeight !== undefined) {
				return network.blockHeight
			}
			const blocks = network.$$blocks
			if (!(blocks?.length)) {
				return undefined
			}
			return blocks.reduce(
				(highestBlockNumber, block) => {
					const blockNumber = block[EntityMetaKey.Id].blockNumber
					return (
						highestBlockNumber == null || blockNumber > highestBlockNumber ?
							blockNumber
						:
							highestBlockNumber
					)
				},
				undefined as bigint | undefined,
			)
		},
	)

	const beaconHeadEpoch = derive(
		networkSummaryHead,
		(network) => {
			const epochs: Entity<typeof schema, EntityType.BeaconEpoch>[] | undefined =
				network.$$beaconEpochs
			if (epochs?.length) {
				return epochs
					.toSorted((leftEpoch, rightEpoch) => (
						rightEpoch[EntityMetaKey.Id].epoch - leftEpoch[EntityMetaKey.Id].epoch
					))[0]
					?.[EntityMetaKey.Id].epoch
			}
			const slots: Entity<typeof schema, EntityType.BeaconSlot>[] | undefined =
				network.$$beaconSlots
			if (!(slots?.length)) {
				return undefined
			}
			const headSlot = slots
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
	)

	const beaconHeadSlot = derive(
		networkSummaryHead,
		(network) => {
			const slots: Entity<typeof schema, EntityType.BeaconSlot>[] | undefined =
				network.$$beaconSlots
			if (!(slots?.length)) {
				return undefined
			}
			return slots
				.toSorted((leftSlot, rightSlot) => (
					rightSlot[EntityMetaKey.Id].slot - leftSlot[EntityMetaKey.Id].slot
				))[0]
				?.[EntityMetaKey.Id].slot
		},
	)

	const network = useEntity(
		EntityType.Network,
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
			$parentLayer: {},
			$$siblingShardNetworks: {},
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
			environment: {},
			executionEndpoints: {},
			$$rpcUrls: {},
			$$blockExplorerUrls: {},
			$icon: {},
			nativeCurrencies: {},
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
			...(open && {
				$$gasFeeBlocks: {
					$: [
						Source.Voltaire_JsonRpc,
					],
					$limit: 64,
				},
				$$gasEstimateTimestamps: {
					$: [
						Source.Blockscout_Rest,
						Source.Etherscan_Rest,
						Source.Voltaire_JsonRpc,
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
				beaconPreviousJustifiedCheckpointEpoch: {
					$: [
						Source.Beacon_Rest,
					],
				},
				beaconPreviousJustifiedCheckpointRoot: {
					$: [
						Source.Beacon_Rest,
					],
				},
				beaconCurrentJustifiedCheckpointEpoch: {
					$: [
						Source.Beacon_Rest,
					],
				},
				beaconCurrentJustifiedCheckpointRoot: {
					$: [
						Source.Beacon_Rest,
					],
				},
				beaconFinalizedCheckpointEpoch: {
					$: [
						Source.Beacon_Rest,
					],
				},
				beaconFinalizedCheckpointRoot: {
					$: [
						Source.Beacon_Rest,
					],
				},
				beaconForkScheduleEntriesJson: {
					$: [
						Source.Beacon_Rest,
					],
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
				$$erc4337Bundlers: {
					$: [
						Source.Blockscout_Rest,
					],
					$limit: 16,
				},
				$$erc4337Paymasters: {
					$: [
						Source.Blockscout_Rest,
					],
					$limit: 16,
				},
				$$erc4337AccountFactories: {
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


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import { beaconForkScheduleEntriesFromJsonString } from '$/sources/Beacon/Rest/queries.ts'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import BeaconValidatorsView from '$/views/BeaconValidatorsView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkConsensusUpgradesView from '$/views/NetworkConsensusUpgradesView.svelte'
	import NetworkExecutionUpgradesView from '$/views/NetworkExecutionUpgradesView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import Network_GasEstimate_TimestampsView from '$/views/Network_GasEstimate_TimestampsView.svelte'
	import Network_GasFee_BlocksView from '$/views/Network_GasFee_BlocksView.svelte'
	import Network_Txpool_TimestampsView from '$/views/Network_Txpool_TimestampsView.svelte'
	import Erc4337AccountFactoriesView from '$/views/Erc4337AccountFactoriesView.svelte'
	import Erc4337BundlersView from '$/views/Erc4337BundlersView.svelte'
	import Erc4337PaymastersView from '$/views/Erc4337PaymastersView.svelte'
	import Erc4337SmartAccountsView from '$/views/Erc4337SmartAccountsView.svelte'
	import NetworkBridgesView from '$/views/NetworkBridgesView.svelte'
	import NetworkUpgradesView from '$/views/NetworkUpgradesView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import MevRelay_ProposerPayloadDeliveredRowsView from '$/views/MevRelay_ProposerPayloadDeliveredRowsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	{layout}
	bind:open
	summaryUsesHeading={true}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={network}
			placeholderText=""
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

	{#snippet Heading()}
		{#if HeadingTitle}
			{@render HeadingTitle()}
		{:else}
			<ResourceBoundary
				resource={network}
				placeholderText="Resolving name…"
			>
				{#snippet Pending()}
					{@render Title()}
				{/snippet}

				{#snippet children(network)}
					{#if network.name}
						{network.name}
					{:else}
						{@render Title()}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Title()}
		<span>
			Chain {String(entityId.chainId)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution layer keyed by chain id applies transactions in block order; gas and fees are execution-layer notions.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl
			class="network-summary-head"
			data-column-item="center"
		>
			<div>
				<dt>Block</dt>
				<dd
					data-row="inline wrap"
					id="network-summary-head-block"
				>
					<ResourceBoundary
						resource={headBlockNumber}
						placeholderText="Loading head block…"
					>
						{#snippet children(blockNumber)}
							{#if blockNumber !== undefined}
								<EvmBlockView
									entityId={{
										$network: { chainId: entityId.chainId },
										blockNumber,
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
										{
											networkId: String(entityId.chainId),
											blockNumber: String(blockNumber),
										},
									)}
									layout={EntityLayout.Title}
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

			{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
				<div>
					<dt>Epoch</dt>
					<dd>
						<ResourceBoundary
							resource={beaconHeadEpoch}
							placeholderText="Loading head epoch…"
						>
							{#snippet children(beaconHeadEpochValue)}
								{#if beaconHeadEpochValue !== undefined}
									<BeaconEpochView
										entityId={{
											$network: { chainId: entityId.chainId },
											epoch: beaconHeadEpochValue,
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
											{
												networkId: String(entityId.chainId),
												epochNumber: String(beaconHeadEpochValue),
											},
										)}
										layout={EntityLayout.Title}
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
					<dt>Slot</dt>
					<dd>
						<ResourceBoundary
							resource={beaconHeadSlot}
							placeholderText="Loading head slot…"
						>
							{#snippet children(beaconHeadSlotValue)}
								{#if beaconHeadSlotValue !== undefined}
									<BeaconSlotView
										entityId={{
											$network: { chainId: entityId.chainId },
											slot: beaconHeadSlotValue,
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
											{
												networkId: String(entityId.chainId),
												slotNumber: String(beaconHeadSlotValue),
											},
										)}
										layout={EntityLayout.Title}
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
			{/if}

			{#if contentOpen}
				{#if network.environment !== undefined}
					<div>
						<dt>Environment</dt>
						<dd>
							<ResourceBoundary
								resource={network}
								placeholderText="Loading network…"
							>
								{#snippet children(network)}
									{network.environment}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if contentOpen}
				{#if network.$parentLayer?.[EntityMetaKey.Id].chainId !== undefined}
					<div>
						<dt>Parent</dt>
						<dd>
							<ResourceBoundary
								resource={network}
								placeholderText="Loading network…"
							>
								{#snippet children(network)}
									Chain {String(network.$parentLayer[EntityMetaKey.Id].chainId)}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if contentOpen}
				<div>
					<dt>CAIP-2</dt>
					<dd data-row="inline wrap"><code>eip155:{String(entityId.chainId)}</code></dd>
				</div>
			{/if}

			{#if contentOpen}
				{#if network.registryStatus !== undefined}
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
			{/if}

			{#if contentOpen}
				{#if (
					network.peeringId !== undefined
					&& network.peeringId !== entityId.chainId
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
			{/if}

			{#if contentOpen}
				{#if network.slip44 !== undefined}
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
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: detailsOpen,
	})}
		<EntityDetails
			entityType={EntityType.Network}
			{entityId}
		/>

		<div
			class="network-view-carousel-groups"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-topology`}
				{...{ 'data-card': '' }}
				class="network-view-collapsible-topology"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								<HeadingComponent>Topology</HeadingComponent>
							{/snippet}
						</ResourceBoundary>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<ResourceBoundary resource={network}>
						{#snippet children(network)}
							<a
								data-scroll-marker-label="Upgrades"
								href={`#${networkIdKey}:topology-upgrades`}
							>Upgrades</a>
							{#if network.$parentLayer?.[EntityMetaKey.Id].chainId !== undefined}
								<a
									data-scroll-marker-label="Parent"
									href={`#${networkIdKey}:topology-parent-layer`}
								>Parent</a>
							{/if}

							{#if (network.$$siblingShardNetworks ?? []).length}
								<a
									data-scroll-marker-label="Shards"
									href={`#${networkIdKey}:topology-sibling-shards`}
								>Shards</a>
							{/if}

							{#if network.environment === NetworkEnvironment.Mainnet}
								<a
									data-scroll-marker-label="Testnets"
									href={`#${networkIdKey}:topology-testnets`}
								>Testnets</a>
							{:else if network.environment === NetworkEnvironment.Testnet}
								<a
									data-scroll-marker-label="Mainnet"
									href={`#${networkIdKey}:topology-mainnet`}
								>Mainnet</a>
							{/if}

							{#if (network.$$childLayers ?? []).length}
								<a
									data-scroll-marker-label="Layers"
									href={`#${networkIdKey}:topology-child-layers`}
								>Layers</a>
							{/if}

							{#if (network.$$faucetUrls ?? []).length}
								<a
									data-scroll-marker-label="Faucets"
									href={`#${networkIdKey}:topology-faucets`}
								>Faucets</a>
							{/if}

							{#if (network.$$bridges ?? []).length}
								<a
									data-scroll-marker-label="Bridges"
									href={`#${networkIdKey}:topology-bridges`}
								>Bridges</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body(_childrenContext)}
					<ResourceBoundary
						resource={network}
					>
						{#snippet children(network)}
								<section>
									<NetworkUpgradesView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.Network,
											entityId,
											fieldName: '$$upgrades',
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/upgrades',
											{ networkId: String(entityId.chainId) },
										)}
										id={`${networkIdKey}:topology-upgrades`}
										title="Upgrades"
									/>
								</section>

								{#if network.$parentLayer?.[EntityMetaKey.Id].chainId !== undefined}
									<section>
										<EntitiesList
											collapsible={false}
											entityType={EntityType.Network}
											{href}
											id={`${networkIdKey}:topology-parent-layer`}
											title="Parent"
										>
											{#snippet body()}
												<div class="entity-details">
													<a href={networkHref(network.$parentLayer[EntityMetaKey.Id].chainId)}>
														Chain {String(network.$parentLayer[EntityMetaKey.Id].chainId)}
													</a>
												</div>
											{/snippet}
										</EntitiesList>
									</section>
								{/if}

								{#if (network.$$siblingShardNetworks ?? []).length}
									<section data-scroll-marker-label="Shards">
										<NetworksView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$siblingShardNetworks',
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]',
												{ networkId: String(entityId.chainId) },
											)}
											id={`${networkIdKey}:topology-sibling-shards`}
											title="Shards"
										/>
									</section>
								{/if}

								{#if network.environment === NetworkEnvironment.Mainnet}
									<section>
										<NetworksView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$testnets',
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]',
												{ networkId: String(entityId.chainId) },
											)}
											id={`${networkIdKey}:topology-testnets`}
											title="Testnets"
										/>
									</section>
								{:else if network.environment === NetworkEnvironment.Testnet}
									<section>
										{#if network.$mainnet?.[EntityMetaKey.Id].chainId !== undefined}
											<EntitiesList
												collapsible={false}
												entityType={EntityType.Network}
												{href}
												id={`${networkIdKey}:topology-mainnet`}
												title="Mainnet"
											>
												{#snippet body()}
													<div class="entity-details">
														<a href={networkHref(network.$mainnet[EntityMetaKey.Id].chainId)}>
															Chain {String(network.$mainnet[EntityMetaKey.Id].chainId)}
														</a>
													</div>
												{/snippet}
											</EntitiesList>
										{:else}
											<EntitiesList
												collapsible={false}
												entityType={EntityType.Network}
												{href}
												id={`${networkIdKey}:topology-mainnet`}
												title="Mainnet"
											>
												{#snippet body()}
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
									</section>
								{/if}

								{#if (network.$$childLayers ?? []).length}
									<section>
										<NetworksView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$childLayers',
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]',
												{ networkId: String(entityId.chainId) },
											)}
											id={`${networkIdKey}:topology-child-layers`}
											title="Layers"
										/>
									</section>
								{/if}

								{#if (network.$$faucetUrls ?? []).length}
									<section>
										<UrlsView
											collapsible={false}
											emptyText="No faucets listed for this network yet."
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$faucetUrls',
											}}
											fieldSources={[
												Source.Chainlist_Rest,
												Source.EthereumLists_Rest,
											]}
											id={`${networkIdKey}:topology-faucets`}
											title="Faucets"
										/>
									</section>
								{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-erc-4337`}
					{...{ 'data-card': '' }}
					class="network-view-collapsible-erc-4337"
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Smart accounts</HeadingComponent>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Smart accounts, bundlers, paymasters, and account factories Blockscout indexes for this chain, plus recent user operations.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="ERC-4337 on this network"
								>ⓘ</abbr>
							</Tooltip>
						</header>
					{/snippet}

					{#snippet Markers(_context)}
						<a
							data-scroll-marker-label="Smart accounts"
							href={`#${networkIdKey}:aa-smart-accounts`}
						>Smart accounts</a>
						<a
							data-scroll-marker-label="Bundlers"
							href={`#${networkIdKey}:aa-bundlers`}
						>Bundlers</a>
						<a
							data-scroll-marker-label="Paymasters"
							href={`#${networkIdKey}:aa-paymasters`}
						>Paymasters</a>
						<a
							data-scroll-marker-label="User operations"
							href={`#${networkIdKey}:aa-user-operations`}
						>User operations</a>
						<a
							data-scroll-marker-label="Factories"
							href={`#${networkIdKey}:aa-factories`}
						>Factories</a>
					{/snippet}

					{#snippet body(_childrenContext)}
						<section id={`${networkIdKey}:aa-smart-accounts`}>
							<Erc4337SmartAccountsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$erc4337SmartAccounts',
								}}
								href={href}
								id={`${networkIdKey}:aa-smart-accounts-list`}
								title="Smart accounts"
							/>
						</section>
						<section id={`${networkIdKey}:aa-bundlers`}>
							<Erc4337BundlersView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$erc4337Bundlers',
								}}
								href={href}
								id={`${networkIdKey}:aa-bundlers-list`}
								title="Bundlers"
							/>
						</section>
						<section id={`${networkIdKey}:aa-paymasters`}>
							<Erc4337PaymastersView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$erc4337Paymasters',
								}}
								href={href}
								id={`${networkIdKey}:aa-paymasters-list`}
								title="Paymasters"
							/>
						</section>
						<section id={`${networkIdKey}:aa-user-operations`}>
							<EvmUserOperationsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$userOperations',
								}}
								href={href}
								id={`${networkIdKey}:aa-user-operations-list`}
							/>
						</section>
						<section id={`${networkIdKey}:aa-factories`}>
							<Erc4337AccountFactoriesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$erc4337AccountFactories',
								}}
								href={href}
								id={`${networkIdKey}:aa-factories-list`}
								title="Account factories"
							/>
						</section>
					{/snippet}
				</CollapsibleTabs>

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-economics`}
				{...{ 'data-card': '' }}
				class="network-view-collapsible-economics"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Economics</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Native coin deployment, linked catalog assets, recent per-block fee snapshots from <code>eth_feeHistory</code>, and optional MEV-Boost relay <code>proposer_payload_delivered</code> traces (builder winning bids— unrelated to bridge “relayers”).
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Economics sections"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Assets"
						href={`#${networkIdKey}:economics-assets`}
					>Assets</a>
					<a
						data-scroll-marker-label="Gas estimates"
						href={`#${networkIdKey}:economics-gas-estimates`}
					>Gas estimates</a>
					<a
						data-scroll-marker-label="Gas blocks"
						href={`#${networkIdKey}:economics-gas`}
					>Gas blocks</a>
					<a
						data-scroll-marker-label="MEV-Boost"
						href={`#${networkIdKey}:economics-mev-boost`}
					>MEV-Boost</a>
				{/snippet}

				{#snippet body(_childrenContext)}
					<ResourceBoundary
						resource={network}
					>
						{#snippet children(network)}
							{@const nativeRows = network.nativeCurrencies ?? []}
							{@const catalogCoinIds = (
								[
									...new Set(
										nativeRows.flatMap((row) => (
											row.coinId != null ?
												[row.coinId]
											:
												[]
										)),
									),
								]
							)}
							<section id={`${networkIdKey}:economics-assets`}>
								<div data-column="gap-2">
									<CoinInstanceView
										entityId={{
											$network: entityId,
											type: CoinInstanceType.NativeCurrency,
										}}
										href={resolve(
											'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
											{
												chainId: String(entityId.chainId),
												coinInstanceSlug: 'native',
											},
										)}
										layout={EntityLayout.Summary}
										title="Native coin"
									/>
									{#each catalogCoinIds as coinId (coinId)}
										<CoinView
											entityId={{ coinId }}
											href={resolve(
												'/(assets)/(coins)/coin/[coinId]',
												{ coinId },
											)}
											layout={EntityLayout.Summary}
										/>
									{/each}
									{#if catalogCoinIds.length === 0}
										<div data-row="wrap align-center gap-2">
											<p data-text="muted">
												No catalog coin ids on native rows.
											</p>
											<Tooltip contentProps={{ side: 'top' }}>
												{#snippet Content()}
													<p>Browse contract deployments under Data → Contracts.</p>
												{/snippet}
												<abbr
													class="entity-heading-tip"
													aria-label="Finding token contracts"
												>ⓘ</abbr>
											</Tooltip>
										</div>
									{/if}
									{#if nativeRows.length > 1}
										<div class="entity-details" data-column="gap-3">
											<p data-text="muted">
												Additional registry native currency rows
											</p>
											{#each nativeRows as native}
												<dl data-column-item="center">
													<div>
														<dt>Name</dt>
														<dd>{native.name}</dd>
													</div>
													<div>
														<dt>Symbol</dt>
														<dd>{native.symbol}</dd>
													</div>
													<div>
														<dt>Decimals</dt>
														<dd>{String(native.decimals)}</dd>
													</div>
													{#if native.coinId !== undefined}
														<div>
															<dt>Catalog coin id</dt>
															<dd>{String(native.coinId)}</dd>
														</div>
													{/if}
													{#if native.slip44 !== undefined}
														<div>
															<dt>SLIP-44</dt>
															<dd>{String(native.slip44)}</dd>
														</div>
													{/if}
												</dl>
											{/each}
										</div>
									{/if}
								</div>
							</section>

							<section id={`${networkIdKey}:economics-gas-estimates`}>
								<Network_GasEstimate_TimestampsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$gasEstimateTimestamps',
									}}
									href={href}
									id={`${networkIdKey}:economics-gas-estimates-list`}
									title="Gas estimates"
								/>
							</section>

							<section id={`${networkIdKey}:economics-gas`}>
								<Network_GasFee_BlocksView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$gasFeeBlocks',
									}}
									href={href}
									id={`${networkIdKey}:economics-gas-list`}
									title="Gas blocks"
								/>
							</section>

							<section id={`${networkIdKey}:economics-mev-boost`}>
								<MevRelay_ProposerPayloadDeliveredRowsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$mevProposerPayloadDelivered',
									}}
									href={href}
									id={`${networkIdKey}:economics-mev-boost-deliveries`}
									title="MEV-Boost deliveries"
								/>
							</section>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-execution`}
				{...{ 'data-card': '' }}
				class="network-view-collapsible-execution"
				scrollContainerProps={{
					class: 'network-carousel-execution',
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Execution</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Upgrades"
						href={`#${networkIdKey}:execution-upgrades`}
					>Upgrades</a>
					<a
						data-scroll-marker-label="Blocks"
						href={`#${networkIdKey}:blocks`}
					>Blocks</a>
					<a
						data-scroll-marker-label="Transactions"
						href={`#${networkIdKey}:transactions`}
					>Transactions</a>
					<a
						data-scroll-marker-label="Mempool"
						href={`#${networkIdKey}:txpool`}
					>Mempool</a>
					<ResourceBoundary resource={network}>
						{#snippet children(network)}
							{#if (network.$$rpcUrls ?? []).length}
								<a
									data-scroll-marker-label="Providers"
									href={`#${networkIdKey}:execution-rpcs`}
								>Providers</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
					<ResourceBoundary resource={network}>
						{#snippet children(network)}
							{#if (network.$$blockExplorerUrls ?? []).length}
								<a
									data-scroll-marker-label="Explorers"
									href={`#${networkIdKey}:explorers`}
								>Explorers</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body(_childrenContext)}
						<section>
							<NetworkExecutionUpgradesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$executionUpgrades',
								}}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/upgrades',
									{ networkId: String(entityId.chainId) },
								)}
								id={`${networkIdKey}:execution-upgrades`}
								title="Upgrades"
							/>
						</section>
						<section>
							<EvmBlocksView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$blocks',
								}}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/blocks',
									{ networkId: String(entityId.chainId) },
								)}
								id={`${networkIdKey}:blocks`}
							/>
						</section>
						<section>
							<EvmTransactionsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$transactions',
								}}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/transactions',
									{ networkId: String(entityId.chainId) },
								)}
								id={`${networkIdKey}:transactions`}
							/>
						</section>
						<section>
							<Network_Txpool_TimestampsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$txpoolTimestamps',
								}}
								href={href}
								id={`${networkIdKey}:txpool`}
								title="Mempool"
							/>
						</section>
						<ResourceBoundary resource={network}>
							{#snippet children(network)}
								{#if (network.$$rpcUrls ?? []).length}
									<section>
										<UrlsView
											collapsible={false}
											emptyText="No RPC endpoints listed for this network yet."
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$rpcUrls',
											}}
											fieldSources={[
												Source.Constants_Internal,
												Source.Chainlist_Rest,
												Source.EthereumLists_Rest,
												Source.Lifi_Rest,
											]}
											id={`${networkIdKey}:execution-rpcs`}
											title="Providers"
										/>
									</section>
								{/if}
							{/snippet}
						</ResourceBoundary>
						<ResourceBoundary
							resource={network}
						>
							{#snippet children(network)}
								{#if (network.$$blockExplorerUrls ?? []).length}
									<section>
										<UrlsView
											collapsible={false}
											emptyText="No block explorers listed for this network yet."
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$blockExplorerUrls',
											}}
											fieldSources={[
												Source.Chainlist_Rest,
												Source.EthereumLists_Rest,
												Source.Lifi_Rest,
											]}
											id={`${networkIdKey}:explorers`}
											title="Explorers"
										/>
									</section>
								{/if}
							{/snippet}
						</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			{#if separateConsensusProtocol === ConsensusProtocol.EthereumBeacon}
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-consensus`}
					{...{ 'data-card': '' }}
					class="network-view-collapsible-consensus"
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Consensus</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
						<a
							data-scroll-marker-label="Activations"
							href={`#${networkIdKey}:consensus-upgrades`}
						>Activations</a>
						<a
							data-scroll-marker-label="Fork schedule"
							href={`#${networkIdKey}:beacon-fork-schedule`}
						>Fork schedule</a>
						<a
							data-scroll-marker-label="Finality"
							href={`#${networkIdKey}:beacon-finality`}
						>Finality</a>
						<a
							data-scroll-marker-label="Validators"
							href={`#${networkIdKey}:beacon-validators`}
						>Validators</a>
						<a
							data-scroll-marker-label="Epochs"
							href={`#${networkIdKey}:beacon-epochs`}
						>Epochs</a>
						<a
							data-scroll-marker-label="Slots"
							href={`#${networkIdKey}:beacon-slots`}
						>Slots</a>
					{/snippet}

					{#snippet body(_childrenContext)}
							<section>
								<NetworkConsensusUpgradesView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$consensusUpgrades',
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/upgrades',
										{ networkId: String(entityId.chainId) },
									)}
									id={`${networkIdKey}:consensus-upgrades`}
									title="Activations"
								/>
							</section>
							<section id={`${networkIdKey}:beacon-fork-schedule`}>
								<header data-row-item="flexible">
									<HeadingComponent>Fork schedule</HeadingComponent>
								</header>
								<div class="entity-details">
									<ResourceBoundary
										resource={network}
										placeholderText="Loading fork schedule…"
									>
										{#snippet children(network)}
											{#if network.beaconForkScheduleEntriesJson !== undefined}
												{@const forkScheduleEntries = beaconForkScheduleEntriesFromJsonString(
													network.beaconForkScheduleEntriesJson,
												)}
												{#if forkScheduleEntries.length}
													<table class="network-beacon-fork-schedule">
														<thead>
															<tr>
																<th scope="col">Epoch</th>
																<th scope="col">Previous</th>
																<th scope="col">Current</th>
															</tr>
														</thead>
														<tbody>
															{#each forkScheduleEntries as entry (entry.epoch)}
																<tr>
																	<td>
																		<NumberValue value={entry.epoch} />
																	</td>
																	<td>
																		<TruncatedValue
																			format={TruncatedValueFormat.Abbr}
																			value={entry.previousVersion}
																		/>
																	</td>
																	<td>
																		<TruncatedValue
																			format={TruncatedValueFormat.Abbr}
																			value={entry.currentVersion}
																		/>
																	</td>
																</tr>
															{/each}
														</tbody>
													</table>
												{:else}
													<p data-text="muted">No fork schedule rows.</p>
												{/if}
											{:else}
												<p data-text="muted">No fork schedule yet.</p>
											{/if}
										{/snippet}
									</ResourceBoundary>
								</div>
							</section>
							<section id={`${networkIdKey}:beacon-finality`}>
								<header data-row-item="flexible">
									<HeadingComponent>Finality</HeadingComponent>
								</header>
								<div class="entity-details">
									<ResourceBoundary
										resource={network}
										placeholderText="Loading finality…"
									>
										{#snippet children(network)}
											{#if (
												network.beaconFinalizedCheckpointEpoch !== undefined
												&& network.beaconFinalizedCheckpointRoot !== undefined
											)}
												<dl>
													{#if (
														network.beaconCurrentJustifiedCheckpointEpoch !== undefined
														&& network.beaconCurrentJustifiedCheckpointRoot !== undefined
													)}
														<div>
															<dt>Justified</dt>
															<dd data-row="wrap align-start gap-2">
																<span>Epoch <NumberValue value={network.beaconCurrentJustifiedCheckpointEpoch} /></span>
																<TruncatedValue
																	format={TruncatedValueFormat.Abbr}
																	value={network.beaconCurrentJustifiedCheckpointRoot}
																/>
															</dd>
														</div>
													{/if}
													<div>
														<dt>Finalized</dt>
														<dd data-row="wrap align-start gap-2">
															<span>Epoch <NumberValue value={network.beaconFinalizedCheckpointEpoch} /></span>
															<TruncatedValue
																format={TruncatedValueFormat.Abbr}
																value={network.beaconFinalizedCheckpointRoot}
															/>
														</dd>
													</div>
													{#if (
														network.beaconPreviousJustifiedCheckpointEpoch !== undefined
														&& network.beaconPreviousJustifiedCheckpointRoot !== undefined
													)}
														<div>
															<dt>Previous justified</dt>
															<dd data-row="wrap align-start gap-2">
																<span>Epoch <NumberValue value={network.beaconPreviousJustifiedCheckpointEpoch} /></span>
																<TruncatedValue
																	format={TruncatedValueFormat.Abbr}
																	value={network.beaconPreviousJustifiedCheckpointRoot}
																/>
															</dd>
														</div>
													{/if}
												</dl>
											{:else}
												<p data-text="muted">No finality checkpoints yet.</p>
											{/if}
										{/snippet}
									</ResourceBoundary>
								</div>
							</section>
							<section
								id={`${networkIdKey}:beacon-validators`}
							>
								<BeaconValidatorsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$beaconValidators',
									}}
									href={href}
									id={`${networkIdKey}:beacon-validator-indices`}
									title="Recent proposers"
								/>
							</section>
							<section>
								<BeaconEpochsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$beaconEpochs',
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/beacon-epochs',
										{ networkId: String(entityId.chainId) },
									)}
									id={`${networkIdKey}:beacon-epochs`}
								/>
							</section>
							<section>
								<BeaconSlotsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$beaconSlots',
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/beacon-slots',
										{ networkId: String(entityId.chainId) },
									)}
									id={`${networkIdKey}:beacon-slots`}
								/>
							</section>
					{/snippet}
				</CollapsibleTabs>
			{/if}

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-data-storage`}
				{...{ 'data-card': '' }}
				class="network-view-collapsible-data-storage"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Data</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Contracts"
						href={`#${networkIdKey}:data-contracts`}
					>Contracts</a>
					<a
						data-scroll-marker-label="Blobs"
						href={`#${networkIdKey}:data-storage-blobs`}
					>Blobs</a>
				{/snippet}

				{#snippet body(_childrenContext)}
					<section id={`${networkIdKey}:data-contracts`}>
						<EvmContractsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Network,
								entityId,
								fieldName: '$$contracts',
							}}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/contracts',
								{ networkId: String(entityId.chainId) },
							)}
							id={`${networkIdKey}:contracts-list`}
						/>
					</section>
					<section>
						<EvmBlobsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Network,
								entityId,
								fieldName: '$$blobs',
							}}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/blobs',
								{ networkId: String(entityId.chainId) },
							)}
							id={`${networkIdKey}:data-storage-blobs`}
							title="Blobs"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.network-view-carousel-groups :global(.carousel) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
