<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BitTorrentPiece>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BitTorrentPiece>>
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
	const bitTorrentPiece = $derived(selection({
		sources: selection.sources,
		fields: {
			length: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.pieceIndex) ?? '')].filter(Boolean).join(' ') || 'bit torrent piece')
	const viewDomId = $derived('bit-torrent-piece-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentPiece}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const pieceIndex0 = pendingEntity.pieceIndex}
					{#if pieceIndex0 !== undefined && pieceIndex0 !== null}
						<NumberValue
							value={pieceIndex0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={bitTorrentPiece}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceIndex0 = resolvedEntity.pieceIndex}
					{#if pieceIndex0 !== undefined && pieceIndex0 !== null}
						<NumberValue
							value={pieceIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const length0 = pendingEntity.length}
					{#if length0 !== undefined && length0 !== null}
						<NumberValue
							value={length0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={bitTorrentPiece}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const length0 = resolvedEntity.length}
					{#if length0 !== undefined && length0 !== null}
						<NumberValue
							value={length0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>torrent</dt>
				<dd>
					<BitTorrentMetainfoView
						selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>piece index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									pieceIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pieceIndex = resolvedEntity.pieceIndex}
							{#if pieceIndex !== undefined && pieceIndex !== null}
								<NumberValue
									value={pieceIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							pieceHashV1: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceHashV1 = resolvedEntity.pieceHashV1}
					{#if pieceHashV1 !== undefined && pieceHashV1 !== null}
						<div>
							<dt>piece hash v1</dt>
							<dd>
								<TruncatedValue value={String((pieceHashV1) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							pieceRootV2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceRootV2 = resolvedEntity.pieceRootV2}
					{#if pieceRootV2 !== undefined && pieceRootV2 !== null}
						<div>
							<dt>piece root v2</dt>
							<dd>
								{String((pieceRootV2) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							pieceLayerHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceLayerHash = resolvedEntity.pieceLayerHash}
					{#if pieceLayerHash !== undefined && pieceLayerHash !== null}
						<div>
							<dt>piece layer hash</dt>
							<dd>
								<TruncatedValue value={String((pieceLayerHash) ?? '')} />
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
						sources: selection.sources,
						fields: {
							length: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const length = resolvedEntity.length}
					{#if length !== undefined && length !== null}
						<div>
							<dt>length</dt>
							<dd>
								<NumberValue
									value={length}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							offset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const offset = resolvedEntity.offset}
					{#if offset !== undefined && offset !== null}
						<div>
							<dt>offset</dt>
							<dd>
								<NumberValue
									value={offset}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
