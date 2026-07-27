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
	}: EntitySelectionViewProps<EntityType.BitTorrentFile> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const bitTorrentFile = $derived(selection({
		fields: {
			path: true,
			length: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.path ?? '') || 'bit torrent file')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentFile}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitTorrentFile}>
			{#snippet children(entity)}
				{entity.path || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentFile}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.length}
				/>
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
				<dt>file index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.fileIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>path</dt>
				<dd>
					<ResourceBoundary
						resource={bitTorrentFile}
					>
						{#snippet children(entity)}
							{entity.path}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>length</dt>
				<dd>
					<ResourceBoundary
						resource={bitTorrentFile}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.length}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							piecesRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const piecesRoot = entity.piecesRoot}
					{#if piecesRoot != null}
						<div>
							<dt>pieces root</dt>
							<dd>
								{piecesRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fileHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fileHash = entity.fileHash}
					{#if fileHash != null}
						<div>
							<dt>file hash</dt>
							<dd>
								<TruncatedValue value={fileHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
