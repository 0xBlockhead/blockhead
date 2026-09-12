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
	}: EntityListViewProps<EntityType.RssFeed> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssFeed}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Constants_Internal,
				Source.Local_Internal,
			],
			fields: {
				title: true,
				feedUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: rssFeed })}
		{@const rssFeedSelector = rssFeed[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RssFeed}
			entitySelector={rssFeedSelector}
			href={
				resolve(
					'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
					{
						feedUrl: encodeURIComponent(rssFeedSelector.feedUrl),
					}
				)
			}
		>
			{#snippet Title()}
				{[(rssFeed.title ?? ''), rssFeedSelector.feedUrl].filter(Boolean).join(' ') || 'RSS feed'}
			{/snippet}

			{#snippet Value()}
				{rssFeedSelector.feedUrl}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
