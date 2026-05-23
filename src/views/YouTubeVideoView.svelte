<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubeVideo>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const video = useEntity(
		EntityType.YouTubeVideo,
		entityId,
		{
			$: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
			title: {},
			description: {},
			publishedAt: {},
			viewCount: {},
			likeCount: {},
			durationSeconds: {},
			commentCount: {},
			categoryId: {},
			liveBroadcastContent: {},
			tagLine: {},
			thumbnailUrl: {},
			$author: {},
			...(open ?
				{
					$$comments: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					},
				}
			:
				{}),
		},
	)

	const idKey = stringify(entityId)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
	import YouTubeCommentsView from '$/views/YouTubeCommentsView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeVideo}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<span>
			{entityId.videoId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={video}
			placeholderText="Loading video…"
		>
			{#snippet children(video)}
				{video.title ?? entityId.videoId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Video ids are fixed 11-character watch keys; metadata comes from the Data API or Piped stream payloads.
		</p>
		<p>
			publishedAt is ISO-8601 from Google; Piped may surface a different time string for the same upload.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Description</dt>
				<dd>
					<ResourceBoundary
						resource={video}
						placeholderText="Loading video…"
					>
						{#snippet children(video)}
							{#if video.description}
								{video.description}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Views</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.viewCount != null}
									{String(video.viewCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Likes</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.likeCount != null}
									{String(video.likeCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Comments</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.commentCount != null}
									{String(video.commentCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Category</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.categoryId}
									{video.categoryId}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Live broadcast</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.liveBroadcastContent}
									{video.liveBroadcastContent}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Tags</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.tagLine}
									{video.tagLine}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Duration</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.durationSeconds != null}
									{String(video.durationSeconds)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.publishedAt != null}
									{video.publishedAt}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Channel</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.$author}
									<YouTubeChannelView
										entityId={video.$author[EntityMetaKey.Id]}
										href={resolve(
											'/(social)/(youtube)/youtube/channel/[channelId]',
											{
												channelId: encodeURIComponent(
													video.$author[EntityMetaKey.Id].channelId,
													),
											},
										)}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Thumbnail</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.thumbnailUrl}
									<a
										href={video.thumbnailUrl}
										rel="noreferrer"
										target="_blank"
									>
										<img
											alt=""
											src={video.thumbnailUrl}
										/>
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.YouTubeVideo}
			{entityId}
		>
			<ResourceBoundary
				resource={video}
				placeholderText="Loading video…"
			>
				{#snippet children(_video)}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-video`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Watch page
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Description"
						href={`#${idKey}:description`}
					>Text</a>
					<a
						data-scroll-marker-label="Comment thread"
						href={`#${idKey}:comments`}
					>Comments</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Description">
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.description}
									<p>{video.description}</p>
								{:else}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											No description yet.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>
													Description text fills in when Youtube_Rest or Piped_Rest returns stream metadata for this watch key.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="Video description"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>

					<section data-scroll-marker-label="Comment thread">
						<YouTubeCommentsView
							entityFieldReference={{
								entityType: EntityType.YouTubeVideo,
								entityId,
								fieldName: '$$comments',
							}}
							href={resolve('/(social)/(youtube)/youtube/video/[videoId]/(video)/comments', {
								videoId: encodeURIComponent(entityId.videoId),
							})}
							id={`${idKey}:youtube-comments`}
							open={_open}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

