<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadAvalancheNodeState_Timestamp>, 'prefetched'> = $props()

	const blockheadAvalancheNodeStateTimestamp = $derived(selection({
		fields: {
			nodeVersion: true,
			networkName: true,
			connectedPeerCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadAvalancheNodeStateView from '$/views/BlockheadAvalancheNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/avalanche/node-state/[nodeId=stringSegment]/(blockheadAvalancheNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					nodeId: selection.entitySelector.$nodeState.nodeId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAvalancheNodeStateTimestamp}>
			{#snippet children(entity)}
				{[(entity.nodeVersion ?? ''), (entity.networkName ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAvalancheNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const connectedPeerCount = entity.connectedPeerCount}
				{#if connectedPeerCount != null}
					<span data-text="muted">
						<NumberValue
							value={connectedPeerCount}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadAvalancheNodeStateView
						selection={select(EntityType.BlockheadAvalancheNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadAvalancheNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const networkName = entity.networkName}
					{#if networkName != null}
						<div>
							<dt>network name</dt>
							<dd>
								{networkName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadAvalancheNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const nodeVersion = entity.nodeVersion}
					{#if nodeVersion != null}
						<div>
							<dt>node version</dt>
							<dd>
								{nodeVersion}
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
				{#snippet children(entity)}
					{@const databaseVersion = entity.databaseVersion}
					{#if databaseVersion != null}
						<div>
							<dt>database version</dt>
							<dd>
								{databaseVersion}
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
				{#snippet children(entity)}
					{@const gitCommit = entity.gitCommit}
					{#if gitCommit != null}
						<div>
							<dt>Git commit</dt>
							<dd>
								{gitCommit}
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
				{#snippet children(entity)}
					{@const rpcProtocolVersion = entity.rpcProtocolVersion}
					{#if rpcProtocolVersion != null}
						<div>
							<dt>RPC protocol version</dt>
							<dd>
								{rpcProtocolVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadAvalancheNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const connectedPeerCount = entity.connectedPeerCount}
					{#if connectedPeerCount != null}
						<div>
							<dt>connected peer count</dt>
							<dd>
								<NumberValue
									value={connectedPeerCount}
								/>
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
				{#snippet children(entity)}
					{@const uptimePercent = entity.uptimePercent}
					{#if uptimePercent != null}
						<div>
							<dt>uptime percent</dt>
							<dd>
								<NumberValue
									value={uptimePercent}
								/>
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
				{#snippet children(entity)}
					{@const lastSyncedAt = entity.lastSyncedAt}
					{#if lastSyncedAt != null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={lastSyncedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
