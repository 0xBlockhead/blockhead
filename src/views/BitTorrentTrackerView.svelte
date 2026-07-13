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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentTracker>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BitTorrentTracker>>
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
	const bitTorrentTracker = $derived(selection({
		fields: {
			trackerKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || 'bit torrent tracker')
	const viewDomId = $derived('bit-torrent-tracker-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitTorrentAnnounce_TimestampsView from '$/views/BitTorrentAnnounce_TimestampsView.svelte'
	import BitTorrentTrackerScrape_TimestampsView from '$/views/BitTorrentTrackerScrape_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BitTorrentTracker}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitTorrentTracker}>
			{#snippet Pending()}
				{[String((pendingEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || title || 'bit torrent tracker'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitTorrentTracker}>
			{#snippet Pending()}
				{[String((pendingEntity.trackerKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || title || 'bit torrent tracker'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.trackerKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>tracker URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									trackerUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const trackerUrl = pendingEntity.trackerUrl}
							{#if trackerUrl !== undefined && trackerUrl !== null}
								<svelte:element
									this={'a'}
									href={String(trackerUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(trackerUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const trackerUrl = resolvedEntity.trackerUrl}
							{#if trackerUrl !== undefined && trackerUrl !== null}
								<svelte:element
									this={'a'}
									href={String(trackerUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(trackerUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>tracker kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									trackerKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const trackerKind = pendingEntity.trackerKind}
							{#if trackerKind !== undefined && trackerKind !== null}
								{String((trackerKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const trackerKind = resolvedEntity.trackerKind}
							{#if trackerKind !== undefined && trackerKind !== null}
								{String((trackerKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BitTorrentAnnounce_TimestampsView
				selection={
						selection.$$announces({
							count: true,
						})
					}
				title='announces'
				emptyText='No announces yet.'
				id='BitTorrentAnnounce_TimestampsView-announces'
			/>

			<BitTorrentTrackerScrape_TimestampsView
				selection={
						selection.$$scrapes({
							count: true,
						})
					}
				title='scrapes'
				emptyText='No scrapes yet.'
				id='BitTorrentTrackerScrape_TimestampsView-scrapes'
			/>
		{/if}
	{/snippet}
</EntityView>
