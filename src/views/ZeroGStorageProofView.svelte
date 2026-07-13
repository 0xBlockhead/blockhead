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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageProof>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZeroGStorageProof>>
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
	const zeroGStorageProof = $derived(selection({
		sources: [
			Source.ZeroGStorageScan_Rest,
		],
		fields: {
			proofKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.proofId) ?? '')].filter(Boolean).join(' ') || 'zero g storage proof')
	const viewDomId = $derived('zero-gstorage-proof-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageProof}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zeroGStorageProof}>
			{#snippet Pending()}
				{[String((pendingEntity.proofId) ?? '')].filter(Boolean).join(' ') || title || 'zero g storage proof'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.proofId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zeroGStorageProof}>
			{#snippet Pending()}
				<ZeroGStorageNodeView
					selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ZeroGStorageNodeView
					selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGStorageProof}>
			{#snippet Pending()}
				{@const proofKind0 = pendingEntity.proofKind}
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
				<dt>storage node</dt>
				<dd>
					<ZeroGStorageNodeView
						selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode, {})}
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
							{@const proofId = pendingEntity.proofId}
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
					{@const proofKind = pendingEntity.proofKind}
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
				resource={
					selection({
						fields: {
							verifiedAtBlock: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedAtBlock = pendingEntity.verifiedAtBlock}
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
				resource={selection.$dataBlob}
			>
				{#snippet Pending()}{/snippet}

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
				resource={selection.$consensusNetwork}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(zeroGConsensusNetwork)}
					{#if zeroGConsensusNetwork != null && zeroGConsensusNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>consensus network</dt>
							<dd>
								<ZeroGConsensusNetworkView
									selection={select(EntityType.ZeroGConsensusNetwork, zeroGConsensusNetwork[EntityMetaKey.Selector])}
									prefetched={zeroGConsensusNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
