<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { youTubeVideoCategoryByCategoryId, youTubeVideoLiveBroadcastPhaseByLiveBroadcastContent } from '$/constants/Social/YouTube.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(youtube)/youtube/video/[videoId]', {
			videoId: selector.videoId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.YouTubeVideo>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const video = $derived(
		proxy(
			EntityType.YouTubeVideo,
			selector,
			({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: {
				title: true,
				description: true,
				publishedAt: true,
				publishedAtMs: true,
				durationSeconds: true,
				$$timestamps: ({ sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				], limit: 1 }),
				categoryId: true,
				liveBroadcastContent: true,
				tags: true,
				thumbnailUrl: true,
				$author: true,
				...(open && {
					$$comments: ({ sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
					] }),
				}),
			} }),
		)
	)

	const idKey = $derived(stringify(selector))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
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
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={video}>
			{#snippet children(video)}
				{#if video.fields.thumbnailUrl}
					<IconComponent
						src={video.fields.thumbnailUrl}
						alt={video.fields.title ?? selector.videoId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{selector.videoId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={video}
			placeholderText="Loading video…"
		>
			{#snippet children(video)}
				{video.fields.title ?? selector.videoId}
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

	{#snippet Content({})}
		<ResourceBoundary
			resource={video}
			placeholderText="Loading video…"
		>
			{#snippet children(video)}
				{#if video.fields.description}
					<p>
						<TruncatedValue
							value={video.fields.description}
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
									value: video.fields.$$timestamps.values.at(0)?.viewCount,
								},
								{
									label: 'Likes',
									value: video.fields.$$timestamps.values.at(0)?.likeCount,
								},
								{
									label: 'Comments',
									value: video.fields.$$timestamps.values.at(0)?.commentCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<div>
					<dt>Category</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.categoryId}
									{youTubeVideoCategoryByCategoryId[video.fields.categoryId]?.label ?? video.fields.categoryId}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Live broadcast</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.liveBroadcastContent}
									{youTubeVideoLiveBroadcastPhaseByLiveBroadcastContent[video.fields.liveBroadcastContent].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Tags</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.tags}
									{video.fields.tags.join(', ')}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Duration</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.durationSeconds != null}
									{String(video.fields.durationSeconds)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.publishedAtMs != null}
									<Timestamp timestamp={video.fields.publishedAtMs} />
								{:else if video.fields.publishedAt != null}
									{video.fields.publishedAt}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Channel</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.$author}
									<YouTubeChannelView
										selector={video.fields.$author[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}

										open={false}
										/>
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
						{#if video.fields.description}
							<p>{video.fields.description}</p>
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
						{ videoId: encodeURIComponent(selector.videoId) },
					)}
					entityFieldReference={{
						entityType: EntityType.YouTubeVideo,
						selector,
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
						selector,
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
