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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentFileTreeEntry>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BitTorrentFileTreeEntry>>
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
	const bitTorrentFileTreeEntry = $derived(selection({
		fields: {
			entryKind: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.path ?? prefetched.path) ?? '')].filter(Boolean).join(' ') || 'bit torrent file tree entry')
	const viewDomId = $derived('bit-torrent-file-tree-entry-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
	import BitTorrentFileView from '$/views/BitTorrentFileView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentFileTreeEntry}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitTorrentFileTreeEntry}>
			{#snippet Pending()}
				{[String((selection.entitySelector.path ?? prefetched.path) ?? '')].filter(Boolean).join(' ') || title || 'bit torrent file tree entry'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.path) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentFileTreeEntry}>
			{#snippet Pending()}
				{[String((prefetched.entryKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.path ?? prefetched.path) ?? '')].filter(Boolean).join(' ') || title || 'bit torrent file tree entry'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.entryKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.path) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
				<dt>path</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									path: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const path = selection.entitySelector.path ?? prefetched.path}
							{#if path !== undefined && path !== null}
								{String((path) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const path = resolvedEntity.path}
							{#if path !== undefined && path !== null}
								{String((path) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>entry kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									entryKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const entryKind = prefetched.entryKind}
							{#if entryKind !== undefined && entryKind !== null}
								{String((entryKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const entryKind = resolvedEntity.entryKind}
							{#if entryKind !== undefined && entryKind !== null}
								{String((entryKind) ?? '')}
							{/if}
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
				{#snippet Pending()}
					{@const length = prefetched.length}
					{#if length !== undefined && length !== null}
						<div>
							<dt>length</dt>
							<dd>
								<NumberValue value={Number(length)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const length = resolvedEntity.length}
					{#if length !== undefined && length !== null}
						<div>
							<dt>length</dt>
							<dd>
								<NumberValue value={Number(length)} />
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
				{#snippet Pending()}
					{@const piecesRoot = prefetched.piecesRoot}
					{#if piecesRoot !== undefined && piecesRoot !== null}
						<div>
							<dt>pieces root</dt>
							<dd>
								{String((piecesRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const piecesRoot = resolvedEntity.piecesRoot}
					{#if piecesRoot !== undefined && piecesRoot !== null}
						<div>
							<dt>pieces root</dt>
							<dd>
								{String((piecesRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BitTorrentFile, false>('$file')}
			>
				{#snippet children(bitTorrentFile)}
					{#if bitTorrentFile != null && bitTorrentFile[EntityMetaKey.Selector] != null}
						<div>
							<dt>file</dt>
							<dd>
								<BitTorrentFileView
									selection={select(EntityType.BitTorrentFile, bitTorrentFile[EntityMetaKey.Selector])}
									prefetched={bitTorrentFile}
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
