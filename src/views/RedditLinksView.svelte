<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.RedditLink> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditLink}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Reddit_PublicJson,
			],
			fields: {
				title: true,
				fullname: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: redditLink })}
		{@const redditLinkSelector = redditLink[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RedditLink}
			entitySelector={redditLinkSelector}
			href={
				resolve(
					'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
					{
						fullname: encodeURIComponent(redditLinkSelector.fullname),
					}
				)
			}
		>
			{#snippet Title()}
				{[(redditLink.title ?? ''), redditLinkSelector.fullname].filter(Boolean).join(' ') || redditLinkSelector.fullname || 'Reddit submission'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{redditLink.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
