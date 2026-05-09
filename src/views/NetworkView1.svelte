<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { hasBeaconDataForChainId } from '$/constants/BeaconConsensus.ts'
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

	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'
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
					eq(networkRow[EntityMetaKey.IdKey], networkIdKey)
				))
				.select(({ networkRow }) => {
					const fields = networkRow[EntityMetaKey.Fields]
					const bag = (
						typeof fields === 'object'
						&& fields !== null
						&& !Array.isArray(fields) ?
							fields
						:
							{}
					)
					const parentLayerRaw = bag['parentLayer']

					return {
						source: networkRow[EntityMetaKey.Source],
						name: typeof bag['name'] === 'string' && bag['name'].length > 0 ? bag['name'] : undefined,
						environment: (
							bag['environment'] === NetworkEnvironment.Mainnet
							|| bag['environment'] === NetworkEnvironment.Testnet
						) ? bag['environment'] : undefined,
						parentLayer: (
							typeof parentLayerRaw === 'object'
							&& parentLayerRaw !== null
							&& !Array.isArray(parentLayerRaw)
							&& typeof parentLayerRaw['parentChainId'] === 'number'
							&& typeof parentLayerRaw['parentChainCaip'] === 'string'
							&& Array.isArray(parentLayerRaw['bridgeUrls'])
						) ? {
							parentChainId: parentLayerRaw['parentChainId'],
							parentChainCaip: parentLayerRaw['parentChainCaip'],
							relationshipType: typeof parentLayerRaw['relationshipType'] === 'string' ? parentLayerRaw['relationshipType'] : 'unknown',
							bridgeUrls: parentLayerRaw['bridgeUrls'].filter((value): value is string => typeof value === 'string'),
						} : undefined,
						rollupLayerNumber: (
							typeof bag['rollupLayerNumber'] === 'number'
							&& Number.isFinite(bag['rollupLayerNumber'])
							&& bag['rollupLayerNumber'] >= 1
						) ? bag['rollupLayerNumber'] : undefined,
						childLayerChainIds: Array.isArray(bag['childLayerChainIds']) ? bag['childLayerChainIds'].filter((value): value is number => typeof value === 'number') : [],
						correspondingChainIds: Array.isArray(bag['correspondingChainIds']) ? bag['correspondingChainIds'].filter((value): value is number => typeof value === 'number') : [],
						siblingShardChainIds: Array.isArray(bag['siblingShardChainIds']) ? bag['siblingShardChainIds'].filter((value): value is number => typeof value === 'number') : [],
						shortName: typeof bag['shortName'] === 'string' && bag['shortName'].length > 0 ? bag['shortName'] : undefined,
						registryStatus: typeof bag['registryStatus'] === 'string' && bag['registryStatus'].length > 0 ? bag['registryStatus'] : undefined,
						iconImageUrl: (
							typeof bag['$icon'] === 'object'
							&& bag['$icon'] !== null
							&& !Array.isArray(bag['$icon'])
							&& typeof bag['$icon'][EntityMetaKey.Id] === 'object'
							&& bag['$icon'][EntityMetaKey.Id] !== null
							&& !Array.isArray(bag['$icon'][EntityMetaKey.Id])
							&& typeof bag['$icon'][EntityMetaKey.Id]['url'] === 'string'
						) ? bag['$icon'][EntityMetaKey.Id]['url'] : undefined,
						slip44: typeof bag['slip44'] === 'number' ? bag['slip44'] : undefined,
						peeringId: typeof bag['peeringId'] === 'number' ? bag['peeringId'] : undefined,
						faucets: Array.isArray(bag['faucets']) ? bag['faucets'].filter((value): value is string => typeof value === 'string' && value.length > 0) : [],
						blockExplorerOrigins: Array.isArray(bag['blockExplorers']) ? bag['blockExplorers'].flatMap((value) => (
							typeof value === 'object'
							&& value !== null
							&& !Array.isArray(value)
							&& typeof value['origin'] === 'string'
							&& value['origin'].length > 0 ?
								[value['origin']]
							:
								[]
						)) : [],
						nativeCurrencies: Array.isArray(bag['nativeCurrencies']) ? bag['nativeCurrencies'].flatMap((value) => (
							typeof value === 'object'
							&& value !== null
							&& !Array.isArray(value)
							&& typeof value['name'] === 'string'
							&& value['name'].length > 0
							&& typeof value['symbol'] === 'string'
							&& value['symbol'].length > 0
							&& typeof value['decimals'] === 'number' ?
								[{
									name: value['name'],
									symbol: value['symbol'],
									decimals: value['decimals'],
									coinId: typeof value['coinId'] === 'string' && value['coinId'].length > 0 ? value['coinId'] : undefined,
									slip44: typeof value['slip44'] === 'number' ? value['slip44'] : undefined,
								}]
							:
								[]
						)) : [],
						executionEndpoints: Array.isArray(bag['executionEndpoints']) ? bag['executionEndpoints'].flatMap((value) => (
							typeof value === 'object'
							&& value !== null
							&& !Array.isArray(value)
							&& typeof value['url'] === 'string'
							&& typeof value['transportType'] === 'string'
							&& typeof value['serviceProvider'] === 'string' ?
								[{
									url: value['url'],
									transportType: value['transportType'],
									serviceProvider: value['serviceProvider'],
								}]
							:
								[]
						)) : [],
					}
				})
		),
		[() => networkIdKey],
	)

	const bridgesPreviewQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					bridgeFieldRow: entityFieldCollectionForReference(
						entityFieldCollections,
						{
							entityType: EntityType.Network,
							entityId,
							fieldName: '$$bridges',
						},
					),
				})
				.where(({ bridgeFieldRow }) => (
					eq(bridgeFieldRow[EntityMetaKey.ParentIdKey], networkIdKey)
				))
				.orderBy(({ bridgeFieldRow }) => (bridgeFieldRow[EntityMetaKey.Source]), 'asc')
				.limit(1)
				.select(({ bridgeFieldRow }) => (
					{ value: bridgeFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => networkIdKey,
			() => stringify(entityId),
		],
	)

	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight })
				.where(({ blockHeight }) => (
					eq(blockHeight[EntityMetaKey.ParentIdKey], networkIdKey)
				))
				.where(({ blockHeight }) => (
					eq(blockHeight[EntityMetaKey.Source], Source.Voltaire_JsonRpc)
				))
				.select(({ blockHeight }) => ({ height: blockHeight[EntityMetaKey.Value] }))
				.findOne()
		),
		[() => networkIdKey],
	)

	const headEpochQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$beaconEpochs: entityFieldCollections[EntityType.Network]['$$beaconEpochs'] })
				.where(({ $$beaconEpochs }) => (
					eq($$beaconEpochs[EntityMetaKey.ParentIdKey], networkIdKey)
				))
				.where(({ $$beaconEpochs }) => (
					eq($$beaconEpochs[EntityMetaKey.Source], Source.Beacon_Rest)
				))
				.orderBy(({ $$beaconEpochs }) => (
					$$beaconEpochs[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(1)
				.select(({ $$beaconEpochs }) => ({ epoch: $$beaconEpochs[EntityMetaKey.Value] }))
		),
		[() => networkIdKey],
	)

	const gasPriceQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ gasPrice: entityFieldCollections[EntityType.Network].gasPrice })
				.where(({ gasPrice }) => (
					eq(gasPrice[EntityMetaKey.ParentIdKey], networkIdKey)
				))
				.where(({ gasPrice }) => (
					eq(gasPrice[EntityMetaKey.Source], Source.Voltaire_JsonRpc)
				))
				.select(({ gasPrice }) => ({ value: gasPrice[EntityMetaKey.Value] }))
				.findOne()
		),
		[() => networkIdKey],
	)

	const baseFeePerGasQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ baseFeePerGas: entityFieldCollections[EntityType.Network].baseFeePerGas })
				.where(({ baseFeePerGas }) => (
					eq(baseFeePerGas[EntityMetaKey.ParentIdKey], networkIdKey)
				))
				.where(({ baseFeePerGas }) => (
					eq(baseFeePerGas[EntityMetaKey.Source], Source.Voltaire_JsonRpc)
				))
				.select(({ baseFeePerGas }) => ({ value: baseFeePerGas[EntityMetaKey.Value] }))
				.findOne()
		),
		[() => networkIdKey],
	)

	const gasUsedRatioQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ gasUsedRatio: entityFieldCollections[EntityType.Network].gasUsedRatio })
				.where(({ gasUsedRatio }) => (
					eq(gasUsedRatio[EntityMetaKey.ParentIdKey], networkIdKey)
				))
				.where(({ gasUsedRatio }) => (
					eq(gasUsedRatio[EntityMetaKey.Source], Source.Voltaire_JsonRpc)
				))
				.select(({ gasUsedRatio }) => ({ value: gasUsedRatio[EntityMetaKey.Value] }))
				.findOne()
		),
		[() => networkIdKey],
	)

	const networkCaip2 = $derived(
		chainId !== undefined ?
			`eip155:${String(chainId)}`
		:
			undefined,
	)

	const sourceRankForTopology = (source) => (
		source === Source.Chainlist_Rest ? 0
		: source === Source.EthereumLists_Rest ? 1
		:	2
	)

	const networkTopologyFromRows = (rows) => (
		(() => {
			if (rows === undefined || rows.length === 0) return null
			const ordered = [...rows].toSorted(
				(a, b) => (
					sourceRankForTopology(a.source)
					- sourceRankForTopology(b.source)
				),
			)
			if (!ordered.some((row) => (
				row.environment !== undefined
				|| row.parentLayer !== undefined
				|| row.rollupLayerNumber !== undefined
				|| row.childLayerChainIds.length > 0
				|| row.correspondingChainIds.length > 0
				|| row.siblingShardChainIds.length > 0
			))) return null
			let environment: NetworkEnvironment | undefined
			let parentLayer: (typeof ordered)[number]['parentLayer']
			let rollupLayerNumber: number | undefined
			for (const row of ordered) {
				if (environment === undefined && row.environment !== undefined) environment = row.environment
				if (parentLayer === undefined && row.parentLayer !== undefined) parentLayer = row.parentLayer
				if (rollupLayerNumber === undefined && row.rollupLayerNumber !== undefined) rollupLayerNumber = row.rollupLayerNumber
			}
			return {
				childLayerChainIds: (() => {
					const values: number[] = []
					for (const row of rows) {
						for (const x of row.childLayerChainIds) {
							if (typeof x === 'number' && !values.includes(x)) values.push(x)
						}
					}
					return values.toSorted((a, b) => a - b)
				})(),
				correspondingChainIds: (() => {
					const values: number[] = []
					for (const row of rows) {
						for (const x of row.correspondingChainIds) {
							if (typeof x === 'number' && !values.includes(x)) values.push(x)
						}
					}
					return values.toSorted((a, b) => a - b)
				})(),
				environment,
				parentLayer,
				rollupLayerNumber,
				siblingShardChainIds: (() => {
					const values: number[] = []
					for (const row of rows) {
						for (const x of row.siblingShardChainIds) {
							if (typeof x === 'number' && !values.includes(x)) values.push(x)
						}
					}
					return values.toSorted((a, b) => a - b)
				})(),
			}
		})()
	)

	const networkListMetadataFromRows = (rows) => (
		(() => {
			const sortedRows = (
				[...(rows ?? [])].toSorted(
					(a, b) => (
						sourceRankForTopology(a.source)
						- sourceRankForTopology(b.source)
					),
				)
			)
			let shortName: string | undefined
			let registryStatus: string | undefined
			let iconImageUrl: string | undefined
			let slip44: number | undefined
			let peeringId: number | undefined
			const faucetValues: string[] = []
			for (const row of sortedRows) {
				if (shortName === undefined && row.shortName !== undefined) shortName = row.shortName
				if (registryStatus === undefined && row.registryStatus !== undefined) registryStatus = row.registryStatus
				if (iconImageUrl === undefined && row.iconImageUrl !== undefined) iconImageUrl = row.iconImageUrl
				if (slip44 === undefined && row.slip44 !== undefined) slip44 = row.slip44
				if (peeringId === undefined && row.peeringId !== undefined) peeringId = row.peeringId
				for (const u of row.faucets) {
					if (typeof u === 'string' && u.length > 0 && !faucetValues.includes(u)) faucetValues.push(u)
				}
			}
			return {
				iconImageUrl,
				faucets: faucetValues.toSorted((a, b) => a.localeCompare(b)),
				peeringId,
				registryStatus,
				shortName,
				slip44,
			}
		})()
	)

	const hasCatalogedForksForChain = $derived(
		chainId !== undefined
		&& ethereumExecutionForks.some(
			(row) => (
				row[EntityMetaKey.Id].$network.chainId === chainId
			),
		),
	)

	const displayNameFromRows = (rows) => (
		rows?.find((row) => row.source === Source.Chainlist_Rest)?.name
		?? rows?.find((row) => row.name !== undefined)?.name
		?? (
			chainId !== undefined ?
				`Chain ${String(chainId)}`
			:
				'Network'
		)
	)

	const explorerHrefsFromRows = (rows) => (
		(() => {
			const hrefs: string[] = []
			for (const row of rows ?? []) {
				for (const origin of row.blockExplorerOrigins) {
					if (typeof origin === 'string' && origin.length > 0 && !hrefs.includes(origin)) hrefs.push(origin)
				}
			}
			return hrefs.toSorted((a, b) => a.localeCompare(b))
		})()
	)

	const nativeCurrenciesFromRows = (rows) => (
		(() => {
			const byKey: {
				[key: string]: {
					coinId?: string
					decimals: number
					name: string
					slip44?: number
					symbol: string
				}
			} = {}
			for (const row of rows ?? []) {
				for (const c of row.nativeCurrencies) {
					byKey[`${c.name}:${c.symbol}:${String(c.decimals)}:${String(c.coinId ?? '')}:${String(c.slip44 ?? '')}`] = {
						coinId: c.coinId,
						decimals: c.decimals,
						name: c.name,
						slip44: c.slip44,
						symbol: c.symbol,
					}
				}
			}
			return Object.values(byKey).toSorted((a, b) => (
				a.symbol.localeCompare(b.symbol)
				|| a.name.localeCompare(b.name)
				|| a.decimals - b.decimals
			))
		})()
	)

	const executionEndpointsByUrlFromRows = (rows) => (
		(() => {
			const byUrl: {
				[key: string]: {
					url: string
					transportType: string
					serviceProvider: string
				}
			} = {}
			for (const row of rows ?? []) {
				for (const ep of row.executionEndpoints) {
					if (ep.url in byUrl) continue
					byUrl[ep.url] = {
						url: ep.url,
						transportType: ep.transportType,
						serviceProvider: ep.serviceProvider,
					}
				}
			}
			return Object.values(byUrl).toSorted((a, b) => a.url.localeCompare(b.url))
		})()
	)

	const childLayerNetworksTitle = (networkTopology: ReturnType<typeof networkTopologyFromRows>) => (
		networkTopology == null ?
			'Child layer networks'
		: `Layer-${
			networkTopology.rollupLayerNumber == null ?
				networkTopology.parentLayer == null ?
					2
				:	3
			:	networkTopology.rollupLayerNumber + 1
		}`
	)

	const networkPlaceholderText = 'Loading network…'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Icon from '$/components/Icon.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NetworkBridgesView from '$/views/NetworkBridgesView.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	title={displayNameFromRows(networkQuery.data)}
	{layout}
	{open}
