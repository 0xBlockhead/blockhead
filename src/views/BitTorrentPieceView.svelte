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
	}: EntitySelectionViewProps<EntityType.BitTorrentPiece> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const bitTorrentPiece = $derived(selection({
		fields: {
			length: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.pieceIndex ?? '') || 'bit torrent piece')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentPiece}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.pieceIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentPiece}>
			{#snippet children(entity)}
				{@const length0 = entity.length}
				{#if length0 != null}
					<NumberValue
						value={length0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>torrent</dt>
				<dd>
					<BitTorrentMetainfoView
						selection={select(EntityType.BitTorrentMetainfo, selection.entitySelector.$torrent)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>piece index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.pieceIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceHashV1: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceHashV1 = entity.pieceHashV1}
					{#if pieceHashV1 != null}
						<div>
							<dt>piece hash v1</dt>
							<dd>
								<TruncatedValue value={pieceHashV1} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceRootV2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceRootV2 = entity.pieceRootV2}
					{#if pieceRootV2 != null}
						<div>
							<dt>piece root v2</dt>
							<dd>
								{pieceRootV2}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceLayerHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceLayerHash = entity.pieceLayerHash}
					{#if pieceLayerHash != null}
						<div>
							<dt>piece layer hash</dt>
							<dd>
								<TruncatedValue value={pieceLayerHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={bitTorrentPiece}
			>
				{#snippet children(entity)}
					{@const length = entity.length}
					{#if length != null}
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
						fields: {
							offset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const offset = entity.offset}
					{#if offset != null}
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
