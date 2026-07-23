<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadZeroGStorageNodeState_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadZeroGStorageNodeState_Timestamp>
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
	const blockheadZeroGStorageNodeStateTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			localChunkCount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			localChunkCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g storage node state timestamp')
	const viewDomId = $derived('blockhead-zero-gstorage-node-state-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, '$network') && prefetched.$nodeState.$network != null && Object.hasOwn(prefetched.$nodeState.$network, 'name') && Object.hasOwn(prefetched.$nodeState.$network, 'environment') && Object.hasOwn(prefetched, 'localChunkCount')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadZeroGStorageNodeStateTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, '$network') && prefetched.$nodeState.$network != null && Object.hasOwn(prefetched.$nodeState.$network, 'name') && Object.hasOwn(prefetched.$nodeState.$network, 'environment') && Object.hasOwn(prefetched, 'localChunkCount')}
			{@const blockheadZeroGStorageNodeState0 = pendingEntity.$nodeState}
			{#if blockheadZeroGStorageNodeState0 != null && selection.entitySelector.$nodeState != null}
				<BlockheadZeroGStorageNodeStateView
					selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState, { sources: selection.sources })}
					prefetched={blockheadZeroGStorageNodeState0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadZeroGStorageNodeStateTimestamp}>
				{#snippet children(entity)}
					<BlockheadZeroGStorageNodeStateView
						selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, '$network') && prefetched.$nodeState.$network != null && Object.hasOwn(prefetched.$nodeState.$network, 'name') && Object.hasOwn(prefetched.$nodeState.$network, 'environment') && Object.hasOwn(prefetched, 'localChunkCount')}
			{@const localChunkCount0 = pendingEntity.localChunkCount}
			{#if localChunkCount0 !== undefined && localChunkCount0 !== null}
				<span data-text="muted">
					<NumberValue
						value={localChunkCount0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadZeroGStorageNodeStateTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localChunkCount0 = resolvedEntity.localChunkCount}
					{#if localChunkCount0 !== undefined && localChunkCount0 !== null}
						<span data-text="muted">
							<NumberValue
								value={localChunkCount0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							syncedAt: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							localFileCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localFileCount = resolvedEntity.localFileCount}
					{#if localFileCount !== undefined && localFileCount !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							localChunkCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localChunkCount = resolvedEntity.localChunkCount}
					{#if localChunkCount !== undefined && localChunkCount !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							localProofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localProofCount = resolvedEntity.localProofCount}
					{#if localProofCount !== undefined && localProofCount !== null}
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
