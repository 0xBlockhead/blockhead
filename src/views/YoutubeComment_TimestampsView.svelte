<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.YoutubeComment_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeComment_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$comment: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubeCommentTimestamp })}
		{@const youtubeCommentTimestampSelector = youtubeCommentTimestamp[EntityMetaKey.Selector]}
		{@const comment = youtubeCommentTimestampSelector.$comment}
		<EntityView
			entityType={EntityType.YoutubeComment_Timestamp}
			entitySelector={youtubeCommentTimestampSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
					{
						videoId: encodeURIComponent(comment.videoId),
						commentId: encodeURIComponent(comment.commentId),
						timestampMs: String(youtubeCommentTimestampSelector.timestampMs),
						source: youtubeCommentTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubeCommentTimestamp.$comment.text ?? '') || 'YouTube comment', String(youtubeCommentTimestampSelector.timestampMs), youtubeCommentTimestampSelector.source].filter(Boolean).join(' ') || 'YouTube comment observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
