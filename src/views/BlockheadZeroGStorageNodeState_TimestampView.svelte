<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStorageNodeState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadZeroGStorageNodeState_Timestamp>>
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
	const blockheadZeroGStorageNodeStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
		fields: {
			localChunkCount: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g storage node state timestamp')
	const viewDomId = $derived('blockhead-zero-gstorage-node-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZeroGStorageNodeState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadZeroGStorageNodeStateTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
		<ResourceBoundary resource={blockheadZeroGStorageNodeStateTimestamp}>
			{#snippet Pending()}
				<BlockheadZeroGStorageNodeStateView
					selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<BlockheadZeroGStorageNodeStateView
					selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZeroGStorageNodeStateTimestamp}>
			{#snippet Pending()}
				{@const localChunkCount0 = prefetched.localChunkCount}
				{#if localChunkCount0 !== undefined && localChunkCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(localChunkCount0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const localChunkCount0 = resolvedEntity.localChunkCount}
				{#if localChunkCount0 !== undefined && localChunkCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(localChunkCount0)} />
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
						selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState, {})}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
							syncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const syncedAt = prefetched.syncedAt}
					{#if syncedAt !== undefined && syncedAt !== null}
						<div>
							<dt>synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(syncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const syncedAt = resolvedEntity.syncedAt}
					{#if syncedAt !== undefined && syncedAt !== null}
						<div>
							<dt>synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(syncedAt)} />
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
							localFileCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localFileCount = prefetched.localFileCount}
					{#if localFileCount !== undefined && localFileCount !== null}
						<div>
							<dt>local file count</dt>
							<dd>
								<NumberValue value={Number(localFileCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localFileCount = resolvedEntity.localFileCount}
					{#if localFileCount !== undefined && localFileCount !== null}
						<div>
							<dt>local file count</dt>
							<dd>
								<NumberValue value={Number(localFileCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localChunkCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localChunkCount = prefetched.localChunkCount}
					{#if localChunkCount !== undefined && localChunkCount !== null}
						<div>
							<dt>local chunk count</dt>
							<dd>
								<NumberValue value={Number(localChunkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localChunkCount = resolvedEntity.localChunkCount}
					{#if localChunkCount !== undefined && localChunkCount !== null}
						<div>
							<dt>local chunk count</dt>
							<dd>
								<NumberValue value={Number(localChunkCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localProofCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localProofCount = prefetched.localProofCount}
					{#if localProofCount !== undefined && localProofCount !== null}
						<div>
							<dt>local proof count</dt>
							<dd>
								<NumberValue value={Number(localProofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localProofCount = resolvedEntity.localProofCount}
					{#if localProofCount !== undefined && localProofCount !== null}
						<div>
							<dt>local proof count</dt>
							<dd>
								<NumberValue value={Number(localProofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
