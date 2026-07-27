<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.YoutubeComment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeComment}
	bind:open
	resource={
		selection({
			fields: {
				authorDisplayName: true,
				text: true,
				publishedAtMs: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubeComment })}
		{@const youtubeCommentSelector = youtubeComment[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.YoutubeComment}
			entitySelector={youtubeCommentSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]',
					{
						videoId: encodeURIComponent(String(youtubeCommentSelector.videoId)),
						commentId: encodeURIComponent(String(youtubeCommentSelector.commentId)),
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubeComment.authorDisplayName ?? ''), (youtubeComment.text ?? '')].filter(Boolean).join(' ') || 'YouTube comment'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(youtubeComment.publishedAtMs ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