>
	{#snippet Heading()}
		<QueryBoundary
			placeholderText={networkPlaceholderText}
			query={networkQuery}
		>
			{#snippet children(rows)}
				{@const networkListMetadata = networkListMetadataFromRows(rows)}
				{@const displayName = displayNameFromRows(rows)}
				<div data-row="inline wrap gap-2 align-center">
					{#if networkListMetadata.iconImageUrl !== undefined}
						<Icon
							src={networkListMetadata.iconImageUrl}
							alt=""
					networkQuery		title={displayName}
						/>
					{/if}
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
				</div>
			{/snippet}
		</QueryBoundary>
	{/snippet}

	{#snippet Content()}
		{#if chainId !== undefined}
			<QueryBoundary
				placeholderText={networkPlaceholderText}
				query={networkQuery}
			>
				{#snippet children(rows)}
					{@const nativeCurrencies = nativeCurrenciesFromRows(rows)}
					{@const networkTopology = networkTopologyFromRows(rows)}
					<dl>
						<div>
							<dt>Chain ID</dt>
							<dd>{String(chainId)}</dd>
						</div>
						{#if nativeCurrencies.length > 0}
							<div>
								<dt>Native currency</dt>
								<dd>
									{#each nativeCurrencies as nativeCurrency, index (`${nativeCurrency.name}:${nativeCurrency.symbol}:${String(nativeCurrency.decimals)}:${String(nativeCurrency.coinId ?? '')}:${String(nativeCurrency.slip44 ?? '')}`)}
										{#if index > 0}
											·
										{/if}
										{nativeCurrency.name} ({nativeCurrency.symbol})
									{/each}
								</dd>
							</div>
						{/if}
						<QueryBoundary
							query={blockHeightQuery}
						>
							{#snippet children(blockHeightData)}
								{@const headBlockHeight = typeof blockHeightData?.height === 'bigint' ? blockHeightData.height : undefined}
								{@const headBlockEntityId = headBlockHeight === undefined ? undefined : { $network: { chainId }, blockNumber: headBlockHeight }}
								{#if headBlockEntityId !== undefined}
									<div>
										<dt>Head block</dt>
										<dd
											data-row="inline wrap"
											data-e2e="network-summary-head-block"
										>
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
										</dd>
									</div>
								{/if}
							{/snippet}
						</QueryBoundary>
						<QueryBoundary
							query={headEpochQuery}
						>
							{#snippet children(headEpochRows)}
								{@const headEpoch = (() => {
									const ep = headEpochRows?.[0]?.epoch
									if (ep === undefined || typeof ep !== 'object' || ep === null || Array.isArray(ep)) return undefined
									if (!('epoch' in ep)) return undefined
									const n = ep.epoch
									return typeof n === 'number' ? n : undefined
								})()}
								{#if headEpoch !== undefined}
									<div>
										<dt>Head Epoch</dt>
										<dd>
											<NumberValue value={headEpoch} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</QueryBoundary>
						{#if networkTopology?.parentLayer !== undefined}
							<div>
								<dt>Parent</dt>
								<dd>{networkTopology.parentLayer.parentChainCaip}</dd>
							</div>
						{/if}
						{#if networkTopology?.environment !== undefined}
							<div>
								<dt>Environment</dt>
								<dd>{networkTopology.environment}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</QueryBoundary>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<QueryBoundary
			placeholderText={networkPlaceholderText}
			query={networkQuery}
		>
			{#snippet children(rows)}
				{@const networkListMetadata = networkListMetadataFromRows(rows)}
				{@const nativeCurrencies = nativeCurrenciesFromRows(rows)}
				{@const networkTopology = networkTopologyFromRows(rows)}
				{@const explorerHrefs = explorerHrefsFromRows(rows)}
				{@const executionEndpointsByUrl = executionEndpointsByUrlFromRows(rows)}
				{@const showTopologyParent = networkTopology?.parentLayer != null}
				{@const showTopologySiblingShards = networkTopology != null && networkTopology.siblingShardChainIds.length > 0}
				{@const showTopologyMainnetTestnet = networkTopology != null && networkTopology.correspondingChainIds.length > 0}
				{@const showTopologyChildren = networkTopology != null && networkTopology.childLayerChainIds.length > 0}
				{@const childLayerNetworksTitleValue = childLayerNetworksTitle(networkTopology)}
				{@const showTopologyForks = hasCatalogedForksForChain}
				{@const showTopologyFaucets = networkListMetadata.faucets.length > 0}
				<EntityDetails
					entityType={EntityType.Network}
					{entityId}
				>
					{#if rows.length > 0}
						<dl>
							{#if networkCaip2 !== undefined}
								<div>
									<dt>CAIP-2</dt>
									<dd data-row="inline wrap">
										<code>{networkCaip2}</code>
									</dd>
								</div>
							{/if}
							{#if nativeCurrencies.length > 0}
								<div>
									<dt>Native currencies</dt>
									<dd>
										<ul>
											{#each nativeCurrencies as nativeCurrency (`${nativeCurrency.name}:${nativeCurrency.symbol}:${String(nativeCurrency.decimals)}:${String(nativeCurrency.coinId ?? '')}:${String(nativeCurrency.slip44 ?? '')}`)}
												<li>
													{nativeCurrency.name}
													({nativeCurrency.symbol}) ·
													<NumberValue value={nativeCurrency.decimals} />
													decimals
													{#if nativeCurrency.coinId !== undefined}
														· {nativeCurrency.coinId}
													{/if}
													{#if nativeCurrency.slip44 !== undefined}
														· SLIP-44
														<NumberValue value={nativeCurrency.slip44} />
													{/if}
												</li>
											{/each}
										</ul>
									</dd>
								</div>
							{/if}
							{#if networkListMetadata.registryStatus !== undefined}
								<div>
									<dt>List status</dt>
									<dd>{networkListMetadata.registryStatus}</dd>
								</div>
							{/if}
							{#if networkListMetadata.peeringId !== undefined}
								<div>
									<dt>Peering ID</dt>
									<dd><NumberValue value={networkListMetadata.peeringId} /></dd>
								</div>
							{/if}
							{#if networkListMetadata.slip44 !== undefined}
								<div>
									<dt>SLIP-44</dt>
									<dd><NumberValue value={networkListMetadata.slip44} /></dd>
								</div>
							{/if}
						</dl>
					{/if}
				</EntityDetails>
				<div
					data-column="gap-3"
					data-e2e="network-carousel-groups"
				>
					{#if showTopologyParent || showTopologyForks || showTopologySiblingShards || showTopologyMainnetTestnet || (showTopologyChildren && chainId !== undefined) || showTopologyFaucets || chainId !== undefined}
						<Collapsible
							id={`${networkIdKey}:carousel-topology`}
							{...{ 'data-card': '' }}
							data-e2e="network-collapsible-topology"
						>
							{#snippet Summary({
								open: _open,
							})}
								<header
									data-row-item="flexible"
									data-row="wrap gap-4"
								>
									<HeadingComponent>
										Topology
									</HeadingComponent>
								</header>
							{/snippet}
							{#snippet children(_ctx)}
								<div
									class="carousel"
									data-scroll-container="inline layout-carousel carousel-marker-tabs"
									data-row="start align-start"
									data-e2e="network-carousel-topology"
								>
									{#if showTopologyParent}
										<section
											data-e2e="network-topology-parent"
											data-scroll-marker-label="Parent layer"
										>
											<div
												class="entity-details"
												style:view-transition-name={`NetworkView-TopologyParent-${networkIdKey}`}
											>
												<p>
													{networkTopology!.parentLayer!.relationshipType}
													({networkTopology!.parentLayer!.parentChainCaip}) →
													<a href={resolve('/(explore)/(networks)/network/[networkId]', { networkId: String(networkTopology!.parentLayer!.parentChainId) })}>
														Chain {String(networkTopology!.parentLayer!.parentChainId)}
													</a>
												</p>
											</div>
										</section>
									{/if}
									{#if chainId !== undefined}
										<QueryBoundary
											query={bridgesPreviewQuery}
										>
											{#snippet children(bridgeRows)}
						{#if bridgeRows.some(({ value }) => value)}
													<section
														data-e2e="network-topology-bridges"
														data-scroll-marker-label="Bridges"
													>
														<NetworkBridgesView
															collapsible={false}
															entityFieldReference={{
																entityType: EntityType.Network,
																entityId,
																fieldName: '$$bridges',
															}}
															href={href}
															id={`${networkIdKey}:topology-bridges`}
														/>
													</section>
												{/if}
											{/snippet}
										</QueryBoundary>
									{/if}
									{#if showTopologyForks && chainId !== undefined}
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
									{#if showTopologySiblingShards}
										<section
											data-e2e="network-topology-sibling-shards"
											data-scroll-marker-label="Sibling shards"
										>
											<div
												class="entity-details"
												style:view-transition-name={`NetworkView-TopologySiblingShards-${networkIdKey}`}
											>
												<ul>
													{#each networkTopology!.siblingShardChainIds as sibChainId (sibChainId)}
														<li><a href={resolve('/(explore)/(networks)/network/[networkId]', { networkId: String(sibChainId) })}>Chain {String(sibChainId)}</a></li>
													{/each}
												</ul>
											</div>
										</section>
									{/if}
									{#if showTopologyMainnetTestnet}
										<section
											data-e2e="network-topology-mainnet-testnet"
											data-scroll-marker-label="Mainnet & testnet peers"
										>
											<div
												class="entity-details"
												style:view-transition-name={`NetworkView-TopologyMainnetTestnet-${networkIdKey}`}
											>
												<ul>
													{#each networkTopology!.correspondingChainIds as peerChainId (peerChainId)}
														<li><a href={resolve('/(explore)/(networks)/network/[networkId]', { networkId: String(peerChainId) })}>Chain {String(peerChainId)}</a></li>
													{/each}
												</ul>
											</div>
										</section>
									{/if}
									{#if showTopologyChildren && chainId !== undefined}
										<section
											data-e2e="network-topology-children"
											data-scroll-marker-label={childLayerNetworksTitleValue}
										>
											<NetworksView
												collapsible={false}
												entityFieldReference={{
													entityType: EntityType.Network,
													entityId,
													fieldName: '$$childNetworks',
												}}
												href={resolve('/(explore)/(networks)/network/[networkId]', { networkId: String(chainId) })}
												id={`${networkIdKey}:topology-children`}
												open={false}
												title={childLayerNetworksTitleValue}
											/>
										</section>
									{/if}
									{#if showTopologyFaucets}
										<section
											data-e2e="network-topology-faucets"
											data-scroll-marker-label="Faucets"
										>
											<div
												class="entity-details"
												style:view-transition-name={`NetworkView-TopologyFaucets-${networkIdKey}`}
											>
												<ul>
													{#each networkListMetadata.faucets as faucetUrl (faucetUrl)}
														<li>
															<button
																type="button"
																onclick={() => {
																	window.open(faucetUrl, '_blank', 'noopener,noreferrer')
																}}
															>
																{faucetUrl}
															</button>
														</li>
													{/each}
												</ul>
											</div>
										</section>
									{/if}
								</div>
							{/snippet}
						</Collapsible>
					{/if}
					{#if nativeCurrencies.length > 0 || chainId !== undefined}
						<Collapsible
							id={`${networkIdKey}:carousel-economics`}
							{...{ 'data-card': '' }}
							data-e2e="network-collapsible-economics"
						>
							{#snippet Summary({
								open: _open,
							})}
								<header
									data-row-item="flexible"
									data-row="wrap gap-4"
								>
									<HeadingComponent>
										Economics
									</HeadingComponent>
								</header>
							{/snippet}
							{#snippet children(_ctx)}
								<div
									class="carousel"
									data-scroll-container="inline layout-carousel carousel-marker-tabs"
									data-row="start align-start"
									data-e2e="network-carousel-economics"
								>
									{#if nativeCurrencies.length > 0}
										<section
											data-e2e="network-economics-native-currency"
											data-scroll-marker-label="Native currency"
										>
											<div class="entity-details">
												<ul>
													{#each nativeCurrencies as nativeCurrency (`${nativeCurrency.name}:${nativeCurrency.symbol}:${String(nativeCurrency.decimals)}:${String(nativeCurrency.coinId ?? '')}:${String(nativeCurrency.slip44 ?? '')}`)}
														<li>
															{nativeCurrency.name}
															({nativeCurrency.symbol}) ·
															<NumberValue value={nativeCurrency.decimals} />
															decimals
														</li>
													{/each}
												</ul>
											</div>
										</section>
									{/if}
									{#if chainId !== undefined}
										<section
											data-e2e="network-economics-gas"
											data-scroll-marker-label="Gas"
										>
											<div class="entity-details">
												<dl>
													<div>
														<dt>Gas price</dt>
														<dd>
															<QueryBoundary
																query={gasPriceQuery}
															>
																{#snippet children(gasPriceData)}
																	{@const gasPrice = typeof gasPriceData?.value === 'bigint' ? gasPriceData.value : undefined}
																	{#if gasPrice !== undefined}
																		<NumberValue value={gasPrice} /> wei
																	{:else}
																		—
																	{/if}
																{/snippet}
															</QueryBoundary>
														</dd>
													</div>
													<div>
														<dt>Latest base fee</dt>
														<dd>
															<QueryBoundary
																query={baseFeePerGasQuery}
															>
																{#snippet children(baseFeeData)}
																	{@const baseFeePerGas = typeof baseFeeData?.value === 'bigint' ? baseFeeData.value : undefined}
																	{#if baseFeePerGas !== undefined}
																		<NumberValue value={baseFeePerGas} /> wei
																	{:else}
																		—
																	{/if}
																{/snippet}
															</QueryBoundary>
														</dd>
													</div>
													<div>
														<dt>Latest gas used ratio</dt>
														<dd>
															<QueryBoundary
																query={gasUsedRatioQuery}
															>
																{#snippet children(gasUsedRatioData)}
																	{@const gasUsedRatio = typeof gasUsedRatioData?.value === 'number' ? gasUsedRatioData.value : undefined}
																	{#if gasUsedRatio !== undefined}
																		<NumberValue
																			value={gasUsedRatio}
																			options={{
																				maximumFractionDigits: 2,
																				style: 'percent',
																			}}
																		/>
																	{:else}
																		—
																	{/if}
																{/snippet}
															</QueryBoundary>
														</dd>
													</div>
												</dl>
											</div>
										</section>
										<QueryBoundary
											query={blockHeightQuery}
										>
											{#snippet children(blockHeightData)}
												{@const headBlockHeight = typeof blockHeightData?.height === 'bigint' ? blockHeightData.height : undefined}
												{@const headBlockEntityId = headBlockHeight === undefined ? undefined : { $network: { chainId }, blockNumber: headBlockHeight }}
												{#if headBlockEntityId !== undefined}
													<section
														data-e2e="network-economics-head-block"
														data-scroll-marker-label="Head block"
													>
														<div class="entity-details">
															<EvmBlockView
																entityId={headBlockEntityId}
																href={resolve(
																	'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
																	{
																		networkId: String(chainId),
																		blockNumber: String(headBlockHeight),
																	},
																)}
																layout={EntityLayout.Summary}
																open={false}
															/>
														</div>
													</section>
												{/if}
											{/snippet}
										</QueryBoundary>
									{/if}
								</div>
							{/snippet}
						</Collapsible>
					{/if}
					{#if chainId !== undefined}
						<Collapsible
							id={`${networkIdKey}:carousel-execution`}
							{...{ 'data-card': '' }}
							data-e2e="network-collapsible-execution"
						>
							{#snippet Summary({
								open: _open,
							})}
								<header
									data-row-item="flexible"
									data-row="wrap gap-4"
								>
									<HeadingComponent>Execution</HeadingComponent>
								</header>
							{/snippet}
							{#snippet children(_ctx)}
								<div
									class="carousel"
									data-scroll-container="inline layout-carousel carousel-marker-tabs"
									data-row="start align-start"
									data-e2e="network-carousel-execution"
								>
									<section data-e2e="network-carousel-blocks" data-scroll-marker-label="Blocks">
										<EvmBlocksView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$blocks',
											}}
											href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', {
												networkId: String(chainId),
											})}
											id={`${networkIdKey}:blocks`}
										/>
									</section>
									<section data-e2e="network-carousel-transactions" data-scroll-marker-label="Transactions">
										<EvmTransactionsView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$transactions',
											}}
											href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', {
												networkId: String(chainId),
											})}
											id={`${networkIdKey}:transactions`}
										/>
									</section>
									<section data-e2e="network-carousel-contracts" data-scroll-marker-label="Contracts">
										<EvmContractsView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$contracts',
											}}
											href={resolve('/(explore)/(networks)/network/[networkId]/(network)/contracts', {
												networkId: String(chainId),
											})}
											id={`${networkIdKey}:contracts`}
										/>
									</section>
									<section data-e2e="network-carousel-execution-rpcs" data-scroll-marker-label="Execution Providers">
										<div class="entity-details">
											{#if executionEndpointsByUrl.length > 0}
												<ul>
													{#each executionEndpointsByUrl as ep (ep.url)}
														<li>{ep.url} · {ep.transportType} · {ep.serviceProvider}</li>
													{/each}
												</ul>
											{/if}
										</div>
									</section>
									<section data-e2e="network-carousel-explorers" data-scroll-marker-label="Explorers">
										<div class="entity-details">
											{#if explorerHrefs.length > 0}
												<ul>
													{#each explorerHrefs as explorerHref (explorerHref)}
														<li>
															<button
																type="button"
																onclick={() => {
																	window.open(explorerHref, '_blank', 'noopener,noreferrer')
																}}
															>
																{explorerHref}
															</button>
														</li>
													{/each}
												</ul>
											{/if}
										</div>
									</section>
								</div>
							{/snippet}
						</Collapsible>
					{/if}
					{#if chainId !== undefined && hasBeaconDataForChainId(chainId)}
						<Collapsible
							id={`${networkIdKey}:carousel-consensus`}
							{...{ 'data-card': '' }}
							data-e2e="network-collapsible-consensus"
						>
							{#snippet Summary({
								open: _open,
							})}
								<header data-row-item="flexible" data-row="wrap gap-4">
									<HeadingComponent>Consensus</HeadingComponent>
								</header>
							{/snippet}
							{#snippet children(_ctx)}
								<div class="carousel" data-scroll-container="inline layout-carousel carousel-marker-tabs" data-row="start align-start" data-e2e="network-carousel-consensus">
									<section data-e2e="network-carousel-beacon-epochs" data-scroll-marker-label="Epochs">
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
									<section data-e2e="network-carousel-beacon-slots" data-scroll-marker-label="Slots">
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
					{/if}
					{#if chainId !== undefined}
						<Collapsible
							id={`${networkIdKey}:carousel-data-storage`}
							{...{ 'data-card': '' }}
							data-e2e="network-collapsible-data-storage"
						>
							{#snippet Summary({
								open: _open,
							})}
								<header data-row-item="flexible" data-row="wrap gap-4">
									<HeadingComponent>Data</HeadingComponent>
								</header>
							{/snippet}
							{#snippet children(_ctx)}
								<div class="carousel" data-scroll-container="inline layout-carousel carousel-marker-tabs" data-row="start align-start" data-e2e="network-carousel-data-storage">
									<section data-e2e="network-data-storage-blobs-list" data-scroll-marker-label="Recent EIP-4844 blobs">
										<EvmBlobsView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.Network,
												entityId,
												fieldName: '$$blobs',
											}}
											href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blobs', { networkId: String(chainId) })}
											id={`${networkIdKey}:data-storage-blobs`}
											title="Recent EIP-4844 blobs"
										/>
									</section>
								</div>
							{/snippet}
						</Collapsible>
					{/if}
				</div>
				{#if children}
					{@render children()}
				{/if}
			{/snippet}
		</QueryBoundary>
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
