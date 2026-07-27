<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadAvalancheNodeState_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAvalancheNodeStateTimestamp = $derived(viewSelection({
		fields: {
			nodeVersion: true,
			networkName: true,
			connectedPeerCount: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'blockhead avalanche node state timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadAvalancheNodeStateView from '$/views/BlockheadAvalancheNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAvalancheNodeStateTimestamp}>
			{#snippet children(entity)}
				{[(entity.nodeVersion ?? ''), (entity.networkName ?? '')].filter(Boolean).join(' ') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAvalancheNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const connectedPeerCount0 = entity.connectedPeerCount}
				{#if connectedPeerCount0 != null}
					<span data-text="muted">
						<NumberValue
							value={connectedPeerCount0}
						/>
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
						selection={select(EntityType.BlockheadAvalancheNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
