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
	}: EntityListViewProps<EntityType.RedditComment_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditComment_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					score: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: redditCommentTimestamp })}
		{@const redditCommentTimestampSelector = redditCommentTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RedditComment_Timestamp}
			entitySelector={redditCommentTimestampSelector}
			href={
				resolve(
					'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						fullname: encodeURIComponent(redditCommentTimestampSelector.$comment.fullname),
						timestampMs: String(redditCommentTimestampSelector.timestampMs),
						source: redditCommentTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{redditCommentTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{redditCommentTimestamp.score ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{redditCommentTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
