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
			selection: RegisteredEntityProxyResource<EntityType.CodexDataset>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CodexDataset>
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
	const codexDataset = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			filename: true,
			mimetype: true,
			datasetSizeBytes: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			filename: true,
			mimetype: true,
			datasetSizeBytes: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.filename) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || 'codex dataset')
	const viewDomId = $derived('codex-dataset-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCodexStoredDataEntriesView from '$/views/BlockheadCodexStoredDataEntriesView.svelte'
</script>


<EntityView
	entityType={EntityType.CodexDataset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'filename') && Object.hasOwn(prefetched, 'mimetype') && Object.hasOwn(prefetched, 'datasetSizeBytes')}
			{[String((pendingEntity.filename) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={codexDataset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.filename) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'filename') && Object.hasOwn(prefetched, 'mimetype') && Object.hasOwn(prefetched, 'datasetSizeBytes')}
			{[String((pendingEntity.mimetype) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.filename) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={codexDataset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.mimetype) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.filename) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'filename') && Object.hasOwn(prefetched, 'mimetype') && Object.hasOwn(prefetched, 'datasetSizeBytes')}
			{@const datasetSizeBytes0 = pendingEntity.datasetSizeBytes}
			{#if datasetSizeBytes0 !== undefined && datasetSizeBytes0 !== null}
				<span data-text="muted">
					<NumberValue
						value={datasetSizeBytes0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={codexDataset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetSizeBytes0 = resolvedEntity.datasetSizeBytes}
					{#if datasetSizeBytes0 !== undefined && datasetSizeBytes0 !== null}
						<span data-text="muted">
							<NumberValue
								value={datasetSizeBytes0}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							treeCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const treeCid = resolvedEntity.treeCid}
					{#if treeCid !== undefined && treeCid !== null}
						<div>
							<dt>tree CID</dt>
							<dd>
								{String((treeCid) ?? '')}
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
							filename: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const filename = resolvedEntity.filename}
					{#if filename !== undefined && filename !== null}
						<div>
							<dt>filename</dt>
							<dd>
								{String((filename) ?? '')}
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
							mimetype: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mimetype = resolvedEntity.mimetype}
					{#if mimetype !== undefined && mimetype !== null}
						<div>
							<dt>mimetype</dt>
							<dd>
								{String((mimetype) ?? '')}
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
							datasetSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetSizeBytes = resolvedEntity.datasetSizeBytes}
					{#if datasetSizeBytes !== undefined && datasetSizeBytes !== null}
						<div>
							<dt>dataset size bytes</dt>
							<dd>
								<NumberValue
									value={datasetSizeBytes}
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
							blockSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockSizeBytes = resolvedEntity.blockSizeBytes}
					{#if blockSizeBytes !== undefined && blockSizeBytes !== null}
						<div>
							<dt>block size bytes</dt>
							<dd>
								<NumberValue
									value={blockSizeBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const codexDatasetBlockheadCodexStoredDataEntriesViewLocalCopiesResource = selection.$$localCopies}
		<ResourceBoundary
			resource={codexDatasetBlockheadCodexStoredDataEntriesViewLocalCopiesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadCodexStoredDataEntriesView
					selection={codexDatasetBlockheadCodexStoredDataEntriesViewLocalCopiesResource}
					countResource={codexDatasetBlockheadCodexStoredDataEntriesViewLocalCopiesResource.count}
					title='local copies'
					id='BlockheadCodexStoredDataEntriesView-local-copies'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
