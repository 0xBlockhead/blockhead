<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadCodexStorageNodeState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadCodexStorageNodeState = $derived(viewSelection({
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.peerId ?? '') || 'blockhead codex storage node state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCodexStorageNodeState_TimestampsView from '$/views/BlockheadCodexStorageNodeState_TimestampsView.svelte'
	import BlockheadCodexStoredDataEntriesView from '$/views/BlockheadCodexStoredDataEntriesView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCodexStorageNodeState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.peerId ?? '') || 'blockhead codex storage node state'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.connectionId ?? '') || (pendingEntity.peerId ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStorageNodeState}>
			{#snippet children(entity)}
				{@const endpoint0 = entity.endpoint}
				{#if endpoint0 != null}
					<span data-text="muted">
						<a
							href={String(endpoint0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpoint0)} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{pendingEntity.connectionId}
				</dd>
			</div>

			<div>
				<dt>peer ID</dt>
				<dd>
					{pendingEntity.peerId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadCodexStorageNodeState}
			>
				{#snippet children(entity)}
					{@const endpoint = entity.endpoint}
					{#if endpoint != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<a
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signedPeerRecord: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signedPeerRecord = entity.signedPeerRecord}
					{#if signedPeerRecord != null}
						<div>
							<dt>signed peer record</dt>
							<dd>
								{signedPeerRecord}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadCodexStorageNodeStateBlockheadCodexStorageNodeStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadCodexStorageNodeStateBlockheadCodexStorageNodeStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCodexStorageNodeState_TimestampsView
						selection={blockheadCodexStorageNodeStateBlockheadCodexStorageNodeStateTimestampsViewTimestampsResource}
						countResource={blockheadCodexStorageNodeStateBlockheadCodexStorageNodeStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadCodexStorageNodeStateBlockheadCodexStoredDataEntriesViewStoredDataResource = selection.$$storedData}
		<ResourceBoundary
			resource={blockheadCodexStorageNodeStateBlockheadCodexStoredDataEntriesViewStoredDataResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCodexStoredDataEntriesView
						selection={blockheadCodexStorageNodeStateBlockheadCodexStoredDataEntriesViewStoredDataResource}
						countResource={blockheadCodexStorageNodeStateBlockheadCodexStoredDataEntriesViewStoredDataResource.count}
						title='Stored Data'
						id='stored-data'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
