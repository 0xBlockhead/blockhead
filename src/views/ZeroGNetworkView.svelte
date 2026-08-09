<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ZeroGNetwork> = $props()

	const zeroGNetwork = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			namespace: true,
			environment: true,
			chainId: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'zero g network')
	const viewDomId = $derived('zero-gnetwork-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
	import ZeroGNetwork_TimestampsView from '$/views/ZeroGNetwork_TimestampsView.svelte'
	import ZeroGStorageNodesView from '$/views/ZeroGStorageNodesView.svelte'
	import ZeroGDataBlobsView from '$/views/ZeroGDataBlobsView.svelte'
	import ZeroGKvEntriesView from '$/views/ZeroGKvEntriesView.svelte'
	import ZeroGDaQuorumsView from '$/views/ZeroGDaQuorumsView.svelte'
	import ZeroGDaNodesView from '$/views/ZeroGDaNodesView.svelte'
	import ZeroGServiceProvidersView from '$/views/ZeroGServiceProvidersView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/zerog/[slug=stringSegment]',
				{
					slug: selection.entitySelector.slug,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zeroGNetwork}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.slug || (prefetched.name ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGNetwork}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.environment}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Slug</dt>
				<dd>
					{selection.entitySelector.slug}
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={zeroGNetwork}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={zeroGNetwork}
					>
						{#snippet children(entity)}
							{entity.namespace}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>environment</dt>
				<dd>
					<ResourceBoundary
						resource={zeroGNetwork}
					>
						{#snippet children(entity)}
							{entity.environment}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
					<ResourceBoundary
						resource={zeroGNetwork}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.chainId}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$executionNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>execution network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$consensusNetwork}
			>
				{#snippet children(zeroGConsensusNetwork)}
					{#if zeroGConsensusNetwork != null}
						<div>
							<dt>consensus network</dt>
							<dd>
								<ZeroGConsensusNetworkView
									selection={select(EntityType.ZeroGConsensusNetwork, zeroGConsensusNetwork[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-zerog-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zerog-network-observations',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZerogNetworkObservations({ id, label })}
				<ZeroGNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No 0G network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-zerog-storage'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zerog-storage-nodes',
						label: 'Storage nodes',
					},
					{
						id: 'zerog-data-blobs',
						label: 'Data blobs',
					},
					{
						id: 'zerog-kv-entries',
						label: 'KV entries',
					},
				]
			}
			data-card
			class='network-view-collapsible-storage'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Storage</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZerogStorageNodes({ id, label })}
				<ZeroGStorageNodesView
					selection={selection.$$storageNodes}
					collapsible={false}
					title={label}
					emptyText='No 0G storage nodes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZerogDataBlobs({ id, label })}
				<ZeroGDataBlobsView
					selection={selection.$$dataBlobs}
					collapsible={false}
					title={label}
					emptyText='No 0G data blobs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZerogKvEntries({ id, label })}
				<ZeroGKvEntriesView
					selection={selection.$$kvEntries}
					collapsible={false}
					title={label}
					emptyText='No 0G KV entries.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-zerog-data-availability'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zerog-da-quorums',
						label: 'DA quorums',
					},
					{
						id: 'zerog-da-nodes',
						label: 'DA nodes',
					},
				]
			}
			data-card
			class='network-view-collapsible-data-availability'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Data availability</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZerogDaQuorums({ id, label })}
				<ZeroGDaQuorumsView
					selection={selection.$$daQuorums}
					collapsible={false}
					title={label}
					emptyText='No 0G DA quorums.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZerogDaNodes({ id, label })}
				<ZeroGDaNodesView
					selection={selection.$$daNodes}
					collapsible={false}
					title={label}
					emptyText='No 0G DA nodes.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-zerog-service-providers'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zerog-service-provider-list',
						label: 'Service providers',
					},
				]
			}
			data-card
			class='network-view-collapsible-service-providers'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Service providers</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZerogServiceProviderList({ id, label })}
				<ZeroGServiceProvidersView
					selection={selection.$$serviceProviders}
					collapsible={false}
					title={label}
					emptyText='No 0G service providers.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
