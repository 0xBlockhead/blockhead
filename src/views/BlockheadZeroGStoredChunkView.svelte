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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStoredChunk>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadZeroGStoredChunk>>
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
	const blockheadZeroGStoredChunk = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
		fields: {
			present: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.dataRoot ?? prefetched.dataRoot) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g stored chunk')
	const viewDomId = $derived('blockhead-zero-gstored-chunk-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadZeroGStoredChunk}>
			{#snippet Pending()}
				{[String((selection.entitySelector.dataRoot ?? prefetched.dataRoot) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zero g stored chunk'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.dataRoot) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZeroGStoredChunk}>
			{#snippet Pending()}
				{@const chunkIndex0 = selection.entitySelector.chunkIndex ?? prefetched.chunkIndex}
				{#if chunkIndex0 !== undefined && chunkIndex0 !== null}
					<NumberValue value={Number(chunkIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const chunkIndex0 = resolvedEntity.chunkIndex}
				{#if chunkIndex0 !== undefined && chunkIndex0 !== null}
					<NumberValue value={Number(chunkIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZeroGStoredChunk}>
			{#snippet Pending()}
				{@const present0 = prefetched.present}
				{#if present0 !== undefined && present0 !== null}
					<span data-text="muted">
						{present0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const present0 = resolvedEntity.present}
				{#if present0 !== undefined && present0 !== null}
					<span data-text="muted">
						{present0 ? 'Yes' : 'No'}
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
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>data root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									dataRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const dataRoot = selection.entitySelector.dataRoot ?? prefetched.dataRoot}
							{#if dataRoot !== undefined && dataRoot !== null}
								{String((dataRoot) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dataRoot = resolvedEntity.dataRoot}
							{#if dataRoot !== undefined && dataRoot !== null}
								{String((dataRoot) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>chunk index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									chunkIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const chunkIndex = selection.entitySelector.chunkIndex ?? prefetched.chunkIndex}
							{#if chunkIndex !== undefined && chunkIndex !== null}
								<NumberValue value={Number(chunkIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const chunkIndex = resolvedEntity.chunkIndex}
							{#if chunkIndex !== undefined && chunkIndex !== null}
								<NumberValue value={Number(chunkIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.ZeroGDataBlob, false>('$dataBlob')}
			>
				{#snippet children(zeroGDataBlob)}
					{#if zeroGDataBlob != null && zeroGDataBlob[EntityMetaKey.Selector] != null}
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
				resource={selection[EntityProxyField]<EntityType.ZeroGDataChunk, false>('$publicChunk')}
			>
				{#snippet children(zeroGDataChunk)}
					{#if zeroGDataChunk != null && zeroGDataChunk[EntityMetaKey.Selector] != null}
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
					selection({
						fields: {
							chunkRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chunkRoot = prefetched.chunkRoot}
					{#if chunkRoot !== undefined && chunkRoot !== null}
						<div>
							<dt>chunk root</dt>
							<dd>
								{String((chunkRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chunkRoot = resolvedEntity.chunkRoot}
					{#if chunkRoot !== undefined && chunkRoot !== null}
						<div>
							<dt>chunk root</dt>
							<dd>
								{String((chunkRoot) ?? '')}
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
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sizeBytes = prefetched.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue value={Number(sizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sizeBytes = resolvedEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue value={Number(sizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							filePath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const filePath = prefetched.filePath}
					{#if filePath !== undefined && filePath !== null}
						<div>
							<dt>file path</dt>
							<dd>
								{String((filePath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const filePath = resolvedEntity.filePath}
					{#if filePath !== undefined && filePath !== null}
						<div>
							<dt>file path</dt>
							<dd>
								{String((filePath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>present</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									present: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const present = prefetched.present}
							{#if present !== undefined && present !== null}
								{present ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const present = resolvedEntity.present}
							{#if present !== undefined && present !== null}
								{present ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastCheckedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastCheckedAt = prefetched.lastCheckedAt}
					{#if lastCheckedAt !== undefined && lastCheckedAt !== null}
						<div>
							<dt>last checked AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastCheckedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastCheckedAt = resolvedEntity.lastCheckedAt}
					{#if lastCheckedAt !== undefined && lastCheckedAt !== null}
						<div>
							<dt>last checked AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastCheckedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
