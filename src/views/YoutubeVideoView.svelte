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
	}: EntitySelectionViewProps<EntityType.YoutubeVideo> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Youtube_Rest,
			Source.Piped_Rest,
			Source.Constants_Internal,
		],
	}))
	const youtubeVideo = $derived(viewSelection({
		fields: {
			title: true,
			publishedAtMs: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || selection.entitySelector.videoId || 'YouTube video')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeCommentsView from '$/views/YoutubeCommentsView.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeVideo}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
				{
					videoId: encodeURIComponent(selection.entitySelector.videoId),
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
		<ResourceBoundary resource={youtubeVideo}>
			{#snippet children(entity)}
				{@const reference = entity.$thumbnail}
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
		<ResourceBoundary resource={youtubeVideo}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$author}
		>
			{#snippet children(youtubeChannel)}
				{#if youtubeChannel != null}
					<YoutubeChannelView
						selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
						prefetched={youtubeChannel}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={youtubeVideo}>
			{#snippet children(entity)}
				{@const publishedAtMs = entity.publishedAtMs}
				{#if publishedAtMs != null}
					<span data-text="muted">
						<Timestamp timestamp={publishedAtMs} />
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
				<dt>Video ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.videoId} />
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={youtubeVideo}
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

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$author}
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
		{@const commentsResource = selection.$$comments}
		<ResourceBoundary
			resource={commentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<YoutubeCommentsView
						selection={commentsResource}
						countResource={commentsResource.count}
						title='Comments'
						href={
							resolve(
								'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/comments',
								{
									videoId: encodeURIComponent(selection.entitySelector.videoId),
								}
							)
						}
						id='comments'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
