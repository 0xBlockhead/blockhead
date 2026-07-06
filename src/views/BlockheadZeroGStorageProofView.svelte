<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStorageProof>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadZeroGStorageProof>>
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
	const blockheadZeroGStorageProof = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
		fields: {
			verified: true,
			proofKind: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.proofId ?? prefetched.proofId) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g storage proof')
	const viewDomId = $derived('blockhead-zero-gstorage-proof-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadZeroGStorageProof}>
			{#snippet Pending()}
				{[String((selection.entitySelector.proofId ?? prefetched.proofId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zero g storage proof'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.proofId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZeroGStorageProof}>
			{#snippet Pending()}
				{[String((prefetched.verified) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.proofId ?? prefetched.proofId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zero g storage proof'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.verified) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.proofId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZeroGStorageProof}>
			{#snippet Pending()}
				{@const proofKind0 = prefetched.proofKind}
				{#if proofKind0 !== undefined && proofKind0 !== null}
					<span data-text="muted">
						{String((proofKind0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const proofKind0 = resolvedEntity.proofKind}
				{#if proofKind0 !== undefined && proofKind0 !== null}
					<span data-text="muted">
						{String((proofKind0) ?? '')}
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
					<BlockheadZeroGStorageNodeStateView
						selection={select(EntityType.BlockheadZeroGStorageNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>proof ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proofId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const proofId = selection.entitySelector.proofId ?? prefetched.proofId}
							{#if proofId !== undefined && proofId !== null}
								{String((proofId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const proofId = resolvedEntity.proofId}
							{#if proofId !== undefined && proofId !== null}
								{String((proofId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proofKind = prefetched.proofKind}
					{#if proofKind !== undefined && proofKind !== null}
						<div>
							<dt>proof kind</dt>
							<dd>
								{String((proofKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofKind = resolvedEntity.proofKind}
					{#if proofKind !== undefined && proofKind !== null}
						<div>
							<dt>proof kind</dt>
							<dd>
								{String((proofKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.ZeroGDataBlob, false>('$dataBlob')}
			>
				{#snippet children(zeroGDataBlob)}
					{#if zeroGDataBlob != null && zeroGDataBlob[EntityMetaKey.Selector] != null}
						<div>
							<dt>data blob</dt>
							<dd>
								<ZeroGDataBlobView
									selection={select(EntityType.ZeroGDataBlob, zeroGDataBlob[EntityMetaKey.Selector])}
									prefetched={zeroGDataBlob}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadZeroGStoredChunk, false>('$chunk')}
			>
				{#snippet children(blockheadZeroGStoredChunk)}
					{#if blockheadZeroGStoredChunk != null && blockheadZeroGStoredChunk[EntityMetaKey.Selector] != null}
						<div>
							<dt>chunk</dt>
							<dd>
								<BlockheadZeroGStoredChunkView
									selection={select(EntityType.BlockheadZeroGStoredChunk, blockheadZeroGStoredChunk[EntityMetaKey.Selector])}
									prefetched={blockheadZeroGStoredChunk}
									layout={EntityLayout.Value}
									open={false}
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
						resource={
							selection({
								fields: {
									verified: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const verified = prefetched.verified}
							{#if verified !== undefined && verified !== null}
								{verified ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const verified = resolvedEntity.verified}
							{#if verified !== undefined && verified !== null}
								{verified ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedAt = prefetched.verifiedAt}
					{#if verifiedAt !== undefined && verifiedAt !== null}
						<div>
							<dt>verified AT</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedAt = resolvedEntity.verifiedAt}
					{#if verifiedAt !== undefined && verifiedAt !== null}
						<div>
							<dt>verified AT</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedAtBlock: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedAtBlock = prefetched.verifiedAtBlock}
					{#if verifiedAtBlock !== undefined && verifiedAtBlock !== null}
						<div>
							<dt>verified AT block</dt>
							<dd>
								<NumberValue value={Number(verifiedAtBlock)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedAtBlock = resolvedEntity.verifiedAtBlock}
					{#if verifiedAtBlock !== undefined && verifiedAtBlock !== null}
						<div>
							<dt>verified AT block</dt>
							<dd>
								<NumberValue value={Number(verifiedAtBlock)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
