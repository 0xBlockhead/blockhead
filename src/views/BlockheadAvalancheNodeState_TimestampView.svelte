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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadAvalancheNodeState_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadAvalancheNodeState_Timestamp>>
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
	const blockheadAvalancheNodeStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			nodeVersion: true,
			networkName: true,
			connectedPeerCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead avalanche node state timestamp')
	const viewDomId = $derived('blockhead-avalanche-node-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadAvalancheNodeStateView from '$/views/BlockheadAvalancheNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAvalancheNodeStateTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAvalancheNodeStateTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.nodeVersion) ?? ''), String((pendingEntity.networkName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead avalanche node state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.nodeVersion) ?? ''), String((resolvedEntity.networkName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAvalancheNodeStateTimestamp}>
			{#snippet Pending()}
				{@const connectedPeerCount0 = pendingEntity.connectedPeerCount}
				{#if connectedPeerCount0 !== undefined && connectedPeerCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(connectedPeerCount0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const connectedPeerCount0 = resolvedEntity.connectedPeerCount}
				{#if connectedPeerCount0 !== undefined && connectedPeerCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(connectedPeerCount0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadAvalancheNodeStateView
						selection={select(EntityType.BlockheadAvalancheNodeState, selection.entitySelector.$nodeState, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							networkName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const networkName = pendingEntity.networkName}
					{#if networkName !== undefined && networkName !== null}
						<div>
							<dt>network name</dt>
							<dd>
								{String((networkName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkName = resolvedEntity.networkName}
					{#if networkName !== undefined && networkName !== null}
						<div>
							<dt>network name</dt>
							<dd>
								{String((networkName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeVersion = pendingEntity.nodeVersion}
					{#if nodeVersion !== undefined && nodeVersion !== null}
						<div>
							<dt>node version</dt>
							<dd>
								{String((nodeVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeVersion = resolvedEntity.nodeVersion}
					{#if nodeVersion !== undefined && nodeVersion !== null}
						<div>
							<dt>node version</dt>
							<dd>
								{String((nodeVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							databaseVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const databaseVersion = pendingEntity.databaseVersion}
					{#if databaseVersion !== undefined && databaseVersion !== null}
						<div>
							<dt>database version</dt>
							<dd>
								{String((databaseVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const databaseVersion = resolvedEntity.databaseVersion}
					{#if databaseVersion !== undefined && databaseVersion !== null}
						<div>
							<dt>database version</dt>
							<dd>
								{String((databaseVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gitCommit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gitCommit = pendingEntity.gitCommit}
					{#if gitCommit !== undefined && gitCommit !== null}
						<div>
							<dt>Git commit</dt>
							<dd>
								{String((gitCommit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gitCommit = resolvedEntity.gitCommit}
					{#if gitCommit !== undefined && gitCommit !== null}
						<div>
							<dt>Git commit</dt>
							<dd>
								{String((gitCommit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rpcProtocolVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rpcProtocolVersion = pendingEntity.rpcProtocolVersion}
					{#if rpcProtocolVersion !== undefined && rpcProtocolVersion !== null}
						<div>
							<dt>RPC protocol version</dt>
							<dd>
								{String((rpcProtocolVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rpcProtocolVersion = resolvedEntity.rpcProtocolVersion}
					{#if rpcProtocolVersion !== undefined && rpcProtocolVersion !== null}
						<div>
							<dt>RPC protocol version</dt>
							<dd>
								{String((rpcProtocolVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							connectedPeerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const connectedPeerCount = pendingEntity.connectedPeerCount}
					{#if connectedPeerCount !== undefined && connectedPeerCount !== null}
						<div>
							<dt>connected peer count</dt>
							<dd>
								<NumberValue value={Number(connectedPeerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const connectedPeerCount = resolvedEntity.connectedPeerCount}
					{#if connectedPeerCount !== undefined && connectedPeerCount !== null}
						<div>
							<dt>connected peer count</dt>
							<dd>
								<NumberValue value={Number(connectedPeerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							uptimePercent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const uptimePercent = pendingEntity.uptimePercent}
					{#if uptimePercent !== undefined && uptimePercent !== null}
						<div>
							<dt>uptime percent</dt>
							<dd>
								<NumberValue value={Number(uptimePercent)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uptimePercent = resolvedEntity.uptimePercent}
					{#if uptimePercent !== undefined && uptimePercent !== null}
						<div>
							<dt>uptime percent</dt>
							<dd>
								<NumberValue value={Number(uptimePercent)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSyncedAt = pendingEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSyncedAt = resolvedEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
