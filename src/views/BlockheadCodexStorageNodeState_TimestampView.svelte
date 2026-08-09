<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadCodexStorageNodeState_Timestamp>, 'prefetched'> = $props()

	const nodeState = $derived(selection.entitySelector.$nodeState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadCodexStorageNodeStateTimestamp = $derived(viewSelection({
		fields: {
			version: true,
			peerCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadCodexStorageNodeStateView from '$/views/BlockheadCodexStorageNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/codex/connection/[connectionId=stringSegment]/node/[peerId=stringSegment]/(blockheadCodexStorageNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					connectionId: nodeState.connectionId,
					peerId: nodeState.peerId,
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
		<ResourceBoundary resource={blockheadCodexStorageNodeStateTimestamp}>
			{#snippet children(entity)}
				{(entity.version ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStorageNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const peerCount = entity.peerCount}
				{#if peerCount != null}
					<span data-text="muted">
						<NumberValue
							value={peerCount}
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
					<BlockheadCodexStorageNodeStateView
						selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
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
				resource={blockheadCodexStorageNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							revision: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revision = entity.revision}
					{#if revision != null}
						<div>
							<dt>revision</dt>
							<dd>
								{revision}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							repoPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const repoPath = entity.repoPath}
					{#if repoPath != null}
						<div>
							<dt>repo path</dt>
							<dd>
								{repoPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>listen addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									listenAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.listenAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>announce addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									announceAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.announceAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadCodexStorageNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue
									value={peerCount}
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
							totalBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalBlocks = entity.totalBlocks}
					{#if totalBlocks != null}
						<div>
							<dt>total blocks</dt>
							<dd>
								<NumberValue
									value={totalBlocks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quotaMaxBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quotaMaxBytes = entity.quotaMaxBytes}
					{#if quotaMaxBytes != null}
						<div>
							<dt>quota max bytes</dt>
							<dd>
								<NumberValue
									value={quotaMaxBytes}
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
							quotaUsedBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quotaUsedBytes = entity.quotaUsedBytes}
					{#if quotaUsedBytes != null}
						<div>
							<dt>quota used bytes</dt>
							<dd>
								<NumberValue
									value={quotaUsedBytes}
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
							quotaReservedBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quotaReservedBytes = entity.quotaReservedBytes}
					{#if quotaReservedBytes != null}
						<div>
							<dt>quota reserved bytes</dt>
							<dd>
								<NumberValue
									value={quotaReservedBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
