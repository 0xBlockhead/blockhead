<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.ZeroGDataChunk> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDataChunk}
	entitySelector={selection.entitySelector}
	title={title ?? 'zero g data chunk'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		zero g data chunk
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>data blob</dt>
				<dd>
					<ZeroGDataBlobView
						selection={select(EntityType.ZeroGDataBlob, selection.entitySelector.$dataBlob)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>chunk index</dt>
				<dd>
					{selection.entitySelector.chunkIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
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

			<ResourceBoundary
				resource={
					selection({
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
								{sizeBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
