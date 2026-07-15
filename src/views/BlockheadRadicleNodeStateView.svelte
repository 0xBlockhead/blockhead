<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadRadicleNodeState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadRadicleNodeState>>
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
	const blockheadRadicleNodeState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			did: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead radicle node state')
	const viewDomId = $derived('blockhead-radicle-node-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadRadiclePeersView from '$/views/BlockheadRadiclePeersView.svelte'
	import BlockheadRadicleSyncSessionsView from '$/views/BlockheadRadicleSyncSessionsView.svelte'
	import BlockheadRadicleNodeInventory_TimestampsView from '$/views/BlockheadRadicleNodeInventory_TimestampsView.svelte'
	import BlockheadRadicleSeedObservation_TimestampsView from '$/views/BlockheadRadicleSeedObservation_TimestampsView.svelte'
	import BlockheadRadicleNodeState_TimestampsView from '$/views/BlockheadRadicleNodeState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadicleNodeState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadRadicleNodeState}>
			{#snippet Pending()}
				{[String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle node state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadRadicleNodeState}>
			{#snippet Pending()}
				{[String((pendingEntity.did) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle node state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.did) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.nodeId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadRadicleNodeState}>
			{#snippet Pending()}
				{@const connectionId0 = pendingEntity.connectionId}
				{#if connectionId0 !== undefined && connectionId0 !== null}
					<span data-text="muted">
						{String((connectionId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const connectionId0 = resolvedEntity.connectionId}
				{#if connectionId0 !== undefined && connectionId0 !== null}
					<span data-text="muted">
						{String((connectionId0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const connectionId = pendingEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const nodeId = pendingEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nodeId = resolvedEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							did: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const did = pendingEntity.did}
					{#if did !== undefined && did !== null}
						<div>
							<dt>DID</dt>
							<dd>
								{String((did) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const did = resolvedEntity.did}
					{#if did !== undefined && did !== null}
						<div>
							<dt>DID</dt>
							<dd>
								{String((did) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publicKey = pendingEntity.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicKey = resolvedEntity.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							homePath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const homePath = pendingEntity.homePath}
					{#if homePath !== undefined && homePath !== null}
						<div>
							<dt>home path</dt>
							<dd>
								{String((homePath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const homePath = resolvedEntity.homePath}
					{#if homePath !== undefined && homePath !== null}
						<div>
							<dt>home path</dt>
							<dd>
								{String((homePath) ?? '')}
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
				id={viewDomId + '-carousel-radicle-node-network'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'radicle-peers',
							label: 'Peers',
						},
						{
							id: 'radicle-sync-sessions',
							label: 'Sync sessions',
						},
					]
				}
				data-card
				class='network-view-collapsible-network'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Network</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRadiclePeers({ id, label, open })}
					<BlockheadRadiclePeersView
						selection={
							selection.$$peers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No peers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRadicleSyncSessions({ id, label, open })}
					<BlockheadRadicleSyncSessionsView
						selection={
							selection.$$syncSessions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No sync sessions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-radicle-node-inventory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'radicle-inventory',
							label: 'Inventory',
						},
						{
							id: 'radicle-seeds',
							label: 'Seed observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-inventory'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Inventory and seeds</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRadicleInventory({ id, label, open })}
					<BlockheadRadicleNodeInventory_TimestampsView
						selection={
							selection.$$inventoryTimestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No inventory observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRadicleSeeds({ id, label, open })}
					<BlockheadRadicleSeedObservation_TimestampsView
						selection={
							selection.$$seedObservations({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No seed observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-radicle-node-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'radicle-node-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRadicleNodeTimestamps({ id, label, open })}
					<BlockheadRadicleNodeState_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Radicle node-state observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
