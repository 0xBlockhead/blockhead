<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadRadicleNodeState>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadRadicleNodeState = $derived(viewSelection({
		fields: {
			did: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.nodeId || 'blockhead radicle node state')
	const viewDomId = $derived('blockhead-radicle-node-state-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadRadicleNodeState}>
			{#snippet children(entity)}
				{(entity.did ?? '') || selection.entitySelector.nodeId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.connectionId}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadRadicleNodeState}
			>
				{#snippet children(entity)}
					{@const did = entity.did}
					{#if did != null}
						<div>
							<dt>DID</dt>
							<dd>
								{did}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const publicKey = entity.publicKey}
					{#if publicKey != null}
						<div>
							<dt>public key</dt>
							<dd>
								{publicKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							homePath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const homePath = entity.homePath}
					{#if homePath != null}
						<div>
							<dt>home path</dt>
							<dd>
								{homePath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Network</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRadiclePeers({ id, label })}
				<BlockheadRadiclePeersView
					selection={selection.$$peers}
					collapsible={false}
					title={label}
					emptyText='No peers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionRadicleSyncSessions({ id, label })}
				<BlockheadRadicleSyncSessionsView
					selection={selection.$$syncSessions}
					collapsible={false}
					title={label}
					emptyText='No sync sessions.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Inventory and seeds</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRadicleInventory({ id, label })}
				<BlockheadRadicleNodeInventory_TimestampsView
					selection={selection.$$inventoryTimestamps}
					collapsible={false}
					title={label}
					emptyText='No inventory observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionRadicleSeeds({ id, label })}
				<BlockheadRadicleSeedObservation_TimestampsView
					selection={selection.$$seedObservations}
					collapsible={false}
					title={label}
					emptyText='No seed observations.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRadicleNodeTimestamps({ id, label })}
				<BlockheadRadicleNodeState_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Radicle node-state observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
