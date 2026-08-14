<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
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
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeCommentsView from '$/views/YoutubeCommentsView.svelte'
	import YoutubeVideo_TimestampsView from '$/views/YoutubeVideo_TimestampsView.svelte'
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
					{@const youtubeChannelInitial = untrack(() => youtubeChannel)}
					<YoutubeChannelView
						selection={select(EntityType.YoutubeChannel, (youtubeChannel ?? youtubeChannelInitial)[EntityMetaKey.Selector])}
						prefetched={youtubeChannel ?? youtubeChannelInitial}
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
							{@const youtubeChannelInitial = untrack(() => youtubeChannel)}
							<div>
								<dt>Channel</dt>
								<dd>
									<YoutubeChannelView
										selection={select(EntityType.YoutubeChannel, (youtubeChannel ?? youtubeChannelInitial)[EntityMetaKey.Selector])}
										prefetched={youtubeChannel ?? youtubeChannelInitial}
										layout={EntityLayout.Value}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							durationSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const durationSeconds = entity.durationSeconds}
					{#if durationSeconds != null}
						<div>
							<dt>Duration</dt>
							<dd>
								<NumberValue
									value={durationSeconds}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							liveBroadcastContent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liveBroadcastContent = entity.liveBroadcastContent}
					{#if liveBroadcastContent != null}
						<div>
							<dt>Live status</dt>
							<dd>
								{liveBroadcastContent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							categoryId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const categoryId = entity.categoryId}
					{#if categoryId != null}
						<div>
							<dt>Category</dt>
							<dd>
								{categoryId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tags: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tags = entity.tags}
					{#if tags != null}
						<div>
							<dt>Tags</dt>
							<dd>
								{tags.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<YoutubeVideo_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
