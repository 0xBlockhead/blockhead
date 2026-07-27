<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.YoutubePlaylist> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Youtube_Rest,
			Source.Piped_Rest,
			Source.Constants_Internal,
		],
	}))
	const youtubePlaylist = $derived(viewSelection({
		fields: {
			title: true,
			publishedAtMs: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.title ?? '') || (pendingEntity.playlistId ?? '') || 'YouTube playlist')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]',
			{
				playlistId: encodeURIComponent(String(selection.entitySelector.playlistId)),
			}
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
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$channel}
		>
			{#snippet children(youtubeChannel)}
				{#if youtubeChannel != null}
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

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={youtubePlaylist}>
			{#snippet children(entity)}
				{@const publishedAtMs0 = entity.publishedAtMs}
				{#if publishedAtMs0 != null}
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
						viewSelection({
							fields: {
								description: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const description = entity.description}
						{#if description != null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{description}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<div>
				<dt>Playlist ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.playlistId} />
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={youtubePlaylist}
				>
					{#snippet children(entity)}
						{@const publishedAtMs = entity.publishedAtMs}
						{#if publishedAtMs != null}
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
						{#if youtubeChannel != null}
							<div>
								<dt>Channel</dt>
								<dd>
									<YoutubeChannelView
										selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
										prefetched={youtubeChannel}
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
		{@const youtubePlaylistYoutubeVideosViewVideosResource = selection.$$videos}
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
							resolve(
								'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/videos',
								{
									playlistId: encodeURIComponent(String(selection.entitySelector.playlistId)),
								}
							)
						}
						id='videos'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
