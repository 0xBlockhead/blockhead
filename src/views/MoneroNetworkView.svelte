<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
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

	const network = useEntity(entityCollectionsContext, EntityType.Network,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { slug: true, name: true, environment: true, $$nativeAssets: true } }),
	)

	const moneroNetwork = useEntity(entityCollectionsContext, EntityType.MoneroNetwork,
		entityId,
		({ sources: [
				Source.MoneroDaemonRpc_JsonRpc,
			], fields: { rpcEndpoints: true, $$blocks: ({ limit: 1 }), $$timestamps: ({ limit: 1 }) } }),
	)


	// (Derived)
	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
	import NetworkTransportEndpointsView from '$/views/NetworkTransportEndpointsView.svelte'
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
				<span>{network.fields.slug}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				{network.fields.name}
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
								{@const block = moneroNetwork.fields.$$blocks?.values.at(0)}
								{#if block != null}
									<div>
										<dt>Head block</dt>
										<dd id="network-summary-head-block">
											<MoneroBlockView
												entityId={block[EntityMetaKey.Id]}
												layout={EntityLayout.Value}
											/>
										</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
					</div>

						{#if (network.fields.$$nativeAssets?.values.length ?? 0) > 0}
							<div>
								<dt>Native asset</dt>
								<dd>{network.fields.$$nativeAssets?.values.length ?? 0}</dd>
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

			{#snippet SectionMoneroEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['rpcEndpoints']}
					emptyText="No RPC endpoints listed for this network yet."
					fieldSources={[
						Source.MoneroDaemonRpc_JsonRpc,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.MoneroNetwork}
					parentEntityId={entityId}
					parentEntityType={EntityType.MoneroNetwork}
					title={label}
				/>
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
				<AssetInstancesView
			CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$nativeAssets',
					}}
					id={`${id}-list`}
					title={label}
				/>
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
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
