<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { youTubeVideoCategories, youTubeVideoLiveBroadcastPhases } from '$/constants/Social/YouTube.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/(social)/(youtube)/youtube/video/[videoId]', {
			videoId: entityId.videoId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubeVideo>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
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
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
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
			{#snippet children(loadedVideo)}
				{loadedVideo.title ?? entityId.videoId}
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
						{#snippet children(loadedVideo)}
							{#if loadedVideo.description}
								{loadedVideo.description}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.viewCount != null}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.likeCount != null}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.commentCount != null}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.categoryId}
									{youTubeVideoCategories[loadedVideo.categoryId]?.label ?? loadedVideo.categoryId}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.liveBroadcastContent}
									{youTubeVideoLiveBroadcastPhases[loadedVideo.liveBroadcastContent].label}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.tagLine}
									{loadedVideo.tagLine}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.durationSeconds != null}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.publishedAt != null}
									{loadedVideo.publishedAt}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.$author}
									<YouTubeChannelView
										entityId={loadedVideo.$author[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.thumbnailUrl}
									<a
										href={loadedVideo.thumbnailUrl}
										rel="noreferrer"
										target="_blank"
									>
										<img
											alt=""
											src={loadedVideo.thumbnailUrl}
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
				{#snippet children(_readyData)}
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
							{#snippet children(loadedVideo)}
								{#if loadedVideo.description}
									<p>{loadedVideo.description}</p>
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
							href={resolve(
			'/(social)/(youtube)/youtube/video/[videoId]/(video)/comments',
			{ videoId: encodeURIComponent(entityId.videoId) },
		)}
							entityFieldReference={{
								entityType: EntityType.YouTubeVideo,
								entityId,
								fieldName: '$$comments',
							}}
							id={`${idKey}:youtube-comments`}
							open={_open}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


