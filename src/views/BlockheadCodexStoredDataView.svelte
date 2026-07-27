<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadCodexStoredData> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadCodexStoredData = $derived(viewSelection({
		fields: {
			firstSeenAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.cid ?? '') || 'blockhead codex stored data')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadCodexStoredData_TimestampsView from '$/views/BlockheadCodexStoredData_TimestampsView.svelte'
	import BlockheadCodexStorageNodeStateView from '$/views/BlockheadCodexStorageNodeStateView.svelte'
	import CodexDatasetView from '$/views/CodexDatasetView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCodexStoredData}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.cid ?? '') || 'blockhead codex stored data'}
	{/snippet}

	{#snippet Value()}
		<BlockheadCodexStorageNodeStateView
			selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStoredData}>
			{#snippet children(entity)}
				{@const firstSeenAt0 = entity.firstSeenAt}
				{#if firstSeenAt0 != null}
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
					{pendingEntity.cid}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$dataset}
			>
				{#snippet children(codexDataset)}
					{#if codexDataset != null}
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
				resource={blockheadCodexStoredData}
			>
				{#snippet children(entity)}
					{@const firstSeenAt = entity.firstSeenAt}
					{#if firstSeenAt != null}
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
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
