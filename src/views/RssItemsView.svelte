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
	}: EntityListViewProps<EntityType.RssItem> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssItem}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				itemIdentity: true,
				publishedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: rssItem })}
		{@const rssItemSelector = rssItem[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RssItem}
			entitySelector={rssItemSelector}
			href={
				resolve(
					'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
					{
						feedUrl: encodeURIComponent(rssItemSelector.$feed.feedUrl),
						itemIdentityKind: rssItemSelector.itemIdentityKind,
						itemIdentity: encodeURIComponent(rssItemSelector.itemIdentity),
					}
				)
			}
		>
			{#snippet Title()}
				{[(rssItem.title ?? ''), rssItemSelector.itemIdentity].filter(Boolean).join(' ') || 'RSS item'}
			{/snippet}

			{#snippet Value()}
				{rssItemSelector.itemIdentity}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{rssItem.publishedAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
