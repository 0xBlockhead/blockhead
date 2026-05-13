<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'
	import { hasBeaconDataForChainId } from '$/constants/BeaconConsensus.ts'
	import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { type Entity, type EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkConsensusUpgradesView from '$/views/NetworkConsensusUpgradesView.svelte'
	import NetworkExecutionUpgradesView from '$/views/NetworkExecutionUpgradesView.svelte'
	import NetworkUpgradesView from '$/views/NetworkUpgradesView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'


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
								hasBeaconDataForChainId(entityId.chainId) ?
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
			blockExplorers: {},
			$icon: {},
			nativeCurrencies: {},
			shortName: {},
			registryStatus: {},
			slip44: {},
			peeringId: {},
			faucets: {},
			$$upgrades: {},
			$$executionUpgrades: {},
			$$consensusUpgrades: {},
			...(
				open ?
					{
						blockHeight: {},
						gasPrice: {},
						...(
							hasBeaconDataForChainId(entityId.chainId) ?
								{
									$$beaconEpochs: {},
								}
							:
								{}
						),
					}
				:
					{}
			),
		},
	)

	const headEpochNumber = derive(
		network,
		(networkEntity) => {
			const epochs: Entity<typeof schema, EntityType.BeaconEpoch>[] | undefined =
				networkEntity.$$beaconEpochs
			if (epochs === undefined || epochs.length === 0) {
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

	const explorerOrigins = derive(
		network,
		(networkEntity) => {
			const explorerOriginsLookup: Record<string, true> = {}
			for (const blockExplorer of networkEntity.blockExplorers ?? []) {
				explorerOriginsLookup[blockExplorer.origin] = true
			}
			return Object.keys(explorerOriginsLookup).toSorted((leftOrigin, rightOrigin) => (
				leftOrigin.localeCompare(rightOrigin)
			))
		},
	)

	const nativeSymbol = derive(
		network,
		(networkEntity) => networkEntity.nativeCurrencies?.[0]?.symbol,
	)
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	{layout}
	bind:open
>
	{#snippet Heading()}
		<div data-row="inline wrap gap-2 align-center">
			<HeadingComponent>
				{#if Title}
					{#if href}
						<a href={resolve(href as `/${string}`)}>
							{@render Title()}
						</a>
					{:else}
						{@render Title()}
					{/if}
				{:else}
					<ResourceBoundary
						resource={network}
						placeholderText="Loading name…"
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(networkEntity)}
							{#if href}
								<a href={resolve(href as `/${string}`)}>
									{networkEntity.name}
								</a>
							{:else}
								{networkEntity.name}
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}
			</HeadingComponent>
		</div>
	{/snippet}

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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Chain ID</dt>
				<dd>{String(entityId.chainId)}</dd>
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
				{#if hasBeaconDataForChainId(entityId.chainId)}
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
								<dt>Peering id</dt>
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
						<ResourceBoundary resource={network}>
							{#snippet children(networkEntity)}
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

								{#if (networkEntity.$$siblingShardNetworks ?? []).length > 0}
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

								{#if (networkEntity.$$childLayers ?? []).length > 0}
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

								{#if (networkEntity.$$upgrades ?? []).length > 0}
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
								{/if}

								{#if (networkEntity.faucets ?? []).length > 0}
									<section
										data-e2e="network-topology-faucets"
										data-scroll-marker-label="Faucets"
									>
										<EntitiesList
											collapsible={false}
											entityType={EntityType.Network}
											{href}
											id={`${networkIdKey}:topology-faucets`}
											title="Faucets"
										>
											{#snippet body()}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-TopologyFaucets-${networkIdKey}`}
												>
													<ul>
														{#each networkEntity.faucets ?? [] as faucetUrl (faucetUrl)}
															<li>
																<a
																	href={faucetUrl}
																	rel="noreferrer"
																	target="_blank"
																>
																	{faucetUrl}
																</a>
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
					<ResourceBoundary resource={network}>
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
						<ResourceBoundary resource={network}>
							{#snippet children(networkEntity)}
								{#if (networkEntity.$$executionUpgrades ?? []).length > 0}
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
								{/if}
							{/snippet}
						</ResourceBoundary>
						<ResourceBoundary resource={executionEndpointsByUrl}>
							{#snippet children(executionEndpoints)}
								{#if executionEndpoints.length > 0}
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
						<ResourceBoundary resource={explorerOrigins}>
							{#snippet children(explorerOrigins)}
								{#if explorerOrigins.length > 0}
									<section
										data-e2e="network-carousel-explorers"
										data-scroll-marker-label="Explorers"
									>
										<EntitiesList
											collapsible={false}
											entityType={EntityType.Network}
											{href}
											id={`${networkIdKey}:explorers`}
											title="Explorers"
										>
											{#snippet body()}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-Explorers-${networkIdKey}`}
												>
													<ul>
														{#each explorerOrigins as explorerOrigin (explorerOrigin)}
															<li>
																<a
																	href={explorerOrigin}
																	rel="noreferrer"
																	target="_blank"
																>
																	{explorerOrigin}
																</a>
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
					</div>
				{/snippet}
			</Collapsible>

			{#if hasBeaconDataForChainId(entityId.chainId)}
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
							<ResourceBoundary resource={network}>
								{#snippet children(networkEntity)}
									{#if (networkEntity.$$consensusUpgrades ?? []).length > 0}
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
									{/if}
								{/snippet}
							</ResourceBoundary>
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
