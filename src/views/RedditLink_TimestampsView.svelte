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
	}: EntityListViewProps<EntityType.RedditLink_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditLink_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					score: true,
					source: true,
					commentCount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: redditLinkTimestamp })}
		{@const redditLinkTimestampSelector = redditLinkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RedditLink_Timestamp}
			entitySelector={redditLinkTimestampSelector}
			href={
				resolve(
					'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						fullname: encodeURIComponent(redditLinkTimestampSelector.$link.fullname),
						timestampMs: String(redditLinkTimestampSelector.timestampMs),
						source: redditLinkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{redditLinkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{redditLinkTimestamp.score ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[redditLinkTimestampSelector.source, (redditLinkTimestamp.commentCount != null ? String(redditLinkTimestamp.commentCount) + ' comments' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
