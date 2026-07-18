<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.ZeroGNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ZeroGNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const zeroGNetwork = $derived(selection({
		sources: selection.sources,
		fields: {
			name: true,
			namespace: true,
			environment: true,
			chainId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'zero g network')
	const viewDomId = $derived('zero-gnetwork-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={zeroGNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.slug) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={zeroGNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.slug) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const environment0 = pendingEntity.environment}
			{#if environment0 !== undefined && environment0 !== null}
				<span data-text="muted">
					{String((environment0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={zeroGNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const environment0 = resolvedEntity.environment}
					{#if environment0 !== undefined && environment0 !== null}
						<span data-text="muted">
							{String((environment0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Slug</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									slug: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slug = resolvedEntity.slug}
							{#if slug !== undefined && slug !== null}
								{String((slug) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const name = resolvedEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									namespace: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const namespace = resolvedEntity.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>environment</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									environment: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const environment = resolvedEntity.environment}
							{#if environment !== undefined && environment !== null}
								{String((environment) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									chainId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const chainId = resolvedEntity.chainId}
							{#if chainId !== undefined && chainId !== null}
								<NumberValue
									value={chainId}
								/>
							{/if}
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
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>execution network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : undefined)
									}
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
					{#if zeroGConsensusNetwork != null && zeroGConsensusNetwork[EntityMetaKey.Selector] != null}
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
		{#if detailsOpen}
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
						emptyText='No 0G network observations.'
						open={open}
						title={label}
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
						emptyText='No 0G storage nodes.'
						open={open}
						title={label}
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
						emptyText='No 0G data blobs.'
						open={open}
						title={label}
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
						emptyText='No 0G KV entries.'
						open={open}
						title={label}
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
						emptyText='No 0G DA quorums.'
						open={open}
						title={label}
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
						emptyText='No 0G DA nodes.'
						open={open}
						title={label}
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
						emptyText='No 0G service providers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
