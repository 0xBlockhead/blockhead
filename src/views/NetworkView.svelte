<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { ethereumExecutionForks } from '$/constants/EthereumExecutionForks.ts'
	import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import NetworkSchema from '$/schema/Network.ts'
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
		entityId: typeof NetworkSchema.id.infer
		open?: boolean
		href: string
		layout?: EntityLayout
		Title?: Snippet
	} = $props()


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'


	const chainId = $derived(
		typeof entityId.chainId === 'number' ?
			entityId.chainId
		:	undefined,
	)

	const networkIdKey = $derived(
		stringify(entityId),
	)

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ networkRow: entityCollectionByEntityType[EntityType.Network] })
				.where(({ networkRow }) => (
					eq(
						networkRow[EntityMetaKey.IdKey],
						networkIdKey,
					)
				))
				.select(({ networkRow }) => ({ networkRow }))
		),
		[() => networkIdKey],
	)

	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight! })
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.Source],
						Source.Voltaire_JsonRpc,
					)
				))
				.select(({ blockHeight }) => ({
					height: blockHeight[EntityMetaKey.Value],
				}))
				.findOne()
		),
		[() => networkIdKey],
	)

	const headBlockHeight = $derived(
		(() => {
			const h = blockHeightQuery.data?.height
			return typeof h === 'bigint' ? h : undefined
		})(),
	)

	const headBlockEntityId = $derived(
		(
			chainId === undefined || headBlockHeight === undefined ?
				undefined
			:	{
					$network: {
						chainId,
					},
					blockNumber: headBlockHeight,
				}
		),
	)

	const headEpochQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$beaconEpochs: entityFieldCollections[EntityType.Network]['$$beaconEpochs']! })
				.where(({ $$beaconEpochs }) => (
					eq(
						$$beaconEpochs[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ $$beaconEpochs }) => (
					eq(
						$$beaconEpochs[EntityMetaKey.Source],
						Source.Beacon_Rest,
					)
				))
				.orderBy(({ $$beaconEpochs }) => (
					$$beaconEpochs[EntityMetaKey.IdKey]
				), 'desc')
				.limit(1)
				.select(({ $$beaconEpochs }) => ({
					epoch: $$beaconEpochs[EntityMetaKey.Value],
				}))
		),
		[() => networkIdKey],
	)

	const headEpoch = $derived(
		(() => {
			const id = headEpochQuery.data?.[0]?.epoch
			return (
				id !== undefined
				&& typeof id === 'object'
				&& typeof (id as { epoch?: unknown }).epoch === 'number'
			) ?
					(id as { epoch: number }).epoch
				:	undefined
		})(),
	)

	const explorerHrefs = $derived(
		(() => {
			const hrefs = new Set<string>()
			for (const row of networkQuery.data ?? []) {
				const list = (
					row.networkRow[EntityMetaKey.Fields] as
						| { explorers?: string[] }
						| undefined
					)
					?.explorers
				if (!Array.isArray(list)) continue
				for (const u of list) {
					if (typeof u === 'string' && u.length > 0) hrefs.add(u)
				}
			}
			return [...hrefs].toSorted((a, b) => a.localeCompare(b))
		})(),
	)

	const executionEndpointsByUrl = $derived(
		(() => {
			const byUrl = new Map<string, { url: string, transportType: string, serviceProvider: string }>()
			for (const row of networkQuery.data ?? []) {
				const list = (
					row.networkRow[EntityMetaKey.Fields] as
						| { executionEndpoints?: { url: string, transportType: string, serviceProvider: string }[] }
						| undefined
					)
					?.executionEndpoints
				if (!Array.isArray(list)) continue
				for (const ep of list) {
					if (ep !== undefined && typeof ep.url === 'string' && !byUrl.has(ep.url)) byUrl.set(ep.url, ep)
				}
			}
			return [...byUrl.values()].toSorted((a, b) => a.url.localeCompare(b.url))
		})(),
	)

	const networkRow = $derived(
		(
			networkQuery.data?.find(
				(row) => row.networkRow[EntityMetaKey.Source] === Source.Chainlist_Rest,
			)?.networkRow
			?? networkQuery.data?.[0]?.networkRow
		)
	)

	const networkField = $derived(
		(() => {
			const bag = networkRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				name: typeof b.name === 'string' && b.name.length ? b.name : undefined,
				nativeSymbol: typeof b.nativeSymbol === 'string' && b.nativeSymbol.length ? b.nativeSymbol : undefined,
				explorerOrigin: typeof b.explorerOrigin === 'string' && b.explorerOrigin.length ? b.explorerOrigin : undefined,
				rpcUrl: typeof b.rpcUrl === 'string' && b.rpcUrl.length ? b.rpcUrl : undefined,
			}
		})(),
	)

	const displayName = $derived(
		networkField?.name ?? (
			chainId !== undefined ?
				`Chain ${chainId}`
			:
				'Network'
		),
	)

	const numberFieldIds = (fields: Record<string, unknown> | null, key: string) => (
		fields == null || !Array.isArray(fields[key]) ?
			[] as number[]
		:	((fields[key] as unknown[]).filter((x): x is number => typeof x === 'number'))
	)

	const sourceRankForTopology = (source: unknown) => (
		source === Source.Chainlist_Rest ? 0
		: source === Source.EthereumLists_Rest ? 1
		:	2
	)

	const networkTopology = $derived(
		(() => {
			const rows = networkQuery.data
			if (rows === undefined || rows.length === 0) return null
			const ordered = [...rows].toSorted(
				(a, b) => (
					sourceRankForTopology(a.networkRow[EntityMetaKey.Source])
					- sourceRankForTopology(b.networkRow[EntityMetaKey.Source])
				),
			)
			const anyBag = ordered.some((r) => {
				const b = r.networkRow[EntityMetaKey.Fields]
				return b !== undefined && typeof b === 'object'
			})
			if (!anyBag) return null
			const unionIds = (key: string) => {
				const s = new Set<number>()
				for (const { networkRow } of rows) {
					const bag = networkRow[EntityMetaKey.Fields]
					if (bag === undefined || typeof bag !== 'object') continue
					for (const x of numberFieldIds(bag as Record<string, unknown>, key)) s.add(x)
				}
				return [...s].toSorted((a, b) => a - b)
			}
			let environment: NetworkEnvironment | undefined
			let parentLayer: {
				bridgeUrls: string[]
				parentChainCaip: string
				parentChainId: number
				relationshipType: string
			} | undefined
			for (const { networkRow } of ordered) {
				const bag = networkRow[EntityMetaKey.Fields]
				if (bag === undefined || typeof bag !== 'object') continue
				const f = bag as Record<string, unknown>
				if (
					environment === undefined
					&& typeof f.environment === 'string'
					&& (
						f.environment === NetworkEnvironment.Mainnet
						|| f.environment === NetworkEnvironment.Testnet
					)
				) {
					environment = f.environment
				}
				if (parentLayer === undefined && f.parentLayer !== undefined && typeof f.parentLayer === 'object') {
					const p = f.parentLayer as Record<string, unknown>
					const parentChainId = p.parentChainId
					const parentChainCaip = p.parentChainCaip
					const relationshipType = p.relationshipType
					if (
						typeof parentChainId === 'number'
						&& typeof parentChainCaip === 'string'
						&& Array.isArray(p.bridgeUrls)
					) {
						parentLayer = {
							bridgeUrls: p.bridgeUrls.filter((u): u is string => typeof u === 'string'),
							parentChainCaip,
							parentChainId,
							relationshipType: typeof relationshipType === 'string' ? relationshipType : 'unknown',
						}
					}
				}
			}
			return {
				childLayerChainIds: unionIds('childLayerChainIds'),
				correspondingChainIds: unionIds('correspondingChainIds'),
				environment,
				parentLayer,
				siblingShardChainIds: unionIds('siblingShardChainIds'),
			}
		})(),
	)

	const networkListMetadata = $derived(
		(() => {
			const rows = networkQuery.data ?? []
			let shortName: string | undefined
			let registryStatus: string | undefined
			let chainIcon: string | undefined
			let slip44: number | undefined
			let registryNetworkId: number | undefined
			const faucetSet = new Set<string>()
			for (const { networkRow } of rows) {
				const bag = networkRow[EntityMetaKey.Fields]
				if (bag === undefined || typeof bag !== 'object') continue
				const f = bag as Record<string, unknown>
				if (shortName === undefined && typeof f.shortName === 'string' && f.shortName.length) {
					shortName = f.shortName
				}
				if (registryStatus === undefined && typeof f.registryStatus === 'string' && f.registryStatus.length) {
					registryStatus = f.registryStatus
				}
				if (chainIcon === undefined && typeof f.chainIcon === 'string' && f.chainIcon.length) {
					chainIcon = f.chainIcon
				}
				if (slip44 === undefined && typeof f.slip44 === 'number') {
					slip44 = f.slip44
				}
				if (registryNetworkId === undefined && typeof f.registryNetworkId === 'number') {
					registryNetworkId = f.registryNetworkId
				}
				const fa = f.faucets
				if (!Array.isArray(fa)) continue
				for (const u of fa) {
					if (typeof u === 'string' && u.length) faucetSet.add(u)
				}
			}
			return {
				chainIcon,
				faucets: [...faucetSet].toSorted((a, b) => a.localeCompare(b)),
				registryNetworkId,
				registryStatus,
				shortName,
				slip44,
			}
		})(),
	)

	const hasExecutionForksForChain = $derived(
		chainId !== undefined
		&& ethereumExecutionForks.some(
			(row) => (
				row[EntityMetaKey.Id].$network.chainId === chainId
			),
		),
	)

	const networkHref = (id: number) => (
		resolve('/(explore)/(networks)/network/[networkId]', { networkId: String(id) })
	)

	const networkEnvironment = $derived(
		networkTopology?.environment,
	)

	const networkIsTestnet = $derived(
		networkEnvironment === NetworkEnvironment.Testnet ?
			true
		: networkEnvironment === NetworkEnvironment.Mainnet ?
			false
		:
			undefined,
	)

	const showTopologyParent = $derived(
		networkTopology?.parentLayer != null,
	)

	const showTopologySiblingShards = $derived(
		(
			networkTopology != null
			&& (
				networkTopology.siblingShardChainIds.length > 0
				|| String(networkTopology.parentLayer?.relationshipType ?? '').toLowerCase() === 'shard'
			)
		),
	)

	const showTopologyMainnetTestnet = $derived(
		(
			networkTopology != null
			&& (
				networkIsTestnet !== undefined
				|| networkTopology.correspondingChainIds.length > 0
			)
		),
	)

	const showTopologyChildren = $derived(
		(
			networkTopology != null
			&& networkTopology.childLayerChainIds.length > 0
		),
	)

	const showTopologyForks = $derived(
		hasExecutionForksForChain,
	)

	const showTopologyFaucets = $derived(
		networkListMetadata.faucets.length > 0,
	)

	const networkPlaceholderText = 'Loading network…'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


