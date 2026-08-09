<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RedditSubreddit> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditSubreddit}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Reddit_PublicJson,
					Source.Reddit_Rest,
				],
				fields: {
					title: true,
					name: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: redditSubreddit })}
		{@const redditSubredditSelector = redditSubreddit[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RedditSubreddit}
			entitySelector={redditSubredditSelector}
			href={
				resolve(
					'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
					{
						name: encodeURIComponent(redditSubredditSelector.name),
					}
				)
			}
		>
			{#snippet Title()}
				{[(redditSubreddit.title ?? ''), 'r/' + redditSubredditSelector.name].filter(Boolean).join(' ') || 'r/' + redditSubredditSelector.name}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
