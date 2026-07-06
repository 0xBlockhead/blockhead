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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCodexStoredData>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCodexStoredData>>
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
	const blockheadCodexStoredData = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			firstSeenAt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.cid ?? prefetched.cid) ?? '')].filter(Boolean).join(' ') || 'blockhead codex stored data')
	const viewDomId = $derived('blockhead-codex-stored-data-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={blockheadCodexStoredData}>
			{#snippet Pending()}
				{[String((selection.entitySelector.cid ?? prefetched.cid) ?? '')].filter(Boolean).join(' ') || title || 'blockhead codex stored data'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.cid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCodexStoredData}>
			{#snippet Pending()}
				<BlockheadCodexStorageNodeStateView
					selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<BlockheadCodexStorageNodeStateView
					selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStoredData}>
			{#snippet Pending()}
				{@const firstSeenAt0 = prefetched.firstSeenAt}
				{#if firstSeenAt0 !== undefined && firstSeenAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(firstSeenAt0)} />
					</span>
				{/if}
			{/snippet}

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
								fields: {
									cid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const cid = selection.entitySelector.cid ?? prefetched.cid}
							{#if cid !== undefined && cid !== null}
								{String((cid) ?? '')}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.CodexDataset, false>('$dataset')}
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
						fields: {
							firstSeenAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const firstSeenAt = prefetched.firstSeenAt}
					{#if firstSeenAt !== undefined && firstSeenAt !== null}
						<div>
							<dt>first seen AT</dt>
							<dd>
								<Timestamp timestamp={Number(firstSeenAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<BlockheadCodexStoredData_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadCodexStoredData_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No availability observations.'
				id='BlockheadCodexStoredData_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
