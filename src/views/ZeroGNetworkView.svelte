<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ZeroGNetwork> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const zeroGNetwork = $derived(viewSelection({
		fields: {
			name: true,
			namespace: true,
			environment: true,
			chainId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.name ?? '') || 'zero g network')
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
		{(pendingEntity.slug ?? '') || (pendingEntity.name ?? '') || titleFallback}
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Slug</dt>
				<dd>
					{pendingEntity.slug}
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
									open={false}
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
									prefetched={zeroGConsensusNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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

			{#snippet SectionZerogNetworkObservations({ id, label, open })}
				<ZeroGNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
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

			{#snippet SectionZerogStorageNodes({ id, label, open })}
				<ZeroGStorageNodesView
					selection={selection.$$storageNodes}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No 0G storage nodes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZerogDataBlobs({ id, label, open })}
				<ZeroGDataBlobsView
					selection={selection.$$dataBlobs}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No 0G data blobs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZerogKvEntries({ id, label, open })}
				<ZeroGKvEntriesView
					selection={selection.$$kvEntries}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
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

			{#snippet SectionZerogDaQuorums({ id, label, open })}
				<ZeroGDaQuorumsView
					selection={selection.$$daQuorums}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No 0G DA quorums.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZerogDaNodes({ id, label, open })}
				<ZeroGDaNodesView
					selection={selection.$$daNodes}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
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

			{#snippet SectionZerogServiceProviderList({ id, label, open })}
				<ZeroGServiceProvidersView
					selection={selection.$$serviceProviders}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No 0G service providers.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
