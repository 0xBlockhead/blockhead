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
			selection: RegisteredEntityProxyResource<EntityType.YoutubePlaylist>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.YoutubePlaylist>
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
	const youtubePlaylist = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			title: true,
			publishedAtMs: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			title: true,
			publishedAtMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist')
	const viewDomId = $derived('youtube-playlist-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubePlaylist}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'playlistId' in selection.entitySelector
			&& selection.entitySelector.playlistId != null ?
				resolve('/youtube/playlist/[playlistId=stringSegment]', {
			playlistId: encodeURIComponent(String(selection.entitySelector.playlistId ?? '')),
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
		<ResourceBoundary resource={youtubePlaylist}>
			{#snippet children(entity)}
				{@const reference = entity.$thumbnail}
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
		<ResourceBoundary resource={youtubePlaylist}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={youtubePlaylist}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$channel}
				>
					{#snippet children(youtubeChannel)}
						{#if youtubeChannel != null && youtubeChannel[EntityMetaKey.Selector] != null}
							<YoutubeChannelView
								selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
								prefetched={youtubeChannel}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={youtubePlaylist}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const publishedAtMs0 = resolvedEntity.publishedAtMs}
				{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(publishedAtMs0)} />
					</span>
				{/if}
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
				<dt>Playlist ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									playlistId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const playlistId = resolvedEntity.playlistId}
							{#if playlistId !== undefined && playlistId !== null}
								<TruncatedValue value={String((playlistId) ?? '')} />
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

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$channel}
				>
					{#snippet children(youtubeChannel)}
						{#if youtubeChannel != null && youtubeChannel[EntityMetaKey.Selector] != null}
							<div>
								<dt>Channel</dt>
								<dd>
									<YoutubeChannelView
										selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
										prefetched={youtubeChannel}
										href={
											(
												youtubeChannel[EntityMetaKey.Selector] != null && 'channelId' in youtubeChannel[EntityMetaKey.Selector]
												&& youtubeChannel[EntityMetaKey.Selector].channelId != null ?
													resolve('/youtube/channel/[channelId=stringSegment]', {
												channelId: encodeURIComponent(String(youtubeChannel[EntityMetaKey.Selector].channelId ?? '')),
											})
											:
													undefined
											)
										}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const youtubePlaylistYoutubeVideosViewVideosResource = selection
		.$$videos({
			sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		})}
				<ResourceBoundary
					resource={youtubePlaylistYoutubeVideosViewVideosResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<YoutubeVideosView
							selection={youtubePlaylistYoutubeVideosViewVideosResource}
							countResource={youtubePlaylistYoutubeVideosViewVideosResource.count}
							title='Videos'
							href={
									(selection.entitySelector != null && 'playlistId' in selection.entitySelector && selection.entitySelector.playlistId != null ? resolve('/youtube/playlist/[playlistId=stringSegment]/videos', {
										playlistId: encodeURIComponent(String(selection.entitySelector.playlistId ?? '')),
									}) : undefined)
								}
							id='YoutubeVideosView-videos'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
