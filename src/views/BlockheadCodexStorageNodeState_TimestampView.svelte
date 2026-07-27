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
	}: EntitySelectionViewProps<EntityType.BlockheadCodexStorageNodeState_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'blockhead codex storage node state timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCodexStorageNodeStateView from '$/views/BlockheadCodexStorageNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
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
		<ResourceBoundary resource={blockheadCodexStorageNodeStateTimestamp}>
			{#snippet children(entity)}
				{(entity.version ?? '') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStorageNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const peerCount0 = entity.peerCount}
				{#if peerCount0 != null}
					<span data-text="muted">
						<NumberValue
							value={peerCount0}
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
					<BlockheadCodexStorageNodeStateView
						selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
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
							<TruncatedValue value={entity.listenAddresses.values.join(', ')} />
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
							<TruncatedValue value={entity.announceAddresses.values.join(', ')} />
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
