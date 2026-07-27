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
	}: EntityListViewProps<EntityType.RedditSubreddit_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditSubreddit_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				subscriberCount: true,
				source: true,
				activeUserCount: true,
			},
		})
	}
>
	{#snippet Item({ item: redditSubredditTimestamp })}
		{@const redditSubredditTimestampSelector = redditSubredditTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RedditSubreddit_Timestamp}
			entitySelector={redditSubredditTimestampSelector}
			href={
				resolve(
					'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						name: encodeURIComponent(String(redditSubredditTimestampSelector.$subreddit.name)),
						timestampMs: String(redditSubredditTimestampSelector.timestampMs),
						source: String(redditSubredditTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{String(redditSubredditTimestampSelector.timestampMs) || 'Reddit subreddit timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(redditSubredditTimestamp.subscriberCount ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[redditSubredditTimestampSelector.source, (String(redditSubredditTimestamp.activeUserCount ?? '') ? String(redditSubredditTimestamp.activeUserCount ?? '') + ' active' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
