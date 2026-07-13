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
			selection: EntityProxyResource<typeof schema, EntityType.CodexDataset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CodexDataset>>
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
	const codexDataset = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			filename: true,
			mimetype: true,
			datasetSizeBytes: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.filename) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || 'codex dataset')
	const viewDomId = $derived('codex-dataset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={codexDataset}>
			{#snippet Pending()}
				{[String((pendingEntity.filename) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || 'codex dataset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.filename) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={codexDataset}>
			{#snippet Pending()}
				{[String((pendingEntity.mimetype) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.filename) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.cid) ?? '')].filter(Boolean).join(' ') || 'codex dataset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.mimetype) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.filename) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={codexDataset}>
			{#snippet Pending()}
				{@const datasetSizeBytes0 = pendingEntity.datasetSizeBytes}
				{#if datasetSizeBytes0 !== undefined && datasetSizeBytes0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(datasetSizeBytes0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const datasetSizeBytes0 = resolvedEntity.datasetSizeBytes}
				{#if datasetSizeBytes0 !== undefined && datasetSizeBytes0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(datasetSizeBytes0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
							{@const cid = pendingEntity.cid}
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
				resource={
					selection({
						fields: {
							treeCid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const treeCid = pendingEntity.treeCid}
					{#if treeCid !== undefined && treeCid !== null}
						<div>
							<dt>tree CID</dt>
							<dd>
								{String((treeCid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							filename: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const filename = pendingEntity.filename}
					{#if filename !== undefined && filename !== null}
						<div>
							<dt>filename</dt>
							<dd>
								{String((filename) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							mimetype: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mimetype = pendingEntity.mimetype}
					{#if mimetype !== undefined && mimetype !== null}
						<div>
							<dt>mimetype</dt>
							<dd>
								{String((mimetype) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							datasetSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const datasetSizeBytes = pendingEntity.datasetSizeBytes}
					{#if datasetSizeBytes !== undefined && datasetSizeBytes !== null}
						<div>
							<dt>dataset size bytes</dt>
							<dd>
								<NumberValue value={Number(datasetSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetSizeBytes = resolvedEntity.datasetSizeBytes}
					{#if datasetSizeBytes !== undefined && datasetSizeBytes !== null}
						<div>
							<dt>dataset size bytes</dt>
							<dd>
								<NumberValue value={Number(datasetSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockSizeBytes = pendingEntity.blockSizeBytes}
					{#if blockSizeBytes !== undefined && blockSizeBytes !== null}
						<div>
							<dt>block size bytes</dt>
							<dd>
								<NumberValue value={Number(blockSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockSizeBytes = resolvedEntity.blockSizeBytes}
					{#if blockSizeBytes !== undefined && blockSizeBytes !== null}
						<div>
							<dt>block size bytes</dt>
							<dd>
								<NumberValue value={Number(blockSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadCodexStoredDataEntriesView
				selection={
						selection.$$localCopies({
							count: true,
						})
					}
				title='local copies'
				emptyText='No local copies.'
				id='BlockheadCodexStoredDataEntriesView-local-copies'
			/>
		{/if}
	{/snippet}
</EntityView>
