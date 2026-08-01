<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadRadiclePeer>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadRadiclePeer = $derived(viewSelection({
		fields: {
			connectionKind: true,
			remoteAlias: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.peerNodeId || 'blockhead radicle peer')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadiclePeer}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadRadiclePeer}>
			{#snippet children(entity)}
				{(entity.connectionKind ?? '') || selection.entitySelector.peerNodeId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadRadiclePeer}>
			{#snippet children(entity)}
				{@const remoteAlias = entity.remoteAlias}
				{#if remoteAlias != null}
					<span data-text="muted">
						{remoteAlias}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node</dt>
				<dd>
					<BlockheadRadicleNodeStateView
						selection={select(EntityType.BlockheadRadicleNodeState, selection.entitySelector.$node)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>peer node ID</dt>
				<dd>
					{selection.entitySelector.peerNodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadRadiclePeer}
			>
				{#snippet children(entity)}
					{@const connectionKind = entity.connectionKind}
					{#if connectionKind != null}
						<div>
							<dt>connection kind</dt>
							<dd>
								{connectionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									addresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.addresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastSeenMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSeenMs = entity.lastSeenMs}
					{#if lastSeenMs != null}
						<div>
							<dt>last seen ms</dt>
							<dd>
								<Timestamp timestamp={lastSeenMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadRadiclePeer}
			>
				{#snippet children(entity)}
					{@const remoteAlias = entity.remoteAlias}
					{#if remoteAlias != null}
						<div>
							<dt>remote alias</dt>
							<dd>
								{remoteAlias}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							remoteDid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const remoteDid = entity.remoteDid}
					{#if remoteDid != null}
						<div>
							<dt>remote DID</dt>
							<dd>
								{remoteDid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
