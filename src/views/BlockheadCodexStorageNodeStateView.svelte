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
	}: EntitySelectionViewProps<EntityType.BlockheadCodexStorageNodeState> = $props()

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
	const titleFallback = $derived(selection.entitySelector.peerId || 'blockhead codex storage node state')


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
	{#snippet Value()}
		{selection.entitySelector.connectionId || selection.entitySelector.peerId || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStorageNodeState}>
			{#snippet children(entity)}
				{@const endpoint = entity.endpoint}
				{#if endpoint != null}
					<span data-text="muted">
						<a
							href={endpoint}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={endpoint} />
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
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>peer ID</dt>
				<dd>
					{selection.entitySelector.peerId}
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
									href={endpoint}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpoint} />
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
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCodexStorageNodeState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const storedDataResource = selection.$$storedData}
		<ResourceBoundary
			resource={storedDataResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCodexStoredDataEntriesView
						selection={storedDataResource}
						countResource={storedDataResource.count}
						title='Stored Data'
						id='stored-data'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
