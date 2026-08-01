<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.BitTorrentFileTreeEntry> = $props()

	const bitTorrentFileTreeEntry = $derived(selection({
		fields: {
			entryKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.path || 'bit torrent file tree entry')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
	import BitTorrentFileView from '$/views/BitTorrentFileView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentFileTreeEntry}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentFileTreeEntry}>
			{#snippet children(entity)}
				{entity.entryKind || selection.entitySelector.path || titleFallback}
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
					/>
				</dd>
			</div>

			<div>
				<dt>path</dt>
				<dd>
					{selection.entitySelector.path}
				</dd>
			</div>

			<div>
				<dt>entry kind</dt>
				<dd>
					<ResourceBoundary
						resource={bitTorrentFileTreeEntry}
					>
						{#snippet children(entity)}
							{entity.entryKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							length: true,
						},
					})
				}
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
				resource={selection.$file}
			>
				{#snippet children(bitTorrentFile)}
					{#if bitTorrentFile != null}
						<div>
							<dt>file</dt>
							<dd>
								<BitTorrentFileView
									selection={select(EntityType.BitTorrentFile, bitTorrentFile[EntityMetaKey.Selector])}
									prefetched={bitTorrentFile}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
