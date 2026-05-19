<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'
	import { beaconRestBaseByExecutionChainId } from '$/constants/BeaconConsensus.ts'
	import { mevRelayHostsByChainId } from '$/constants/MevRelayHosts.ts'
	import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { type Entity, type EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { blockscoutExplorerRestV2SupportedForChain } from '$/sources/Blockscout/Rest/constants.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		Title,
	}: {
		children?: Snippet
		entityId: EntityId<typeof schema, EntityType.Network>
		href: string
		layout?: EntityLayout
		open?: boolean
		Title?: Snippet
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
							Source.Voltaire_JsonRpc,
							...(
								beaconRestBaseByExecutionChainId[entityId.chainId] != null ?
									[Source.Beacon_Rest]
								:
									[]
							),
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
			$$upgrades: {},
			$$executionUpgrades: {},
			$$consensusUpgrades: {},
			...(open && {
				blockHeight: {},
				gasPrice: {},
				baseFeePerGas: {},
				gasUsedRatio: {},
				$$gasFeeBlocks: {
					$: [
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
				...(entityId.chainId in mevRelayHostsByChainId && {
					$$mevProposerPayloadDelivered: {
						$: [
							Source.MevRelay_Rest,
						],
						$limit: 32,
					},
				}),
				...(beaconRestBaseByExecutionChainId[entityId.chainId] != null && {
					beaconFinalityCheckpointsJson: {
						$: [
							Source.Beacon_Rest,
						],
					},
					beaconForkScheduleJson: {
						$: [
							Source.Beacon_Rest,
						],
					},
					$$beaconEpochs: {},
					$$beaconValidators: {
						$: [
							Source.Beacon_Rest,
						],
						$limit: 48,
					},
				}),
				...(blockscoutExplorerRestV2SupportedForChain(entityId.chainId) && {
					$$accountAbstractionSmartAccounts: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
					},
					$$accountAbstractionBundlers: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
					},
					$$accountAbstractionPaymasters: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
					},
					$$accountAbstractionFactories: {
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
					blockscoutStatsJson: {
						$: [
							Source.Blockscout_Rest,
						],
					},
				}),
			}),
		},
	)


	const beaconHeadEpoch = derive(
		network,
		(network) => {
			const epochs: Entity<typeof schema, EntityType.BeaconEpoch>[] | undefined =
				network.$$beaconEpochs
			if (!(epochs?.length)) {
				return undefined
			}
			return epochs
				.toSorted((leftEpoch, rightEpoch) => (
					rightEpoch[EntityMetaKey.Id].epoch - leftEpoch[EntityMetaKey.Id].epoch
				))[0]
				?.[EntityMetaKey.Id].epoch
		},
	)

	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
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
	import Network_GasFee_BlocksView from '$/views/Network_GasFee_BlocksView.svelte'
	import Network_Txpool_TimestampsView from '$/views/Network_Txpool_TimestampsView.svelte'
	import NetworkAccountAbstractionAddressesView from '$/views/NetworkAccountAbstractionAddressesView.svelte'
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
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={network}
			placeholderText=""
		>
			{#snippet children(network)}
				{#if network.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						src={network.$icon[EntityMetaKey.Id].url}
						alt={network.name ?? ''}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		{#if Title}
			{@render Title()}
		{:else}
			<ResourceBoundary
				resource={network}
				placeholderText="Loading name…"
			>
				{#snippet children(network)}
					{network.name ?? String(entityId.chainId)}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{String(entityId.chainId)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution layer keyed by chain id applies transactions in block order; gas and fees are execution-layer notions.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading network…"
				>
					{#snippet children(network)}
						{#if network.environment !== undefined}
							<div>
								<dt>Environment</dt>
								<dd>{network.environment}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<div>
				<dt>Block</dt>
				<dd
					data-row="inline wrap"
					id="network-summary-head-block"
				>
					<ResourceBoundary
						resource={network}
						placeholderText="Loading head block…"
					>
						{#snippet children(network)}
							{#if network.blockHeight !== undefined}
								<EvmBlockView
									entityId={{
										$network: { chainId: entityId.chainId },
										blockNumber: network.blockHeight,
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
										{
											networkId: String(entityId.chainId),
											blockNumber: String(network.blockHeight),
										},
									)}
									layout={EntityLayout.Id}
									showTypeAnnotation={false}
								/>
							{:else}
								<span data-text="muted">—</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if beaconRestBaseByExecutionChainId[entityId.chainId] != null}
				<div>
					<dt>Epoch</dt>
					<dd>
						<ResourceBoundary
							resource={beaconHeadEpoch}
							placeholderText="Loading head epoch…"
						>
							{#snippet children(beaconHeadEpoch)}
								{#if beaconHeadEpoch !== undefined}
									<NumberValue value={beaconHeadEpoch} />
								{:else}
									—
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading network…"
				>
					{#snippet children(network)}
						{#if network.$parentLayer?.[EntityMetaKey.Id].chainId !== undefined}
							<div>
								<dt>Parent</dt>
								<dd>Chain {String(network.$parentLayer[EntityMetaKey.Id].chainId)}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<div>
					<dt>CAIP-2</dt>
					<dd data-row="inline wrap"><code>eip155:{String(entityId.chainId)}</code></dd>
				</div>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={network}
				>
					{#snippet children(network)}
						{#if network.registryStatus !== undefined}
							<div>
								<dt>Registry status</dt>
								<dd>{network.registryStatus}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={network}
				>
					{#snippet children(network)}
						{#if (
							network.peeringId !== undefined
							&& network.peeringId !== entityId.chainId
						)}
							<div>
								<dt>Peering ID</dt>
								<dd>{String(network.peeringId)}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={network}
				>
					{#snippet children(network)}
						{#if network.slip44 !== undefined}
							<div>
								<dt>SLIP-44</dt>
								<dd>{String(network.slip44)}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
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

				{#snippet Markers()}
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
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(_childrenContext)}
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
											open={false}
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
											open={false}
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
											open={false}
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
											open={false}
											title="Faucets"
										/>
									</section>
								{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			{#if blockscoutExplorerRestV2SupportedForChain(entityId.chainId)}
				<CollapsibleTabs
					id={`${networkIdKey}:carousel-actors`}
					{...{ 'data-card': '' }}
					class="network-view-collapsible-actors"
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Actors</HeadingComponent>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										ERC-4337 registry facets Blockscout indexes for this chain: accounts, bundlers, paymasters, factories, and recent user operations.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="Account abstraction actors"
								>ⓘ</abbr>
							</Tooltip>
						</header>
					{/snippet}

					{#snippet Markers()}
						<a
							data-scroll-marker-label="Accounts"
							href={`#${networkIdKey}:aa-accounts`}
						>Accounts</a>
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

					{#snippet children(_childrenContext)}
						<section id={`${networkIdKey}:aa-accounts`}>
							<NetworkAccountAbstractionAddressesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$accountAbstractionSmartAccounts',
								}}
								href={href}
								id={`${networkIdKey}:aa-accounts-list`}
								open={false}
								title="Accounts"
							/>
						</section>
						<section id={`${networkIdKey}:aa-bundlers`}>
							<NetworkAccountAbstractionAddressesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$accountAbstractionBundlers',
								}}
								href={href}
								id={`${networkIdKey}:aa-bundlers-list`}
								open={false}
								title="Bundlers"
							/>
						</section>
						<section id={`${networkIdKey}:aa-paymasters`}>
							<NetworkAccountAbstractionAddressesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$accountAbstractionPaymasters',
								}}
								href={href}
								id={`${networkIdKey}:aa-paymasters-list`}
								open={false}
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
								open={false}
							/>
						</section>
						<section id={`${networkIdKey}:aa-factories`}>
							<NetworkAccountAbstractionAddressesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$accountAbstractionFactories',
								}}
								href={href}
								id={`${networkIdKey}:aa-factories-list`}
								open={false}
								title="Factories"
							/>
						</section>
					{/snippet}
				</CollapsibleTabs>
			{/if}

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
									Registry-native currency rows, the chain’s native coin deployment, linked catalog coins when metadata includes ids, execution-layer gas hints and per-block fee snapshots from <code>eth_feeHistory</code>, and optional MEV-Boost relay <code>proposer_payload_delivered</code> traces (builder winning bids— unrelated to bridge “relayers”).
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Economics sections"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Native currencies"
						href={`#${networkIdKey}:economics-native-currencies`}
					>Native currencies</a>
					<a
						data-scroll-marker-label="Tokens"
						href={`#${networkIdKey}:economics-tokens`}
					>Tokens</a>
					<a
						data-scroll-marker-label="Gas"
						href={`#${networkIdKey}:economics-gas`}
					>Gas</a>
					{#if entityId.chainId in mevRelayHostsByChainId}
						<a
							data-scroll-marker-label="MEV-Boost"
							href={`#${networkIdKey}:economics-mev-boost`}
						>MEV-Boost</a>
					{/if}
				{/snippet}

				{#snippet children(_childrenContext)}
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
							<section id={`${networkIdKey}:economics-native-currencies`}>
								<div class="entity-details" data-column="gap-3">
									{#if nativeRows.length}
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
									{:else}
										<p data-text="muted">
											No native currency rows on this chain registry entry.
										</p>
									{/if}
								</div>
							</section>

							<section id={`${networkIdKey}:economics-tokens`}>
								<div data-column="gap-2">
									<CoinInstanceView
										entityId={{
											$network: entityId,
											type: CoinInstanceType.NativeCurrency,
										}}
										href={href}
										layout={EntityLayout.Summary}
										open={false}
										title="Native coin instance"
									/>
									{#each catalogCoinIds as coinId (coinId)}
										<CoinView
											entityId={{ coinId }}
											href={resolve(
												'/(assets)/(coins)/coin/[coinId]',
												{ coinId },
											)}
											layout={EntityLayout.Summary}
											open={false}
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
								</div>
							</section>

							<section id={`${networkIdKey}:economics-gas`}>
								<div class="entity-details" data-column="gap-3">
									{#if network.gasPrice !== undefined}
										<div data-row="inline wrap gap-2 align-baseline">
											<span data-text="annotation">Suggested gas price</span>
											<span>
												<NumberValue value={network.gasPrice} /> wei
											</span>
										</div>
									{/if}

									{#if network.baseFeePerGas !== undefined}
										<div data-row="inline wrap gap-2 align-baseline">
											<span data-text="annotation">Base fee</span>
											<span>
												<NumberValue value={network.baseFeePerGas} /> wei
											</span>
										</div>
									{/if}

									{#if network.gasUsedRatio !== undefined}
										<div data-row="inline wrap gap-2 align-baseline">
											<span data-text="annotation">Gas-used ratio</span>
											<span>{String(network.gasUsedRatio)}</span>
										</div>
									{/if}
									<Network_GasFee_BlocksView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.Network,
											entityId,
											fieldName: '$$gasFeeBlocks',
										}}
										href={href}
										id={`${networkIdKey}:economics-gas-fee-blocks`}
										open={false}
										title="Gas fee by block"
									/>
								</div>
							</section>

							{#if entityId.chainId in mevRelayHostsByChainId}
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
										open={false}
										title="MEV-Boost deliveries"
									/>
								</section>
							{/if}
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

				{#snippet Markers()}
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
					{#if beaconRestBaseByExecutionChainId[entityId.chainId] != null}
						<a
							data-scroll-marker-label="Validators"
							href={`#${networkIdKey}:execution-validators`}
						>Validators</a>
					{/if}
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

				{#snippet children(_childrenContext)}
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
						{#if beaconRestBaseByExecutionChainId[entityId.chainId] != null}
							<section
								id={`${networkIdKey}:execution-validators`}
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
									open={false}
								/>
							</section>
						{/if}
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
								open={false}
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
											open={false}
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
											open={false}
											title="Explorers"
										/>
									</section>
								{/if}
							{/snippet}
						</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			{#if beaconRestBaseByExecutionChainId[entityId.chainId] != null}
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

				{#snippet Markers()}
						<a
							data-scroll-marker-label="Forks"
							href={`#${networkIdKey}:consensus-upgrades`}
						>Forks</a>
						<a
							data-scroll-marker-label="Fork schedule"
							href={`#${networkIdKey}:beacon-fork-schedule`}
						>Fork schedule</a>
						<a
							data-scroll-marker-label="Finality"
							href={`#${networkIdKey}:beacon-finality`}
						>Finality</a>
						<a
							data-scroll-marker-label="Epochs"
							href={`#${networkIdKey}:beacon-epochs`}
						>Epochs</a>
						<a
							data-scroll-marker-label="Slots"
							href={`#${networkIdKey}:beacon-slots`}
						>Slots</a>
					{/snippet}

					{#snippet children(_childrenContext)}
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
									title="Forks"
								/>
							</section>
							<section id={`${networkIdKey}:beacon-fork-schedule`}>
								<div class="entity-details">
									<ResourceBoundary
										resource={network}
										placeholderText="Loading fork schedule…"
									>
										{#snippet children(network)}
											{#if network.beaconForkScheduleJson !== undefined}
												<div data-row="wrap align-start gap-2">
													<TruncatedValue
														format={TruncatedValueFormat.Visual}
														value={network.beaconForkScheduleJson}
													/>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>Consensus-layer fork boundaries (<code>/eth/v1/config/fork_schedule</code>) from the mapped beacon REST host for this execution chain.</p>
														{/snippet}
														<abbr
															class="entity-heading-tip"
															aria-label="Fork schedule payload"
														>ⓘ</abbr>
													</Tooltip>
												</div>
											{:else}
												<div data-row="wrap align-center gap-2">
													<p data-text="muted">
														No fork schedule yet.
													</p>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>Retry when the mapped beacon REST host returns <code>/eth/v1/config/fork_schedule</code>.</p>
														{/snippet}
														<abbr
															class="entity-heading-tip"
															aria-label="Why this is empty"
														>ⓘ</abbr>
													</Tooltip>
												</div>
											{/if}
										{/snippet}
									</ResourceBoundary>
								</div>
							</section>
							<section id={`${networkIdKey}:beacon-finality`}>
								<div class="entity-details">
									<ResourceBoundary
										resource={network}
										placeholderText="Loading finality checkpoints…"
									>
										{#snippet children(network)}
											{#if network.beaconFinalityCheckpointsJson !== undefined}
												<div data-row="wrap align-start gap-2">
													<TruncatedValue
														format={TruncatedValueFormat.Visual}
														value={network.beaconFinalityCheckpointsJson}
													/>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>Justified / finalized roots at head (<code>/eth/v1/beacon/states/head/finality_checkpoints</code>).</p>
														{/snippet}
														<abbr
															class="entity-heading-tip"
															aria-label="Finality checkpoints payload"
														>ⓘ</abbr>
													</Tooltip>
												</div>
											{:else}
												<div data-row="wrap align-center gap-2">
													<p data-text="muted">
														No finality checkpoints yet.
													</p>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>Retry when the mapped beacon REST host returns <code>/eth/v1/beacon/states/head/finality_checkpoints</code>.</p>
														{/snippet}
														<abbr
															class="entity-heading-tip"
															aria-label="Why this is empty"
														>ⓘ</abbr>
													</Tooltip>
												</div>
											{/if}
										{/snippet}
									</ResourceBoundary>
								</div>
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

				{#snippet Markers()}
					{#if blockscoutExplorerRestV2SupportedForChain(entityId.chainId)}
						<a
							data-scroll-marker-label="Contracts"
							href={`#${networkIdKey}:data-contracts`}
						>Contracts</a>
						<a
							data-scroll-marker-label="Stats"
							href={`#${networkIdKey}:data-blockscout-stats`}
						>Stats</a>
					{/if}
					<a
						data-scroll-marker-label="Blobs"
						href={`#${networkIdKey}:data-storage-blobs`}
					>Blobs</a>
				{/snippet}

				{#snippet children(_childrenContext)}
						{#if blockscoutExplorerRestV2SupportedForChain(entityId.chainId)}
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
									open={false}
								/>
							</section>
							<section id={`${networkIdKey}:data-blockscout-stats`}>
								<div class="entity-details">
									<ResourceBoundary
										resource={network}
										placeholderText="Loading explorer stats…"
									>
										{#snippet children(network)}
											{#if network.blockscoutStatsJson !== undefined}
												<div data-row="wrap align-start gap-2">
													<TruncatedValue
														format={TruncatedValueFormat.Visual}
														value={network.blockscoutStatsJson}
													/>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>Blockscout <code>/api/v2/stats</code> aggregates for this hosted explorer (transaction counters, suggested gas tiers, optional fiat/token cues). Omitted when an instance disables stats microservices.</p>
														{/snippet}
														<abbr
															class="entity-heading-tip"
															aria-label="Explorer stats payload"
														>ⓘ</abbr>
													</Tooltip>
												</div>
											{:else}
												<div data-row="wrap align-center gap-2">
													<p data-text="muted">
														No explorer stats yet.
													</p>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>This deployment may omit stats microservices or rate-limit browser requests.</p>
														{/snippet}
														<abbr
															class="entity-heading-tip"
															aria-label="Why this is empty"
														>ⓘ</abbr>
													</Tooltip>
												</div>
											{/if}
										{/snippet}
									</ResourceBoundary>
								</div>
							</section>
						{/if}
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
