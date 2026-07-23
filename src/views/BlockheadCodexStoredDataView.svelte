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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadCodexStoredData>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadCodexStoredData>
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
	const blockheadCodexStoredData = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			firstSeenAt: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			firstSeenAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || 'blockhead codex stored data')
	const viewDomId = $derived('blockhead-codex-stored-data-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadCodexStoredData_TimestampsView from '$/views/BlockheadCodexStoredData_TimestampsView.svelte'
	import BlockheadCodexStorageNodeStateView from '$/views/BlockheadCodexStorageNodeStateView.svelte'
	import CodexDatasetView from '$/views/CodexDatasetView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCodexStoredData}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, 'endpoint') && Object.hasOwn(prefetched, 'firstSeenAt')}
			{[String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadCodexStoredData}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.cid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, 'endpoint') && Object.hasOwn(prefetched, 'firstSeenAt')}
			{@const blockheadCodexStorageNodeState0 = pendingEntity.$nodeState}
			{#if blockheadCodexStorageNodeState0 != null && selection.entitySelector.$nodeState != null}
				<BlockheadCodexStorageNodeStateView
					selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState, { sources: selection.sources })}
					prefetched={blockheadCodexStorageNodeState0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadCodexStoredData}>
				{#snippet children(entity)}
					<BlockheadCodexStorageNodeStateView
						selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$nodeState') && prefetched.$nodeState != null && Object.hasOwn(prefetched.$nodeState, 'endpoint') && Object.hasOwn(prefetched, 'firstSeenAt')}
			{@const firstSeenAt0 = pendingEntity.firstSeenAt}
			{#if firstSeenAt0 !== undefined && firstSeenAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(firstSeenAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadCodexStoredData}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const firstSeenAt0 = resolvedEntity.firstSeenAt}
					{#if firstSeenAt0 !== undefined && firstSeenAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(firstSeenAt0)} />
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
					<BlockheadCodexStorageNodeStateView
						selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>CID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									cid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const cid = resolvedEntity.cid}
							{#if cid !== undefined && cid !== null}
								{String((cid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$dataset}
			>
				{#snippet children(codexDataset)}
					{#if codexDataset != null && codexDataset[EntityMetaKey.Selector] != null}
						<div>
							<dt>dataset</dt>
							<dd>
								<CodexDatasetView
									selection={select(EntityType.CodexDataset, codexDataset[EntityMetaKey.Selector])}
									prefetched={codexDataset}
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
						sources: selection.sources,
						fields: {
							firstSeenAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const firstSeenAt = resolvedEntity.firstSeenAt}
					{#if firstSeenAt !== undefined && firstSeenAt !== null}
						<div>
							<dt>first seen AT</dt>
							<dd>
								<Timestamp timestamp={Number(firstSeenAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadCodexStoredDataBlockheadCodexStoredDataTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadCodexStoredDataBlockheadCodexStoredDataTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadCodexStoredData_TimestampsView
					selection={blockheadCodexStoredDataBlockheadCodexStoredDataTimestampsViewTimestampsResource}
					countResource={blockheadCodexStoredDataBlockheadCodexStoredDataTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadCodexStoredData_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