{#snippet sectionHeader(title: string)}
	<header
		data-row-item="flexible"
		data-row="wrap gap-4"
	>
		<HeadingComponent>
			{title}
		</HeadingComponent>
	</header>
{/snippet}


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	title={displayName}
	{layout}
	{open}
>
	{#snippet Heading()}
		<HeadingComponent>
			{#if href}
				<a href={resolve(href as `/${string}`)}>
					{#if Title}
						{@render Title()}
					{:else}
						{displayName}
					{/if}
				</a>
			{:else if Title}
				{@render Title()}
			{:else}
				{displayName}
			{/if}
		</HeadingComponent>
	{/snippet}

	{#snippet Content()}
		{#if chainId !== undefined}
			<dl data-definition-list="vertical">
				<div>
					<dt>Chain ID</dt>
					<dd>
						{String(chainId)}
					</dd>
				</div>
				<div>
					<dt>Head block</dt>
					<dd
						data-row="inline wrap"
						data-e2e="network-summary-head-block"
					>
						{#if headBlockEntityId !== undefined}
							<EvmBlockView
								entityId={headBlockEntityId}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
									{
										networkId: String(chainId),
										blockNumber: String(headBlockHeight),
									},
								)}
								layout={EntityLayout.Id}
							/>
						{:else}
							—
						{/if}
					</dd>
				</div>
				{#if headEpoch !== undefined}
					<div>
						<dt>Head Epoch</dt>
						<dd>
							<NumberValue value={headEpoch} />
						</dd>
					</div>
				{/if}
				{#if networkTopology?.parentLayer !== undefined}
					<div>
						<dt>Parent</dt>
						<dd>{networkTopology.parentLayer.parentChainCaip}</dd>
					</div>
				{/if}
				{#if networkEnvironment !== undefined}
					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironment}</dd>
					</div>
				{/if}
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Network}
			{entityId}
		>
			<QueryBoundary
				placeholderText={networkPlaceholderText}
				query={networkQuery}
			>
				{#snippet children(_rows)}
					{#if networkRow === undefined}
						<p data-text="muted">
							Network details for this chain aren’t in the app yet. Try again shortly, or check that
							explorers and chain metadata can be reached.
						</p>
					{:else}
						<dl data-definition-list="vertical">
							{#if networkField?.name !== undefined}
								<div>
									<dt>Name</dt>
									<dd>{networkField.name}</dd>
								</div>
							{/if}
							<div>
								<dt>Chain ID</dt>
								<dd>{String(chainId)}</dd>
							</div>
							<div>
								<dt>CAIP-2</dt>
								<dd data-row="inline wrap">eip155:{String(chainId)}</dd>
							</div>
							<div>
								<dt>Head block</dt>
								<dd data-row="inline wrap">
									{#if headBlockEntityId !== undefined}
										<EvmBlockView
											entityId={headBlockEntityId}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
												{
													networkId: String(chainId),
													blockNumber: String(headBlockHeight),
												},
											)}
											layout={EntityLayout.Id}
										/>
									{:else}
										—
									{/if}
								</dd>
							</div>
							{#if headEpoch !== undefined}
								<div>
									<dt>Head Epoch</dt>
									<dd>
										<NumberValue value={headEpoch} />
									</dd>
								</div>
							{/if}
							{#if networkTopology?.parentLayer !== undefined}
								<div>
									<dt>Parent</dt>
									<dd>{networkTopology.parentLayer.parentChainCaip}</dd>
								</div>
							{/if}
							{#if networkEnvironment !== undefined}
								<div>
									<dt>Environment</dt>
									<dd>{networkEnvironment}</dd>
								</div>
							{/if}
							{#if networkField?.nativeSymbol !== undefined}
								<div>
									<dt>Currency</dt>
									<dd>{networkField.nativeSymbol}</dd>
								</div>
							{/if}
							{#if networkListMetadata.shortName !== undefined}
								<div>
									<dt>Short name</dt>
									<dd>{networkListMetadata.shortName}</dd>
								</div>
							{/if}
							{#if networkListMetadata.registryStatus !== undefined}
								<div>
									<dt>List status</dt>
									<dd>{networkListMetadata.registryStatus}</dd>
								</div>
							{/if}
							{#if networkListMetadata.registryNetworkId !== undefined}
								<div>
									<dt>List network id</dt>
									<dd>{String(networkListMetadata.registryNetworkId)}</dd>
								</div>
							{/if}
							{#if networkListMetadata.slip44 !== undefined}
								<div>
									<dt>SLIP-44</dt>
									<dd>{String(networkListMetadata.slip44)}</dd>
								</div>
							{/if}
							{#if networkListMetadata.chainIcon !== undefined}
								<div>
									<dt>Icon</dt>
									<dd>
										<a
											href={networkListMetadata.chainIcon}
											rel="noreferrer"
											target="_blank"
										>
											{networkListMetadata.chainIcon}
										</a>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div
			data-column="gap-3"
			data-e2e="network-carousel-groups"
		>
			<Collapsible
				id={`${networkIdKey}:carousel-topology`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-topology"
			>
				{#snippet Summary({
					open: _open,
				})}
					{@render sectionHeader('Topology')}
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						data-e2e="network-carousel-topology"
					>
						{#if showTopologyParent}
							<section data-e2e="network-topology-parent">
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									{href}
									id={`${networkIdKey}:topology-parent`}
									title="Parent layer"
								>
									{#snippet body()}
										<QueryBoundary
											placeholderText={networkPlaceholderText}
											query={networkQuery}
										>
											{#snippet children(_chainlistNetworkResultRows)}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-TopologyParent-${networkIdKey}`}
												>
													<p>
														{networkTopology!.parentLayer!.relationshipType}
														(
														{networkTopology!.parentLayer!.parentChainCaip}
														) →
														<a
															href={networkHref(
																networkTopology!.parentLayer!.parentChainId,
															)}
														>
															Chain
															{String(
																networkTopology!.parentLayer!.parentChainId,
															)}
														</a>
													</p>
													{#if networkTopology!.parentLayer!.bridgeUrls.length > 0}
														<ul>
															{#each networkTopology!.parentLayer!.bridgeUrls as bridgeUrl (bridgeUrl)}
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
										</QueryBoundary>
									{/snippet}
								</EntitiesList>
							</section>
						{/if}

						{#if showTopologySiblingShards}
							<section data-e2e="network-topology-sibling-shards">
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									{href}
									id={`${networkIdKey}:topology-sibling-shards`}
									title="Sibling shards"
								>
									{#snippet body()}
										<QueryBoundary
											placeholderText={networkPlaceholderText}
											query={networkQuery}
										>
											{#snippet children(_chainlistNetworkResultRows)}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-TopologySiblingShards-${networkIdKey}`}
												>
													{#if networkTopology != null && networkTopology.siblingShardChainIds.length > 0}
														<ul>
															{#each networkTopology.siblingShardChainIds as sibChainId (sibChainId)}
																<li>
																	<a href={networkHref(sibChainId)}>
																		Chain
																		{String(sibChainId)}
																	</a>
																</li>
															{/each}
														</ul>
													{:else}
														<p data-text="muted">
															Other shard networks for the same parent, or this
															network isn’t a listed shard, so there’s nothing
															here to show.
														</p>
													{/if}
												</div>
											{/snippet}
										</QueryBoundary>
									{/snippet}
								</EntitiesList>
							</section>
						{/if}

						{#if showTopologyMainnetTestnet}
							<section data-e2e="network-topology-mainnet-testnet">
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									{href}
									id={`${networkIdKey}:topology-mainnet-testnet`}
									title="Mainnet & testnet peers"
								>
									{#snippet body()}
										<QueryBoundary
											placeholderText={networkPlaceholderText}
											query={networkQuery}
										>
											{#snippet children(_chainlistNetworkResultRows)}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-TopologyMainnetTestnet-${networkIdKey}`}
												>
													<p>
														{#if networkIsTestnet === true}
															Listed as a testnet in the public chain list.
														{:else if networkIsTestnet === false}
															Not listed as a testnet in the public chain list.
														{:else}
															Testnet status isn’t set for this network in the
															public chain list.
														{/if}
													</p>
													{#if networkTopology!.correspondingChainIds.length > 0}
														<ul>
															{#each networkTopology!.correspondingChainIds as peerChainId (peerChainId)}
																<li>
																	<a
																		href={networkHref(peerChainId)}
																	>
																		Chain
																		{String(peerChainId)}
																	</a>
																</li>
															{/each}
														</ul>
													{:else}
														<p data-text="muted">
															No mainnet↔testnet pairing is listed for this network in the
															public chain directory.
														</p>
													{/if}
												</div>
											{/snippet}
										</QueryBoundary>
									{/snippet}
								</EntitiesList>
							</section>
						{/if}

						{#if showTopologyChildren && chainId !== undefined}
							<section data-e2e="network-topology-children">
								<NetworksView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$childNetworks',
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]',
										{ networkId: String(chainId) },
									)}
									id={`${networkIdKey}:topology-children`}
									open={false}
									title="Child layer networks"
								/>
							</section>
						{/if}

						{#if showTopologyForks}
							<section data-e2e="network-topology-forks">
								<NetworkForksView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId,
										fieldName: '$$forks',
									}}
									href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', {
										networkId: String(chainId),
									})}
									id={`${networkIdKey}:topology-forks`}
								/>
							</section>
						{/if}

						{#if showTopologyFaucets}
							<section data-e2e="network-topology-faucets">
								<EntitiesList
									collapsible={false}
									entityType={EntityType.Network}
									{href}
									id={`${networkIdKey}:topology-faucets`}
									title="Faucets"
								>
									{#snippet body()}
										<QueryBoundary
											placeholderText="Loading network…"
											query={networkQuery}
										>
											{#snippet children(_chainlistNetworkResultRows)}
												<div
													class="entity-details"
													style:view-transition-name={`NetworkView-TopologyFaucets-${networkIdKey}`}
												>
													<ul>
														{#each networkListMetadata.faucets as faucetUrl (faucetUrl)}
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
										</QueryBoundary>
									{/snippet}
								</EntitiesList>
							</section>
						{/if}
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:carousel-execution`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-execution"
			>
				{#snippet Summary({
					open: _open,
				})}
					{@render sectionHeader('Execution')}
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						data-e2e="network-carousel-execution"
					>
						<section data-e2e="network-carousel-blocks">
							<EvmBlocksView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$evmBlocks',
								}}
								href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', {
									networkId: String(chainId),
								})}
								id={`${networkIdKey}:blocks`}
							/>
						</section>

						<section data-e2e="network-carousel-transactions">
							<EvmTransactionsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$evmTransactions',
								}}
								href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', {
									networkId: String(chainId),
								})}
								id={`${networkIdKey}:transactions`}
							/>
						</section>

						<section data-e2e="network-carousel-contracts">
							<EvmContractsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$evmContracts',
								}}
								href={resolve('/(explore)/(networks)/network/[networkId]/(network)/contracts', {
									networkId: String(chainId),
								})}
								id={`${networkIdKey}:contracts`}
							/>
						</section>

						<section data-e2e="network-carousel-execution-rpcs">
							<EntitiesList
								collapsible={false}
								entityType={EntityType.Network}
								{href}
								id={`${networkIdKey}:execution-rpcs`}
								title="Execution Providers"
							>
								{#snippet body()}
									<QueryBoundary
										placeholderText={networkPlaceholderText}
										query={networkQuery}
									>
										{#snippet children(chainlistNetworkResultRows)}
											<div
												class="entity-details"
												style:view-transition-name={`NetworkView-ExecutionRpcs-${networkIdKey}`}
											>
												{#if executionEndpointsByUrl.length > 0}
													<ul>
														{#each executionEndpointsByUrl as ep (ep.url)}
															<li>
																{ep.url} · {ep.transportType} · {ep.serviceProvider}
															</li>
														{/each}
													</ul>
												{:else if networkField?.rpcUrl !== undefined}
													<ul>
														<li>
															{networkField.rpcUrl}
														</li>
													</ul>
												{:else}
													<p data-text="muted">
														No public RPC endpoints are listed for this network
														in the app yet. Try again shortly.
													</p>
												{/if}
											</div>
										{/snippet}
									</QueryBoundary>
								{/snippet}
							</EntitiesList>
						</section>

						<section data-e2e="network-carousel-explorers">
							<EntitiesList
								collapsible={false}
								entityType={EntityType.Network}
								{href}
								id={`${networkIdKey}:explorers`}
								title="Explorers"
							>
								{#snippet body()}
									<QueryBoundary
										placeholderText={networkPlaceholderText}
										query={networkQuery}
									>
										{#snippet children(chainlistNetworkResultRows)}
											<div
												class="entity-details"
												style:view-transition-name={`NetworkView-Explorers-${networkIdKey}`}
											>
												{#if explorerHrefs.length > 0}
													<ul>
														{#each explorerHrefs as explorerHref (explorerHref)}
															<li>
																<a
																	href={explorerHref}
																	rel="noreferrer"
																	target="_blank"
																>
																	{explorerHref}
																</a>
															</li>
														{/each}
													</ul>
												{:else if networkField?.explorerOrigin !== undefined}
													<ul>
														<li>
															<a
																href={networkField.explorerOrigin}
																rel="noreferrer"
																target="_blank"
															>
																{networkField.explorerOrigin}
															</a>
														</li>
													</ul>
												{:else}
													<p data-text="muted">
														No block explorer URLs for this network are available
														in the app yet.
													</p>
												{/if}
											</div>
										{/snippet}
									</QueryBoundary>
								{/snippet}
							</EntitiesList>
						</section>
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:carousel-consensus`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-consensus"
			>
				{#snippet Summary({
					open: _open,
				})}
					{@render sectionHeader('Consensus')}
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						data-e2e="network-carousel-consensus"
					>
						<section data-e2e="network-carousel-beacon-epochs">
							<BeaconEpochsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$beaconEpochs',
								}}
								href={resolve('/(explore)/(networks)/network/[networkId]/(network)/beacon-epochs', {
									networkId: String(chainId),
								})}
								id={`${networkIdKey}:beacon-epochs`}
							/>
						</section>

						<section data-e2e="network-carousel-beacon-slots">
							<BeaconSlotsView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Network,
									entityId,
									fieldName: '$$beaconSlots',
								}}
								href={resolve('/(explore)/(networks)/network/[networkId]/(network)/beacon-slots', {
									networkId: String(chainId),
								})}
								id={`${networkIdKey}:beacon-slots`}
							/>
						</section>
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:carousel-storage`}
				{...{ 'data-card': '' }}
				data-e2e="network-collapsible-storage"
			>
				{#snippet Summary({
					open: _open,
				})}
					{@render sectionHeader('Storage')}
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						data-e2e="network-carousel-storage"
					></div>
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
