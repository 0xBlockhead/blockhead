<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			environment: {},
			$$executionEnvironments: {},
			$$consensusMechanisms: {},
			$$nativeAssets: {},
		},
	)

	const zeroGNetwork = useEntity(
		EntityType.ZeroGNetwork,
		{
			networkSlug: '0g',
		},
		{
			$: [
				Source.Constants_Internal,
				Source.ZeroGChain_JsonRpc,
				Source.ZeroGChainScan_Rest,
				Source.ZeroGStorageScan_Rest,
			],
			rpcEndpoints: {},
			storageEndpoints: {},
			$headBlock: {},
			$consensusNetwork: {},
			$$timestamps: {
				$limit: 1,
			},
		},
	)

	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
	import ZeroGBlocksView from '$/views/ZeroGBlocksView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
	import ZeroGDataBlobsView from '$/views/ZeroGDataBlobsView.svelte'
	import ZeroGNetwork_TimestampsView from '$/views/ZeroGNetwork_TimestampsView.svelte'
	import ZeroGStorageNodesView from '$/views/ZeroGStorageNodesView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				<span>{network.name}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				{network.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>0G combines an EVM-compatible execution chain with consensus, data availability, storage, key-value, and serving layers.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={zeroGNetwork}>
						{#snippet children(zeroGNetwork)}
							{#if zeroGNetwork.$headBlock != null}
								<div>
									<dt>Head block</dt>
									<dd id="network-summary-head-block">
										<EvmBlockView
											entityId={zeroGNetwork.$headBlock[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Environment</dt>
						<dd>{network.environment}</dd>
					</div>

					{#if network.$$nativeAssets.length > 0}
						<div>
							<dt>Native asset</dt>
							<dd>{network.$$nativeAssets.length}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={`${networkIdKey}:carousel-0g`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: '0g-blocks', label: 'Blocks' },
				{ id: '0g-snapshots', label: 'Network snapshots' },
				{ id: '0g-consensus', label: 'Consensus' },
				{ id: '0g-endpoints', label: 'Endpoints' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet Section0gBlocks({ id, label }: { id: string, label: string })}
				<ZeroGBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.ZeroGNetwork,
						entityId: {
							networkSlug: '0g',
						},
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet Section0gSnapshots({ id, label }: { id: string, label: string })}
				<ZeroGNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.ZeroGNetwork,
						entityId: {
							networkSlug: '0g',
						},
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet Section0gConsensus()}
				<ResourceBoundary resource={zeroGNetwork}>
					{#snippet children(zeroGNetwork)}
						{#if zeroGNetwork.$consensusNetwork != null}
							<ZeroGConsensusNetworkView
								entityId={zeroGNetwork.$consensusNetwork[EntityMetaKey.Id]}
								layout={EntityLayout.SummaryDetails}
							/>
						{:else}
							<p data-text="muted">No consensus network mapped yet.</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet Section0gEndpoints()}
				<ResourceBoundary resource={zeroGNetwork}>
					{#snippet children(zeroGNetwork)}
						{#each zeroGNetwork.rpcEndpoints as endpoint}
							<p><strong>{endpoint.transportType}:</strong> {endpoint.url}</p>
						{/each}

						{#each zeroGNetwork.storageEndpoints as endpoint}
							<p><strong>{endpoint.transportType}:</strong> {endpoint.url}</p>
						{/each}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-0g-data`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: '0g-data-blobs', label: 'Data blobs' },
				{ id: '0g-storage-nodes', label: 'Storage nodes' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Data & Storage</HeadingComponent>
				</header>
			{/snippet}

			{#snippet Section0gDataBlobs({ id, label }: { id: string, label: string })}
				<ZeroGDataBlobsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.ZeroGNetwork,
						entityId: {
							networkSlug: '0g',
						},
						fieldName: '$$dataBlobs',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet Section0gStorageNodes({ id, label }: { id: string, label: string })}
				<ZeroGStorageNodesView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.ZeroGNetwork,
						entityId: {
							networkSlug: '0g',
						},
						fieldName: '$$storageNodes',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-0g-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: '0g-assets-native', label: 'Native coin' },
			]}
			data-card
			class="network-view-collapsible-assets"
			scrollContainerProps={{ 'data-row': 'start align-start' }}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet Section0gAssetsNative({ id, label }: { id: string, label: string })}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.AssetInstance}
							getKey={(asset) => `${asset[EntityMetaKey.Id].kind}:${asset[EntityMetaKey.Id].assetKey}`}
							id={`${id}-list`}
							items={network.$$nativeAssets}
							title={label}
							UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Empty()}
								<p data-text="muted">No native assets mapped for this network yet.</p>
							{/snippet}
							{#snippet Item(context)}
								<AssetInstanceView entityId={context!.item[EntityMetaKey.Id]} layout={EntityLayout.Summary} open={false} />
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-0g-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: '0g-resources-faucets', label: 'Faucets' },
				{ id: '0g-resources-block-explorers', label: 'Block explorers' },
			]}
			data-card
			class="network-view-collapsible-resources"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet Section0gResourcesFaucets({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No faucets listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$faucetUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					limit={undefined}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet Section0gResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$blockExplorerUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					limit={undefined}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
