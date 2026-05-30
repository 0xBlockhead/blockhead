<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { youTubeVideoCategoryByCategoryId, youTubeVideoLiveBroadcastPhaseByLiveBroadcastContent } from '$/constants/Social/YouTube.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
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
			publishedAtMs: {},
			viewCount: {},
			likeCount: {},
			durationSeconds: {},
			commentCount: {},
			$$timestamps: {
				$: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				$limit: 1,
			},
			categoryId: {},
			liveBroadcastContent: {},
			tags: {},
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
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
	import YouTubeCommentsView from '$/views/YouTubeCommentsView.svelte'
	import YouTubeVideo_TimestampsView from '$/views/YouTubeVideo_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeVideo}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={video}>
			{#snippet children(video)}
				{#if video.thumbnailUrl}
					<IconComponent
						src={video.thumbnailUrl}
						alt={video.title ?? entityId.videoId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

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
		<ResourceBoundary
			resource={video}
			placeholderText="Loading video…"
		>
			{#snippet children(video)}
				{#if video.description}
					<p>
						<TruncatedValue
							value={video.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={video}
					placeholderText="Loading video…"
				>
					{#snippet children(video)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Views',
									value: video.$$timestamps[0]?.viewCount ?? video.viewCount,
								},
								{
									label: 'Likes',
									value: video.$$timestamps[0]?.likeCount ?? video.likeCount,
								},
								{
									label: 'Comments',
									value: video.$$timestamps[0]?.commentCount ?? video.commentCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
				<div>
					<dt>Category</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.categoryId}
									{youTubeVideoCategoryByCategoryId[video.categoryId]?.label ?? video.categoryId}
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
									{youTubeVideoLiveBroadcastPhaseByLiveBroadcastContent[video.liveBroadcastContent].label}
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
								{#if video.tags}
									{video.tags.join(', ')}
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
								{#if video.publishedAtMs != null}
									<Timestamp timestamp={video.publishedAtMs} />
								{:else if video.publishedAt != null}
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
		<CollapsibleTabs
				id={`${idKey}:carousel-video`}
				sectionIdPrefix={idKey}
					sections={collapsibleTabsSections([
						{ id: 'description', label: 'Description' },
						{ id: 'comments', label: 'Comment thread' },
						{ id: 'metric-snapshots', label: 'Metrics' },
					])}
				data-card
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

				{#snippet SectionDescription()}
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
				{/snippet}

					{#snippet SectionComments()}
						<YouTubeCommentsView
						CollapsibleProps={{ canToggle: false }}
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
					{/snippet}

					{#snippet SectionMetricSnapshots()}
						<YouTubeVideo_TimestampsView
							entityFieldReference={{
								entityType: EntityType.YouTubeVideo,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`${idKey}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
