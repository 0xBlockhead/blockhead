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
				$$gasFeeTimestamps: {
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
					$$beaconEpochs: {},
				}),
			}),
		},
	)


	const headEpochNumber = derive(
		network,
		(networkEntity) => {
			const epochs: Entity<typeof schema, EntityType.BeaconEpoch>[] | undefined =
				networkEntity.$$beaconEpochs
			if (!(epochs?.length)) {
				return undefined
			}
			return epochs
				.toSorted((leftEpochEntity, rightEpochEntity) => (
					rightEpochEntity[EntityMetaKey.Id].epoch - leftEpochEntity[EntityMetaKey.Id].epoch
				))[0]
				?.[EntityMetaKey.Id].epoch
		},
	)

	const executionEndpointsByUrl = derive(
		network,
		(networkEntity) => {
			const executionEndpointsByUrlLookup: Record<string, {
				url: string
				transportType: string
				serviceProvider: string
			}> = {}
			for (const executionEndpoint of networkEntity.executionEndpoints ?? []) {
				if (executionEndpointsByUrlLookup[executionEndpoint.url] === undefined) {
					executionEndpointsByUrlLookup[executionEndpoint.url] = executionEndpoint
				}
			}
			return Object.values(executionEndpointsByUrlLookup).toSorted((leftEndpoint, rightEndpoint) => (
				leftEndpoint.url.localeCompare(rightEndpoint.url)
			))
		},
	)

	const nativeSymbol = derive(
		network,
		(networkEntity) => networkEntity.nativeCurrencies?.[0]?.symbol,
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary, { Layout } from '$/components/ResourceBoundary.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkConsensusUpgradesView from '$/views/NetworkConsensusUpgradesView.svelte'
	import NetworkExecutionUpgradesView from '$/views/NetworkExecutionUpgradesView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import Network_GasFee_TimestampsView from '$/views/Network_GasFee_TimestampsView.svelte'
	import Network_Txpool_TimestampsView from '$/views/Network_Txpool_TimestampsView.svelte'
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
			{#snippet children(networkEntity)}
				{#if networkEntity.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						src={networkEntity.$icon[EntityMetaKey.Id].url}
						alt={networkEntity.name ?? ''}
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
				{#snippet children(networkEntity)}
					{networkEntity.name ?? String(entityId.chainId)}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{String(entityId.chainId)}
		</span>
	{/snippet}



	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Chain ID</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Head block</dt>
					<dd
						data-row="inline wrap"
						data-e2e="network-summary-head-block"
					>
						<ResourceBoundary
							resource={network}
							placeholderText="Loading head block…"
						>
							{#snippet children(networkEntity)}
								{#if networkEntity.blockHeight !== undefined}
									<EvmBlockView
										entityId={{
											$network: { chainId: entityId.chainId },
											blockNumber: networkEntity.blockHeight,
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
											{
												networkId: String(entityId.chainId),
												blockNumber: String(networkEntity.blockHeight),
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
			{/if}
			{#if open}
				{#if beaconRestBaseByExecutionChainId[entityId.chainId] != null}
					<div>
						<dt>Head epoch</dt>
						<dd>
							<ResourceBoundary
								resource={headEpochNumber}
								placeholderText="Loading head epoch…"
							>
								{#snippet children(epoch)}
									{#if epoch !== undefined}
										<NumberValue value={epoch} />
									{:else}
										—
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}
			{#if open}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading network…"
				>
					{#snippet children(networkEntity)}
						{#if networkEntity.$parentLayer?.[EntityMetaKey.Id].chainId !== undefined}
							<div>
								<dt>Parent</dt>
								<dd>Chain {String(networkEntity.$parentLayer[EntityMetaKey.Id].chainId)}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if open}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading network…"
				>
					{#snippet children(networkEntity)}
						{#if networkEntity.environment !== undefined}
							<div>
								<dt>Environment</dt>
								<dd>{networkEntity.environment}</dd>
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
					resource={nativeSymbol}
				>
					{#snippet children(nativeCurrencySymbol)}
						{#if nativeCurrencySymbol !== undefined}
							<div>
								<dt>Currency</dt>
								<dd>{nativeCurrencySymbol}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if open}
				<ResourceBoundary
					resource={network}
				>
					{#snippet children(networkEntity)}
						{#if networkEntity.registryStatus !== undefined}
							<div>
								<dt>List status</dt>
								<dd>{networkEntity.registryStatus}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if open}
				<ResourceBoundary
					resource={network}
				>
					{#snippet children(networkEntity)}
						{#if networkEntity.peeringId !== undefined}
							<div>
								<dt>Peering ID</dt>
								<dd>{String(networkEntity.peeringId)}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if open}
				<ResourceBoundary
					resource={network}
				>
					{#snippet children(networkEntity)}
						{#if networkEntity.slip44 !== undefined}
							<div>
								<dt>SLIP-44</dt>
								<dd>{String(networkEntity.slip44)}</dd>
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

		<div data-column="gap-3" data-e2e="network-carousel-groups">
			<Collapsible
				id={`${networkIdKey}:carousel-topology`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-topology"
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<ResourceBoundary resource={network}>
							{#snippet children(networkEntity)}
								<HeadingComponent>Topology</HeadingComponent>
							{/snippet}
						</ResourceBoundary>
					</header>
				{/snippet}

				{#snippet children(_childrenContext)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						data-e2e="network-carousel-topology"
					>
						<ResourceBoundary
							layout={Layout.Block}
							resource={network}
						>
							{#snippet children(networkEntity)}
								<section
									data-e2e="network-topology-upgrades"
									data-scroll-marker-label="Upgrades"
								>
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
									/>
								</section>

								{#if networkEntity.$parentLayer?.[EntityMetaKey.Id].chainId !== undefined}
									<section
										data-e2e="network-topology-parent-layer"
										data-scroll-marker-label="Parent layer"
									>
										<EntitiesList
											collapsible={false}
											entityType={EntityType.Network}
											{href}
											id={`${networkIdKey}:topology-parent-layer`}
											title="Parent layer"
										>
											{#snippet body()}
												<div class="entity-details">
													<a href={networkHref(networkEntity.$parentLayer[EntityMetaKey.Id].chainId)}>
														Chain {String(networkEntity.$parentLayer[EntityMetaKey.Id].chainId)}
													</a>
												</div>
											{/snippet}
										</EntitiesList>
									</section>
								{/if}

								{#if (networkEntity.$$siblingShardNetworks ?? []).length}
									<section
										data-e2e="network-topology-sibling-shards"
										data-scroll-marker-label="Sibling shards"
									>
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
											title="Sibling shards"
										/>
									</section>
								{/if}

								{#if networkEntity.environment === NetworkEnvironment.Mainnet}
									<section
										data-e2e="network-topology-testnets"
										data-scroll-marker-label="Testnets"
									>
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
								{:else if networkEntity.environment === NetworkEnvironment.Testnet}
									<section
										data-e2e="network-topology-mainnet"
										data-scroll-marker-label="Mainnet"
									>
										{#if networkEntity.$mainnet?.[EntityMetaKey.Id].chainId !== undefined}
											<EntitiesList
												collapsible={false}
												entityType={EntityType.Network}
												{href}
												id={`${networkIdKey}:topology-mainnet`}
												title="Mainnet"
											>
												{#snippet body()}
													<div class="entity-details">
														<a href={networkHref(networkEntity.$mainnet[EntityMetaKey.Id].chainId)}>
															Chain {String(networkEntity.$mainnet[EntityMetaKey.Id].chainId)}
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
														<p data-text="muted">No mapped mainnet.</p>
													</div>
												{/snippet}
											</EntitiesList>
										{/if}
									</section>
								{/if}

								{#if (networkEntity.$$childLayers ?? []).length}
									<section
										data-e2e="network-topology-child-layers"
										data-scroll-marker-label={`Layer-${String(networkEntity.layerNumber + 1)}s`}
									>
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
											title={`Layer-${String(networkEntity.layerNumber + 1)}s`}
										/>
									</section>
								{/if}

								{#if (networkEntity.$$faucetUrls ?? []).length}
									<section
										data-e2e="network-topology-faucets"
										data-scroll-marker-label="Faucets"
									>
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
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:carousel-economics`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-economics"
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Economics</HeadingComponent>
					</header>
				{/snippet}

				<div
					class="carousel"
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					data-e2e="network-carousel-economics"
				>
					<ResourceBoundary
						layout={Layout.Block}
						resource={network}
					>
						{#snippet children(networkEntity)}
							{#if networkEntity.gasPrice !== undefined}
								<section
									data-e2e="network-economics-gas"
									data-scroll-marker-label="Gas"
								>
									<div class="entity-details">
										<div data-row="inline wrap gap-2 align-baseline">
											<span data-text="annotation">Gas price</span>
											<span>
												<NumberValue value={networkEntity.gasPrice} /> wei
											</span>
										</div>
									</div>
								</section>
							{/if}
							<section
								data-e2e="network-economics-gas-snapshots"
								data-scroll-marker-label="Gas snapshots"
							>
								<Network_GasFee_TimestampsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$gasFeeTimestamps',
									}}
									href={href}
									id={`${networkIdKey}:gas-fee-snapshots`}
									open={false}
								/>
							</section>
							<section
								data-e2e="network-economics-txpool"
								data-scroll-marker-label="Txpool"
							>
								<Network_Txpool_TimestampsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$txpoolTimestamps',
									}}
									href={href}
									id={`${networkIdKey}:txpool-snapshots`}
									open={false}
								/>
							</section>
							{#if entityId.chainId in mevRelayHostsByChainId}
								<section
									data-e2e="network-economics-mev-relay"
									data-scroll-marker-label="MEV relay"
								>
									<MevRelay_ProposerPayloadDeliveredRowsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.Network,
											entityId,
											fieldName: '$$mevProposerPayloadDelivered',
										}}
										href={href}
										id={`${networkIdKey}:mev-relay-payloads`}
										open={false}
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</div>
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:carousel-execution`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-execution"
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Execution</HeadingComponent>
					</header>
				{/snippet}
				{#snippet children(_childrenContext)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						data-e2e="network-carousel-execution"
					>
						<section
							data-e2e="network-carousel-execution-upgrades"
							data-scroll-marker-label="Upgrades"
						>
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
							/>
						</section>
						<section
							data-e2e="network-carousel-blocks"
							data-scroll-marker-label="Blocks"
						>
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
						<section
							data-e2e="network-carousel-transactions"
							data-scroll-marker-label="Transactions"
						>
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
						<section
							data-e2e="network-carousel-contracts"
							data-scroll-marker-label="Contracts"
						>
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
								id={`${networkIdKey}:contracts`}
							/>
						</section>
						<ResourceBoundary
							layout={Layout.Block}
							resource={executionEndpointsByUrl}
						>
							{#snippet children(executionEndpoints)}
								{#if executionEndpoints.length}
									<section
										data-e2e="network-carousel-execution-rpcs"
										data-scroll-marker-label="Execution providers"
									>
										<EntitiesList
											collapsible={false}
											entityType={EntityType.Network}
											{href}
											id={`${networkIdKey}:execution-rpcs`}
											title="Execution providers"
										>
											{#snippet body()}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-ExecutionRpcs-${networkIdKey}`}
												>
													<ul>
														{#each executionEndpoints as executionEndpoint (executionEndpoint.url)}
															<li>
																{executionEndpoint.url} · {executionEndpoint.transportType} · {executionEndpoint.serviceProvider}
															</li>
														{/each}
													</ul>
												</div>
											{/snippet}
										</EntitiesList>
									</section>
								{/if}
							{/snippet}
						</ResourceBoundary>
						<ResourceBoundary
							layout={Layout.Block}
							resource={network}
						>
							{#snippet children(networkEntity)}
								{#if (networkEntity.$$blockExplorerUrls ?? []).length}
									<section
										data-e2e="network-carousel-explorers"
										data-scroll-marker-label="Explorers"
									>
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
					</div>
				{/snippet}
			</Collapsible>

			{#if beaconRestBaseByExecutionChainId[entityId.chainId] != null}
				<Collapsible
					id={`${networkIdKey}:carousel-consensus`}
					{...{ 'data-card': '' }}
					data-e2e="network-collapsible-consensus"
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Consensus</HeadingComponent>
						</header>
					{/snippet}
					{#snippet children(_childrenContext)}
						<div
							class="carousel"
							data-scroll-container="inline layout-carousel carousel-marker-tabs"
							data-row="start align-start"
							data-e2e="network-carousel-consensus"
						>
							<section
								data-e2e="network-carousel-consensus-upgrades"
								data-scroll-marker-label="Upgrades"
							>
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
								/>
							</section>
							<section
								data-e2e="network-carousel-beacon-epochs"
								data-scroll-marker-label="Epochs"
							>
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
							<section
								data-e2e="network-carousel-beacon-slots"
								data-scroll-marker-label="Slots"
							>
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
						</div>
					{/snippet}
				</Collapsible>
			{/if}

			<Collapsible
				id={`${networkIdKey}:carousel-data-storage`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-data-storage"
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Data</HeadingComponent>
					</header>
				{/snippet}
				{#snippet children(_childrenContext)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						data-e2e="network-carousel-data-storage"
					>
						<section
							data-e2e="network-data-storage-blobs-list"
							data-scroll-marker-label="Blobs"
						>
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
					</div>
				{/snippet}
			</Collapsible>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.carousel {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
