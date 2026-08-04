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
	}: EntityListViewProps<EntityType.RedditLink> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
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
				{(redditLink.title ?? '') || redditLinkSelector.fullname || 'Reddit submission'}
			{/snippet}

			{#snippet Value()}
				{redditLinkSelector.fullname}
			{/snippet}

			{#snippet HeadingAfter()}
				{#if redditLink.createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={redditLink.createdAt} />
					</span>
				{/if}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
