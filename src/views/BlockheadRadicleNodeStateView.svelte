<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleNodeState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadRadicleNodeState>>
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
	const titleFallback = $derived([String((selection.entitySelector.nodeId ?? prefetched.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead radicle node state')
	const viewDomId = $derived('blockhead-radicle-node-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadRadicleNodeState_TimestampsView from '$/views/BlockheadRadicleNodeState_TimestampsView.svelte'
	import BlockheadRadiclePeersView from '$/views/BlockheadRadiclePeersView.svelte'
	import BlockheadRadicleNodeInventory_TimestampsView from '$/views/BlockheadRadicleNodeInventory_TimestampsView.svelte'
	import BlockheadRadicleSeedObservation_TimestampsView from '$/views/BlockheadRadicleSeedObservation_TimestampsView.svelte'
	import BlockheadRadicleSyncSessionsView from '$/views/BlockheadRadicleSyncSessionsView.svelte'
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
				{[String((selection.entitySelector.nodeId ?? prefetched.nodeId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle node state'}
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
				{[String((prefetched.did) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.nodeId ?? prefetched.nodeId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle node state'}
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
				{@const connectionId0 = selection.entitySelector.connectionId ?? prefetched.connectionId}
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
							{@const connectionId = selection.entitySelector.connectionId ?? prefetched.connectionId}
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
							{@const nodeId = selection.entitySelector.nodeId ?? prefetched.nodeId}
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
					{@const did = prefetched.did}
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
					{@const publicKey = prefetched.publicKey}
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
					{@const homePath = prefetched.homePath}
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
			<BlockheadRadicleNodeState_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadRadicleNodeState_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Radicle node-state observations.'
				id='BlockheadRadicleNodeState_TimestampsView-$$timestamps'
			/>

			<BlockheadRadiclePeersView
				selection={selection[EntityProxyField]<EntityType.BlockheadRadiclePeer>('$$peers')}
				title='peers'
				emptyText='No peers.'
				id='BlockheadRadiclePeersView-$$peers'
			/>

			<BlockheadRadicleNodeInventory_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadRadicleNodeInventory_Timestamp>('$$inventoryTimestamps')}
				title='inventory timestamps'
				emptyText='No inventory observations.'
				id='BlockheadRadicleNodeInventory_TimestampsView-$$inventoryTimestamps'
			/>

			<BlockheadRadicleSeedObservation_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadRadicleSeedObservation_Timestamp>('$$seedObservations')}
				title='seed observations'
				emptyText='No seed observations.'
				id='BlockheadRadicleSeedObservation_TimestampsView-$$seedObservations'
			/>

			<BlockheadRadicleSyncSessionsView
				selection={selection[EntityProxyField]<EntityType.BlockheadRadicleSyncSession>('$$syncSessions')}
				title='sync sessions'
				emptyText='No sync sessions.'
				id='BlockheadRadicleSyncSessionsView-$$syncSessions'
			/>
		{/if}
	{/snippet}
</EntityView>
