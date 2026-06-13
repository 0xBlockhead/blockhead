<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(youtube)/youtube/video/[videoId]', {
			videoId: entityId.$video.videoId,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubeVideo_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const youTubeVideoTimestamp = subscribe(EntityType.YouTubeVideo_Timestamp,
		entityId,
		({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: { viewCount: true, likeCount: true, commentCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeVideo_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="YouTube video snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped YouTube video counters resolved from YouTube Data API and Piped video metadata.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={youTubeVideoTimestamp}
			placeholderText="Loading YouTube video snapshot..."
		>
			{#snippet children(youTubeVideoTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Views',
								value: youTubeVideoTimestamp.fields.viewCount,
							},
							{
								label: 'Likes',
								value: youTubeVideoTimestamp.fields.likeCount,
							},
							{
								label: 'Comments',
								value: youTubeVideoTimestamp.fields.commentCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
