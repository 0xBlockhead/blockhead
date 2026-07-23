<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.YoutubeChannel>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.YoutubeChannel>
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
	const youtubeChannel = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			title: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			title: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel')
	const viewDomId = $derived('youtube-channel-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
	import YoutubeChannel_TimestampsView from '$/views/YoutubeChannel_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeChannel}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'channelId' in selection.entitySelector
			&& selection.entitySelector.channelId != null ?
				resolve('/youtube/channel/[channelId=stringSegment]', {
			channelId: encodeURIComponent(String(selection.entitySelector.channelId ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={youtubeChannel}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null && reference[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={youtubeChannel}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								description: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const description = resolvedEntity.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<div>
				<dt>Channel ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									channelId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const channelId = resolvedEntity.channelId}
							{#if channelId !== undefined && channelId !== null}
								<TruncatedValue value={String((channelId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								customUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const customUrl = resolvedEntity.customUrl}
						{#if customUrl !== undefined && customUrl !== null}
							<div>
								<dt>Handle alias</dt>
								<dd>
									<TruncatedValue value={String((customUrl) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								publishedAtMs: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const publishedAtMs = resolvedEntity.publishedAtMs}
						{#if publishedAtMs !== undefined && publishedAtMs !== null}
							<div>
								<dt>Published</dt>
								<dd>
									<Timestamp timestamp={Number(publishedAtMs)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				<CollapsibleTabs
					id={viewDomId + '-carousel-youtube-channel-content'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'youtube-channel-videos',
								label: 'Videos',
								ownsSection: true,
							},
							{
								id: 'youtube-channel-playlists',
								label: 'Playlists',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-content'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Videos and playlists</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerYoutubeChannelVideos(_context, Content)}
						{@const youtubeChannelContentYoutubeChannelVideosResource = selection
		.$$videos({
			sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		})}
						<ResourceBoundary
							resource={youtubeChannelContentYoutubeChannelVideosResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionYoutubeChannelVideos({ id, label, open, active })}
						{@const youtubeChannelContentYoutubeChannelVideosResource = selection
		.$$videos({
			sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		})}
						<ResourceBoundary
							resource={youtubeChannelContentYoutubeChannelVideosResource}
						>
							{#snippet children(youtubeVideo)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<YoutubeVideosView
										selection={youtubeChannelContentYoutubeChannelVideosResource}
										href={
											(selection.entitySelector != null && 'channelId' in selection.entitySelector && selection.entitySelector.channelId != null ? resolve('/youtube/channel/[channelId=stringSegment]/videos', {
												channelId: encodeURIComponent(String(selection.entitySelector.channelId ?? '')),
											}) : undefined)
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No YouTube videos.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerYoutubeChannelPlaylists(_context, Content)}
						{@const youtubeChannelContentYoutubeChannelPlaylistsResource = selection
		.$$playlists({
			sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		})}
						<ResourceBoundary
							resource={youtubeChannelContentYoutubeChannelPlaylistsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionYoutubeChannelPlaylists({ id, label, open, active })}
						{@const youtubeChannelContentYoutubeChannelPlaylistsResource = selection
		.$$playlists({
			sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		})}
						<ResourceBoundary
							resource={youtubeChannelContentYoutubeChannelPlaylistsResource}
						>
							{#snippet children(youtubePlaylist)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<YoutubePlaylistsView
										selection={youtubeChannelContentYoutubeChannelPlaylistsResource}
										href={
											(selection.entitySelector != null && 'channelId' in selection.entitySelector && selection.entitySelector.channelId != null ? resolve('/youtube/channel/[channelId=stringSegment]/playlists', {
												channelId: encodeURIComponent(String(selection.entitySelector.channelId ?? '')),
											}) : undefined)
										}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No YouTube playlists.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>

				<CollapsibleTabs
					id={viewDomId + '-carousel-youtube-channel-observations'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'youtube-channel-timestamps',
								label: 'Observations',
								ownsSection: true,
							},
						]
					}
					data-card
					class='network-view-collapsible-observations'
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Observations</HeadingComponent>
						</header>
					{/snippet}

					{#snippet MarkerYoutubeChannelTimestamps(_context, Content)}
						{@const youtubeChannelObservationsYoutubeChannelTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		})}
						<ResourceBoundary
							resource={youtubeChannelObservationsYoutubeChannelTimestampsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionYoutubeChannelTimestamps({ id, label, open, active })}
						{@const youtubeChannelObservationsYoutubeChannelTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		})}
						<ResourceBoundary
							resource={youtubeChannelObservationsYoutubeChannelTimestampsResource}
						>
							{#snippet children(youtubeChannelTimestamp)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<YoutubeChannel_TimestampsView
										selection={youtubeChannelObservationsYoutubeChannelTimestampsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No YouTube channel observations.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
	{/snippet}
</EntityView>
