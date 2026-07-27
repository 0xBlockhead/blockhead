<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
			fields: {
				title: true,
				feedUrl: true,
				lastBuildDate: true,
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
						feedUrl: encodeURIComponent(String(rssFeedSelector.feedUrl)),
					}
				)
			}
		>
			{#snippet Title()}
				{[(rssFeed.title ?? ''), String(rssFeedSelector.feedUrl)].filter(Boolean).join(' ') || 'RSS feed'}
			{/snippet}

			{#snippet Value()}
				{String(rssFeedSelector.feedUrl)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(rssFeed.lastBuildDate ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
