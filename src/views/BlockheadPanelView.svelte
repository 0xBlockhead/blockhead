<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadPanel>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadPanel>
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
	const blockheadPanel = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			indexInParent: true,
			kind: true,
			entityType: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			indexInParent: true,
			kind: true,
			entityType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.kind) ?? '')].filter(Boolean).join(' ') || 'panel')
	const viewDomId = $derived('blockhead-panel-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPanel}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'kind') && Object.hasOwn(prefetched, 'entityType') && Object.hasOwn(prefetched, 'indexInParent')}
			{[String((pendingEntity.kind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadPanel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.kind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'kind') && Object.hasOwn(prefetched, 'entityType') && Object.hasOwn(prefetched, 'indexInParent')}
			{[String((pendingEntity.entityType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.kind) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadPanel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.entityType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.kind) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'kind') && Object.hasOwn(prefetched, 'entityType') && Object.hasOwn(prefetched, 'indexInParent')}
			{@const indexInParent0 = pendingEntity.indexInParent}
			{#if indexInParent0 !== undefined && indexInParent0 !== null}
				<span data-text="muted">
					<NumberValue
						value={indexInParent0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadPanel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexInParent0 = resolvedEntity.indexInParent}
					{#if indexInParent0 !== undefined && indexInParent0 !== null}
						<span data-text="muted">
							<NumberValue
								value={indexInParent0}
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
				<dt>tree ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									treeId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const treeId = resolvedEntity.treeId}
							{#if treeId !== undefined && treeId !== null}
								{String((treeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>panel ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									panelId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const panelId = resolvedEntity.panelId}
							{#if panelId !== undefined && panelId !== null}
								{String((panelId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>panel tree</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$panelTree}
					>
						{#snippet children(blockheadPanelTree)}
							{#if blockheadPanelTree != null && blockheadPanelTree[EntityMetaKey.Selector] != null}
								<BlockheadPanelTreeView
									selection={select(EntityType.BlockheadPanelTree, blockheadPanelTree[EntityMetaKey.Selector])}
									prefetched={blockheadPanelTree}
									href={
										(
											blockheadPanelTree[EntityMetaKey.Selector] != null && 'id' in blockheadPanelTree[EntityMetaKey.Selector]
											&& blockheadPanelTree[EntityMetaKey.Selector].id != null ?
												resolve('/~/dashboard/[dashboardId=stringSegment]', {
											dashboardId: String(blockheadPanelTree[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							parentPanelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentPanelId = resolvedEntity.parentPanelId}
					{#if parentPanelId !== undefined && parentPanelId !== null}
						<div>
							<dt>parent panel ID</dt>
							<dd>
								{String((parentPanelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>index in parent</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInParent: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInParent = resolvedEntity.indexInParent}
							{#if indexInParent !== undefined && indexInParent !== null}
								<NumberValue
									value={indexInParent}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									kind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const kind = resolvedEntity.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
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
							entityType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const entityType = resolvedEntity.entityType}
					{#if entityType !== undefined && entityType !== null}
						<div>
							<dt>entity type</dt>
							<dd>
								{String((entityType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
