<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadCodexStoredData>, 'prefetched'> = $props()

	const nodeState = $derived(selection.entitySelector.$nodeState)
	const blockheadCodexStoredData = $derived(selection({
		sources: selection.sources ?? [
			Source.CodexNode_Rest,
		],
		fields: {
			firstSeenAt: true,
		},
	}))


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
	title={title ?? (selection.entitySelector.cid || 'blockhead codex stored data')}
	href={
		href === undefined ?
			resolve(
				'/~/codex/connection/[connectionId=stringSegment]/node/[peerId=stringSegment]/(blockheadCodexStorageNodeState)/stored-data/[cid=stringSegment]',
				{
					connectionId: nodeState.connectionId,
					peerId: nodeState.peerId,
					cid: selection.entitySelector.cid,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<BlockheadCodexStorageNodeStateView
			selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStoredData}>
			{#snippet children(entity)}
				{@const firstSeenAt = entity.firstSeenAt}
				{#if firstSeenAt != null}
					<span data-text="muted">
						<Timestamp timestamp={firstSeenAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadCodexStorageNodeStateView
						selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>CID</dt>
				<dd>
					{selection.entitySelector.cid}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$dataset}
			>
				{#snippet children(codexDataset)}
					{#if codexDataset != null}
						{@const codexDatasetInitial = untrack(() => codexDataset)}
						<div>
							<dt>dataset</dt>
							<dd>
								<CodexDatasetView
									selection={select(EntityType.CodexDataset, (codexDataset ?? codexDatasetInitial)[EntityMetaKey.Selector])}
									prefetched={codexDataset ?? codexDatasetInitial}
									layout={EntityLayout.Value}
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
								<Timestamp timestamp={firstSeenAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCodexStoredData_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
