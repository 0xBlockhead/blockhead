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
	}: EntitySelectionViewProps<EntityType.BlockheadZeroGStorageNodeState_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))
	const blockheadZeroGStorageNodeStateTimestamp = $derived(viewSelection({
		fields: {
			localChunkCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZeroGStorageNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<BlockheadZeroGStorageNodeStateView
			selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZeroGStorageNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const localChunkCount = entity.localChunkCount}
				{#if localChunkCount != null}
					<span data-text="muted">
						<NumberValue
							value={localChunkCount}
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
					<BlockheadZeroGStorageNodeStateView
						selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState)}
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
				resource={
					viewSelection({
						fields: {
							syncedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const syncedAt = entity.syncedAt}
					{#if syncedAt != null}
						<div>
							<dt>synced AT</dt>
							<dd>
								<Timestamp timestamp={syncedAt} />
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
							localFileCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const localFileCount = entity.localFileCount}
					{#if localFileCount != null}
						<div>
							<dt>local file count</dt>
							<dd>
								<NumberValue
									value={localFileCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadZeroGStorageNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const localChunkCount = entity.localChunkCount}
					{#if localChunkCount != null}
						<div>
							<dt>local chunk count</dt>
							<dd>
								<NumberValue
									value={localChunkCount}
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
							localProofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const localProofCount = entity.localProofCount}
					{#if localProofCount != null}
						<div>
							<dt>local proof count</dt>
							<dd>
								<NumberValue
									value={localProofCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
