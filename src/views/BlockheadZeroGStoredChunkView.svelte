<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadZeroGStoredChunk> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))
	const blockheadZeroGStoredChunk = $derived(viewSelection({
		fields: {
			present: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
	import ZeroGDataChunkView from '$/views/ZeroGDataChunkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZeroGStoredChunk}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.dataRoot || 'blockhead zero g stored chunk')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.dataRoot || 'blockhead zero g stored chunk'}
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.chunkIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZeroGStoredChunk}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.present ? 'Yes' : 'No'}
				</span>
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
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>data root</dt>
				<dd>
					{selection.entitySelector.dataRoot}
				</dd>
			</div>

			<div>
				<dt>chunk index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.chunkIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$dataBlob}
			>
				{#snippet children(zeroGDataBlob)}
					{#if zeroGDataBlob != null}
						<div>
							<dt>data blob</dt>
							<dd>
								<ZeroGDataBlobView
									selection={select(EntityType.ZeroGDataBlob, zeroGDataBlob[EntityMetaKey.Selector])}
									prefetched={zeroGDataBlob}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$publicChunk}
			>
				{#snippet children(zeroGDataChunk)}
					{#if zeroGDataChunk != null}
						<div>
							<dt>public chunk</dt>
							<dd>
								<ZeroGDataChunkView
									selection={select(EntityType.ZeroGDataChunk, zeroGDataChunk[EntityMetaKey.Selector])}
									prefetched={zeroGDataChunk}
									layout={EntityLayout.Value}
									open={false}
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
							chunkRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chunkRoot = entity.chunkRoot}
					{#if chunkRoot != null}
						<div>
							<dt>chunk root</dt>
							<dd>
								{chunkRoot}
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
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sizeBytes = entity.sizeBytes}
					{#if sizeBytes != null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue
									value={sizeBytes}
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
							filePath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const filePath = entity.filePath}
					{#if filePath != null}
						<div>
							<dt>file path</dt>
							<dd>
								{filePath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>present</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadZeroGStoredChunk}
					>
						{#snippet children(entity)}
							{entity.present ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastCheckedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastCheckedAt = entity.lastCheckedAt}
					{#if lastCheckedAt != null}
						<div>
							<dt>last checked AT</dt>
							<dd>
								<Timestamp timestamp={lastCheckedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
