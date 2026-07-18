<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.YoutubeVideo>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.YoutubeVideo>>
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
	const youtubeVideo = $derived(selection({
		sources: selection.sources,
		fields: {
			title: true,
			publishedAtMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.videoId) ?? '')].filter(Boolean).join(' ') || 'YouTube video')
	const viewDomId = $derived('youtube-video-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.videoId !== undefined ? resolve('/youtube/video/[videoId=stringSegment]', {
			videoId: encodeURIComponent(String(pendingEntity.videoId ?? '')),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={youtubeVideo}>
			{#snippet children(entity)}
				{@const reference = entity.$thumbnail}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={youtubeVideo}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$author}
					>
						{#snippet children(youtubeChannel)}
							{#if youtubeChannel != null && youtubeChannel[EntityMetaKey.Selector] != null}
								<YoutubeChannelView
									selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
									prefetched={youtubeChannel}
									href={
									(youtubeChannel[EntityMetaKey.Selector].channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]', {
										channelId: encodeURIComponent(String(youtubeChannel[EntityMetaKey.Selector].channelId ?? '')),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={youtubeVideo}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$author}
					>
						{#snippet children(youtubeChannel)}
							{#if youtubeChannel != null && youtubeChannel[EntityMetaKey.Selector] != null}
								<YoutubeChannelView
									selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
									prefetched={youtubeChannel}
									href={
									(youtubeChannel[EntityMetaKey.Selector].channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]', {
										channelId: encodeURIComponent(String(youtubeChannel[EntityMetaKey.Selector].channelId ?? '')),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const publishedAtMs0 = pendingEntity.publishedAtMs}
			{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(publishedAtMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={youtubeVideo}>
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
		{/if}
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
				<dt>Video ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									videoId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const videoId = resolvedEntity.videoId}
							{#if videoId !== undefined && videoId !== null}
								<TruncatedValue value={String((videoId) ?? '')} />
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
					resource={selection.$author}
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
											(youtubeChannel[EntityMetaKey.Selector].channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]', {
												channelId: encodeURIComponent(String(youtubeChannel[EntityMetaKey.Selector].channelId ?? '')),
											}) : undefined)
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
		{#if detailsOpen}
			<YoutubeCommentsView
				selection={
						selection.$$comments({
							sources: [
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
							count: true,
						})
					}
				title='Comments'
				href={
						(selection.entitySelector.videoId !== undefined ? resolve('/youtube/video/[videoId=stringSegment]/comments', {
							videoId: encodeURIComponent(String(selection.entitySelector.videoId ?? '')),
						}) : undefined)
					}
				id='YoutubeCommentsView-comments'
			/>
		{/if}
	{/snippet}
</EntityView>
