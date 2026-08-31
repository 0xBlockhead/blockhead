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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadZeroGStorageProof>, 'prefetched'> = $props()

	const nodeState = $derived(selection.entitySelector.$nodeState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))
	const blockheadZeroGStorageProof = $derived(viewSelection({
		fields: {
			verified: true,
			proofKind: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
	import BlockheadZeroGStoredChunkView from '$/views/BlockheadZeroGStoredChunkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZeroGStorageProof}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.proofId || 'blockhead zero g storage proof')}
	href={
		href === undefined ?
			resolve(
				'/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]/(blockheadZeroGStorageNodeState)/proof/[proofId=stringSegment]',
				{
					slug: nodeState.$network.slug,
					connectionId: nodeState.connectionId,
					nodeId: nodeState.nodeId,
					proofId: selection.entitySelector.proofId,
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
		<ResourceBoundary resource={blockheadZeroGStorageProof}>
			{#snippet children(entity)}
				{String(entity.verified)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZeroGStorageProof}>
			{#snippet children(entity)}
				{@const proofKind = entity.proofKind}
				{#if proofKind != null}
					<span data-text="muted">
						{proofKind}
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
					<BlockheadZeroGStorageNodeStateView
						selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>proof ID</dt>
				<dd>
					{selection.entitySelector.proofId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadZeroGStorageProof}
			>
				{#snippet children(entity)}
					{@const proofKind = entity.proofKind}
					{#if proofKind != null}
						<div>
							<dt>proof kind</dt>
							<dd>
								{proofKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$dataBlob}
			>
				{#snippet children(zeroGDataBlob)}
					{#if zeroGDataBlob != null}
						<div>
							<dt>data blob</dt>
							<dd>
								<ZeroGDataBlobView
									selection={select(EntityType.ZeroGDataBlob, zeroGDataBlob[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$chunk}
			>
				{#snippet children(blockheadZeroGStoredChunk)}
					{#if blockheadZeroGStoredChunk != null}
						<div>
							<dt>chunk</dt>
							<dd>
								<BlockheadZeroGStoredChunkView
									selection={select(EntityType.BlockheadZeroGStoredChunk, blockheadZeroGStoredChunk[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>verified</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadZeroGStorageProof}
					>
						{#snippet children(entity)}
							{entity.verified ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verifiedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedAt = entity.verifiedAt}
					{#if verifiedAt != null}
						<div>
							<dt>verified AT</dt>
							<dd>
								<Timestamp timestamp={verifiedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verifiedAtBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedAtBlock = entity.verifiedAtBlock}
					{#if verifiedAtBlock != null}
						<div>
							<dt>verified AT block</dt>
							<dd>
								<NumberValue
									value={verifiedAtBlock}
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
