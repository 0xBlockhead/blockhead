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
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.NearNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = subscribe(EntityType.NearNetwork,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { slug: true, name: true, environment: true, rpcEndpoints: true, $$blocks: ({ limit: 1 }), $$timestamps: ({ limit: 1 }) } }),
	)

	const baseNetwork = subscribe(EntityType.Network,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { $$nativeAssets: true } }),
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
	import NearBlockView from '$/views/NearBlockView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import NearNetwork_TimestampsView from '$/views/NearNetwork_TimestampsView.svelte'
	import NearValidatorsView from '$/views/NearValidatorsView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork}
	{entityId}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span>{entityId.networkSlug}</span>
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
		<p>NEAR models Nightshade sharding, account IDs, access keys, receipts, chunks, and execution outcomes.</p>
	{/snippet}

	{#snippet Content({ open })}
			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					{@const block = network.fields.$$blocks?.values.at(0)}
					<dl class="network-summary-head" data-column-item="center">
						{#if block != null}
							<div>
								<dt>Head block</dt>
								<dd id="network-summary-head-block">
									<NearBlockView
										entityId={block[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
									/>
								</dd>
						</div>
					{/if}

					<div>
						<dt>Environment</dt>
						<dd>{networkEnvironmentByEnvironment[network.fields.environment].label}</dd>
					</div>

					{#if open}
						<div>
							<dt>RPC endpoints</dt>
							<dd>{network.fields.rpcEndpoints?.values.length ?? 0}</dd>
						</div>
					{/if}

						<ResourceBoundary resource={baseNetwork}>
							{#snippet children(baseNetwork)}
								{@const nativeAssetCount = baseNetwork.fields.$$nativeAssets?.values.length ?? 0}
								{#if nativeAssetCount > 0}
									<div>
										<dt>Native asset</dt>
										<dd>{nativeAssetCount}</dd>
									</div>
								{/if}
							{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-near`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'near-blocks', label: 'Blocks' },
				{ id: 'near-snapshots', label: 'Network snapshots' },
				{ id: 'near-validators', label: 'Validators' },
				{ id: 'near-endpoints', label: 'Endpoints' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>NEAR</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNearBlocks({ id, label }: { id: string, label: string })}
				<NearBlocksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.NearNetwork,
						entityId,
						fieldName: '$$blocks',
					}}
					href={href == null ? '' : `${href}/blocks`}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionNearSnapshots({ id, label }: { id: string, label: string })}
				<NearNetwork_TimestampsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.NearNetwork,
						entityId,
						fieldName: '$$timestamps',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionNearValidators({ id, label }: { id: string, label: string })}
				<NearValidatorsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.NearNetwork,
						entityId,
						fieldName: '$$validators',
					}}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionNearEndpoints({ id, label }: { id: string, label: string })}
				<NetworkTransportEndpointsView
					CollapsibleProps={{ canToggle: false }}
					endpointFieldNames={['rpcEndpoints']}
					emptyText="No RPC endpoints listed for this network yet."
					fieldSources={[
						Source.Constants_Internal,
					]}
					id={`${id}-list`}
					listEntityType={EntityType.NearNetwork}
					parentEntityId={entityId}
					parentEntityType={EntityType.NearNetwork}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-near-assets`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'near-assets-native', label: 'Native coin' },
			]}
			data-card
			class="network-view-collapsible-assets"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNearAssetsNative({ id, label }: { id: string, label: string })}
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
			id={`${networkIdKey}:carousel-near-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'near-resources-faucets', label: 'Faucets' },
				{ id: 'near-resources-block-explorers', label: 'Block explorers' },
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

			{#snippet SectionNearResourcesFaucets({ id, label }: { id: string, label: string })}
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

			{#snippet SectionNearResourcesBlockExplorers({ id, label }: { id: string, label: string })}
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
