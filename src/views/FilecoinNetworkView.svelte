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

	const filecoinNetwork = useEntity(entityCollectionsContext, EntityType.FilecoinNetwork,
		entityId,
		({ sources: [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			], fields: { $headTipset: true, $$timestamps: ({ limit: 1 }), rpcEndpoints: true } }),
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
	import FilecoinMinersView from '$/views/FilecoinMinersView.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
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
		<p>Filecoin models Expected Consensus tipsets, actors, miners, and storage-sector state.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<ResourceBoundary resource={filecoinNetwork}>
						{#snippet children(filecoinNetwork)}
							{#if filecoinNetwork.fields.$headTipset != null}
								<div>
									<dt>Head tipset</dt>
									<dd id="network-summary-head-block">
										<FilecoinTipsetView
											entityId={filecoinNetwork.fields.$headTipset[EntityMetaKey.Id]}
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
								<dt>Native assets</dt>
								<dd>{network.fields.$$nativeAssets?.values.length ?? 0}</dd>
							</div>
						{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-filecoin-chain`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'filecoin-tipsets', label: 'Tipsets' },
				{ id: 'filecoin-network-snapshots', label: 'Network snapshots' },
				{ id: 'filecoin-endpoints', label: 'Endpoints' },
			]}
			data-card
			class="network-view-collapsible-execution"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinTipsets({ id, label }: { id: string, label: string })}
				<FilecoinTipsetsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.FilecoinNetwork,
						entityId,
						fieldName: '$$tipsets',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionFilecoinNetworkSnapshots({ id, label }: { id: string, label: string })}
				<FilecoinNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.FilecoinNetwork,
						entityId,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionFilecoinEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['rpcEndpoints']}
					emptyText="No RPC endpoints listed for this network yet."
					fieldSources={[
						Source.Lotus_JsonRpc,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.FilecoinNetwork}
					parentEntityId={entityId}
					parentEntityType={EntityType.FilecoinNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-consensus`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'filecoin-miners', label: 'Miners' },
			]}
			data-card
			class="network-view-collapsible-consensus"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Consensus &amp; Storage Power</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinMiners({ id, label }: { id: string, label: string })}
				<FilecoinMinersView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.FilecoinNetwork,
						entityId,
						fieldName: '$$headMiners',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'filecoin-assets-native', label: 'Native coin' },
			]}
			data-card
			class="network-view-collapsible-assets"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinAssetsNative({ id, label }: { id: string, label: string })}
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
			id={`${networkIdKey}:carousel-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'filecoin-resources-faucets', label: 'Faucets' },
				{ id: 'filecoin-resources-block-explorers', label: 'Block explorers' },
			]}
			data-card
			class="network-view-collapsible-resources"
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFilecoinResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionFilecoinResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
