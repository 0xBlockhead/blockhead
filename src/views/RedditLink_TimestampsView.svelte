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
			fields: {
				timestampMs: true,
				score: true,
				source: true,
				commentCount: true,
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
						fullname: encodeURIComponent(String(redditLinkTimestampSelector.$link.fullname)),
						timestampMs: String(redditLinkTimestampSelector.timestampMs),
						source: String(redditLinkTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{String(redditLinkTimestampSelector.timestampMs) || 'Reddit submission timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(redditLinkTimestamp.score ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[redditLinkTimestampSelector.source, (String(redditLinkTimestamp.commentCount ?? '') ? String(redditLinkTimestamp.commentCount ?? '') + ' comments' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
