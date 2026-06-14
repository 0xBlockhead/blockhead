<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]',
			{
				videoId: encodeURIComponent(selector.$comment.videoId),
				commentId: encodeURIComponent(selector.$comment.commentId),
			},
		),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.YouTubeComment_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const youTubeCommentTimestamp = subscribe(EntityType.YouTubeComment_Timestamp,
		selector,
		({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: { likeCount: true, replyCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeComment_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="YouTube comment snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={selector.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={selector.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped YouTube comment counters resolved from YouTube Data API and Piped comment metadata.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={youTubeCommentTimestamp}
			placeholderText="Loading YouTube comment snapshot..."
		>
			{#snippet children(youTubeCommentTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Likes',
								value: youTubeCommentTimestamp.fields.likeCount,
							},
							{
								label: 'Replies',
								value: youTubeCommentTimestamp.fields.replyCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
