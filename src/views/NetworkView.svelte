<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'
	import { hasBeaconDataForChainId } from '$/constants/BeaconConsensus.ts'
	import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
	import { ethereumExecutionForks } from '$/constants/EthereumExecutionForks.ts'
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
	import NetworkForksView from '$/views/NetworkForksView.svelte'
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
				Source.Lifi_Rest,
				...(
					layout === EntityLayout.SummaryDetails ?
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
			parentLayer: {},
			$$siblingShardNetworks: {},
			$$correspondingNetworks: {},
			$$childNetworks: {},
			rollupLayerNumber: {},
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
			...(
				layout === EntityLayout.SummaryDetails ?
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

	{#snippet Content()}
		<dl>
			<div>
				<dt>Chain ID</dt>
				<dd>{String(entityId.chainId)}</dd>
			</div>

			{#if layout === EntityLayout.SummaryDetails}
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
				<ResourceBoundary
					resource={network}
					placeholderText="Loading network…"
				>
					{#snippet children(networkEntity)}
						{#if networkEntity.parentLayer !== undefined}
							<div>
								<dt>Parent</dt>
								<dd>{networkEntity.parentLayer.parentChainCaip}</dd>
							</div>
						{/if}
						{#if networkEntity.environment !== undefined}
							<div>
								<dt>Environment</dt>
								<dd>{networkEntity.environment}</dd>
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
		>
			<ResourceBoundary
				resource={network}
			>
				{#snippet children(networkEntity)}
					{#if networkEntity.name === undefined}
						<p data-text="muted">Details unavailable.</p>
					{:else}
						<dl>
							<div>
								<dt>Name</dt>
								<dd>{networkEntity.name}</dd>
							</div>
							<div>
								<dt>CAIP-2</dt>
								<dd data-row="inline wrap"><code>eip155:{String(entityId.chainId)}</code></dd>
							</div>
							{#if layout !== EntityLayout.SummaryDetails}
								<div>
									<dt>Chain ID</dt>
									<dd>{String(entityId.chainId)}</dd>
								</div>
								<div>
									<dt>Head block</dt>
									<dd data-row="inline wrap">
										<ResourceBoundary
											resource={network}
										>
											{#snippet children(networkEntityWithBlockHeight)}
												{#if networkEntityWithBlockHeight.blockHeight !== undefined}
													<EvmBlockView
														entityId={{
															$network: { chainId: entityId.chainId },
															blockNumber: networkEntityWithBlockHeight.blockHeight,
														}}
														href={resolve(
															'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
															{
																networkId: String(entityId.chainId),
																blockNumber: String(networkEntityWithBlockHeight.blockHeight),
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
								{#if hasBeaconDataForChainId(entityId.chainId)}
									<div>
										<dt>Head epoch</dt>
										<dd>
											<ResourceBoundary
												resource={headEpochNumber}
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
								{#if networkEntity.parentLayer !== undefined}
									<div>
										<dt>Parent</dt>
										<dd>{networkEntity.parentLayer.parentChainCaip}</dd>
									</div>
								{/if}
								{#if networkEntity.environment !== undefined}
									<div>
										<dt>Environment</dt>
										<dd>{networkEntity.environment}</dd>
									</div>
								{/if}
							{/if}
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
							{#if networkEntity.shortName !== undefined}
								<div>
									<dt>Short name</dt>
									<dd>{networkEntity.shortName}</dd>
								</div>
							{/if}
							{#if networkEntity.registryStatus !== undefined}
								<div>
									<dt>List status</dt>
									<dd>{networkEntity.registryStatus}</dd>
								</div>
							{/if}
							{#if networkEntity.peeringId !== undefined}
								<div>
									<dt>Peering id</dt>
									<dd>{String(networkEntity.peeringId)}</dd>
								</div>
							{/if}
							{#if networkEntity.slip44 !== undefined}
								<div>
									<dt>SLIP-44</dt>
									<dd>{String(networkEntity.slip44)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

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
								<HeadingComponent>{`Layer-${String(networkEntity.rollupLayerNumber + 1)}s`}</HeadingComponent>
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
								{#if networkEntity.parentLayer != null}
									<section
										data-e2e="network-topology-parent"
										data-scroll-marker-label="Parent layer"
									>
										<EntitiesList
											collapsible={false}
											entityType={EntityType.Network}
											{href}
											id={`${networkIdKey}:topology-parent`}
											title="Parent layer"
										>
											{#snippet body()}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-TopologyParent-${networkIdKey}`}
												>
													<p>
														{networkEntity.parentLayer.relationshipType}
														(
														{networkEntity.parentLayer.parentChainCaip}
														) →
														<a href={networkHref(networkEntity.parentLayer.parentChainId)}>
															Chain
															{String(networkEntity.parentLayer.parentChainId)}
														</a>
													</p>
													{#if networkEntity.parentLayer.bridgeUrls.length > 0}
														<ul>
															{#each networkEntity.parentLayer.bridgeUrls as bridgeUrl (bridgeUrl)}
																<li>
																	<a
																		href={bridgeUrl}
																		rel="noreferrer"
																		target="_blank"
																	>
																		{bridgeUrl}
																	</a>
																</li>
															{/each}
														</ul>
													{/if}
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

								{#if (
									networkEntity.environment === NetworkEnvironment.Testnet
									|| networkEntity.environment === NetworkEnvironment.Mainnet
									|| (networkEntity.$$correspondingNetworks ?? []).length > 0
								)}
									<section
										data-e2e="network-topology-mainnet-testnet"
										data-scroll-marker-label="Mainnet & testnet peers"
									>
										<EntitiesList
											collapsible={false}
											entityType={EntityType.Network}
											{href}
											id={`${networkIdKey}:topology-mainnet-testnet`}
											title="Mainnet & testnet peers"
										>
											{#snippet body()}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-TopologyMainnetTestnet-${networkIdKey}`}
												>
													{#if networkEntity.environment === NetworkEnvironment.Testnet}
														<p>Listed as a testnet in the public chain list.</p>
													{:else if networkEntity.environment === NetworkEnvironment.Mainnet}
														<p>Not listed as a testnet in the public chain list.</p>
													{/if}
													{#if (networkEntity.$$correspondingNetworks ?? []).length > 0}
														<NetworksView
															collapsible={false}
															entityFieldReference={{
																entityType: EntityType.Network,
																entityId,
																fieldName: '$$correspondingNetworks',
															}}
															href={resolve(
																'/(explore)/(networks)/network/[networkId]',
																{ networkId: String(entityId.chainId) },
															)}
															id={`${networkIdKey}:topology-mainnet-testnet-peers`}
															open={false}
															title="Mainnet & testnet peers"
														/>
													{/if}
												</div>
											{/snippet}
										</EntitiesList>
									</section>
								{/if}

								{#if (networkEntity.$$childNetworks ?? []).length > 0}
									<section
										data-e2e="network-topology-children"
										data-scroll-marker-label={`Layer-${String(networkEntity.rollupLayerNumber + 1)}s`}
									>
										<NetworksView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$childNetworks',
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]',
												{ networkId: String(entityId.chainId) },
											)}
											id={`${networkIdKey}:topology-children`}
											open={false}
											title={`Layer-${String(networkEntity.rollupLayerNumber + 1)}s`}
										/>
									</section>
								{/if}

								{#if ethereumExecutionForks.some((row) => (
									row[EntityMetaKey.Id].$network.chainId === entityId.chainId
								))}
									<section
										data-e2e="network-topology-forks"
										data-scroll-marker-label="Forks"
									>
										<NetworkForksView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$forks',
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/forks',
												{ networkId: String(entityId.chainId) },
											)}
											id={`${networkIdKey}:topology-forks`}
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
					{#if layout === EntityLayout.SummaryDetails}
						<ResourceBoundary resource={network}>
							{#snippet children(networkEntity)}
								{#if networkEntity.gasPrice !== undefined}
									<section
										data-e2e="network-economics-gas"
										data-scroll-marker-label="Gas"
									>
										<div class="entity-details">
											<dl>
												<div>
													<dt>Gas price</dt>
													<dd>
														<NumberValue value={networkEntity.gasPrice} /> wei
													</dd>
												</div>
											</dl>
										</div>
									</section>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
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
