<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CodexDataset> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const codexDataset = $derived(viewSelection({
		fields: {
			filename: true,
			mimetype: true,
			datasetSizeBytes: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.filename ?? '') || (pendingEntity.cid ?? '') || 'codex dataset')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCodexStoredDataEntriesView from '$/views/BlockheadCodexStoredDataEntriesView.svelte'
</script>


<EntityView
	entityType={EntityType.CodexDataset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={codexDataset}>
			{#snippet children(entity)}
				{(entity.filename ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={codexDataset}>
			{#snippet children(entity)}
				{(entity.mimetype ?? '') || (entity.filename ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={codexDataset}>
			{#snippet children(entity)}
				{@const datasetSizeBytes0 = entity.datasetSizeBytes}
				{#if datasetSizeBytes0 != null}
					<span data-text="muted">
						<NumberValue
							value={datasetSizeBytes0}
						/>
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
					{pendingEntity.cid}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							treeCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const treeCid = entity.treeCid}
					{#if treeCid != null}
						<div>
							<dt>tree CID</dt>
							<dd>
								{treeCid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={codexDataset}
			>
				{#snippet children(entity)}
					{@const filename = entity.filename}
					{#if filename != null}
						<div>
							<dt>filename</dt>
							<dd>
								{filename}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={codexDataset}
			>
				{#snippet children(entity)}
					{@const mimetype = entity.mimetype}
					{#if mimetype != null}
						<div>
							<dt>mimetype</dt>
							<dd>
								{mimetype}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={codexDataset}
			>
				{#snippet children(entity)}
					{@const datasetSizeBytes = entity.datasetSizeBytes}
					{#if datasetSizeBytes != null}
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
					viewSelection({
						fields: {
							blockSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockSizeBytes = entity.blockSizeBytes}
					{#if blockSizeBytes != null}
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
						id='local-copies'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
