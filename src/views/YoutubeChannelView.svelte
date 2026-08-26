<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.YoutubeChannel> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Youtube_Rest,
			Source.Piped_Rest,
			Source.Constants_Internal,
		],
	}))
	const youtubeChannel = $derived(viewSelection({
		fields: {
			title: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || selection.entitySelector.channelId || 'YouTube channel')
	const viewDomId = $derived('youtube-channel-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
				{
					channelId: encodeURIComponent(selection.entitySelector.channelId),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={youtubeChannel}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={youtubeChannel}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
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
				<dt>Channel ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.channelId} />
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								customUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const customUrl = entity.customUrl}
						{#if customUrl != null}
							<div>
								<dt>Handle alias</dt>
								<dd>
									<TruncatedValue value={customUrl} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								publishedAtMs: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const publishedAtMs = entity.publishedAtMs}
						{#if publishedAtMs != null}
							<div>
								<dt>Published</dt>
								<dd>
									<Timestamp timestamp={publishedAtMs} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-youtube-channel-content'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'youtube-channel-videos',
						label: 'Videos',
					},
					{
						id: 'youtube-channel-playlists',
						label: 'Playlists',
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

			{#snippet SectionYoutubeChannelVideos({ id, label })}
				<YoutubeVideosView
					selection={selection.$$videos}
					href={
						resolve(
							'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/videos',
							{
								channelId: encodeURIComponent(selection.entitySelector.channelId),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No YouTube videos.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionYoutubeChannelPlaylists({ id, label })}
				<YoutubePlaylistsView
					selection={selection.$$playlists}
					href={
						resolve(
							'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/playlists',
							{
								channelId: encodeURIComponent(selection.entitySelector.channelId),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No YouTube playlists.'
					id={`${id}-list`}
				/>
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

			{#snippet SectionYoutubeChannelTimestamps({ id, label })}
				<YoutubeChannel_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No YouTube channel observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
