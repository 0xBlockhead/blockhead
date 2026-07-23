<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.BitTorrentTracker>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BitTorrentTracker>
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
	const bitTorrentTracker = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			trackerKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			trackerKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || 'bit torrent tracker')
	const viewDomId = $derived('bit-torrent-tracker-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'trackerKind')}
			{[String((pendingEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={bitTorrentTracker}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'trackerKind')}
			{[String((pendingEntity.trackerKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={bitTorrentTracker}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.trackerKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.trackerUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>tracker URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									trackerUrl: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									trackerKind: true,
								},
							})
						}
					>
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
		{@const bitTorrentTrackerBitTorrentAnnounceTimestampsViewAnnouncesResource = selection.$$announces}
		<ResourceBoundary
			resource={bitTorrentTrackerBitTorrentAnnounceTimestampsViewAnnouncesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BitTorrentAnnounce_TimestampsView
					selection={bitTorrentTrackerBitTorrentAnnounceTimestampsViewAnnouncesResource}
					countResource={bitTorrentTrackerBitTorrentAnnounceTimestampsViewAnnouncesResource.count}
					title='announces'
					id='BitTorrentAnnounce_TimestampsView-announces'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const bitTorrentTrackerBitTorrentTrackerScrapeTimestampsViewScrapesResource = selection.$$scrapes}
		<ResourceBoundary
			resource={bitTorrentTrackerBitTorrentTrackerScrapeTimestampsViewScrapesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BitTorrentTrackerScrape_TimestampsView
					selection={bitTorrentTrackerBitTorrentTrackerScrapeTimestampsViewScrapesResource}
					countResource={bitTorrentTrackerBitTorrentTrackerScrapeTimestampsViewScrapesResource.count}
					title='scrapes'
					id='BitTorrentTrackerScrape_TimestampsView-scrapes'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
