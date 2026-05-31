<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
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
			slug: {},
			name: {},
			environment: {},
			$$nativeAssets: {},
		},
	)

	const moneroNetwork = useEntity(
		EntityType.MoneroNetwork,
		entityId,
		{
			$: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			rpcEndpoints: {},
			$headBlock: {},
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
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
	import MoneroBlocksView from '$/views/MoneroBlocksView.svelte'
	import MoneroNetwork_TimestampsView from '$/views/MoneroNetwork_TimestampsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
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
				<span>{network.slug}</span>
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
		<p>Monero models privacy-preserving proof-of-work state using ring signatures, stealth addresses, key images, and RandomX.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={moneroNetwork}>
						{#snippet children(moneroNetwork)}
							{#if moneroNetwork.$headBlock != null}
								<div>
									<dt>Head block</dt>
									<dd id="network-summary-head-block">
										<MoneroBlockView
											entityId={moneroNetwork.$headBlock[EntityMetaKey.Id]}
											layout={EntityLayout.Value}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.environment].label}</dd>
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
			id={`${networkIdKey}:carousel-monero`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'monero-blocks', label: 'Blocks' },
				{ id: 'monero-snapshots', label: 'Network snapshots' },
				{ id: 'monero-endpoints', label: 'Endpoints' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Monero</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMoneroBlocks({ id, label }: { id: string, label: string })}
				<MoneroBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.MoneroNetwork,
						entityId,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionMoneroSnapshots({ id, label }: { id: string, label: string })}
				<MoneroNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.MoneroNetwork,
						entityId,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionMoneroEndpoints()}
				<ResourceBoundary resource={moneroNetwork}>
					{#snippet children(moneroNetwork)}
						{#each moneroNetwork.rpcEndpoints as endpoint}
							<p><strong>{endpoint.transportType}:</strong> {endpoint.url}</p>
						{:else}
							<p data-text="muted">No RPC endpoints listed for this network yet.</p>
						{/each}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-monero-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'monero-assets-native', label: 'Native coin' },
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

			{#snippet SectionMoneroAssetsNative({ id, label }: { id: string, label: string })}
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
			id={`${networkIdKey}:carousel-monero-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'monero-resources-faucets', label: 'Faucets' },
				{ id: 'monero-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionMoneroResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionMoneroResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
