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
	}: EntityListViewProps<EntityType.RedditComment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditComment}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Reddit_PublicJson,
			],
			fields: {
				body: true,
				fullname: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: redditComment })}
		{@const redditCommentSelector = redditComment[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RedditComment}
			entitySelector={redditCommentSelector}
			href={
				resolve(
					'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
					{
						fullname: encodeURIComponent(redditCommentSelector.fullname),
					}
				)
			}
		>
			{#snippet Title()}
				{(redditComment.body ?? '') || redditCommentSelector.fullname || 'Reddit comment'}
			{/snippet}

			{#snippet Value()}
				{redditCommentSelector.fullname}
			{/snippet}

			{#snippet HeadingAfter()}
				{#if redditComment.createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={redditComment.createdAt} />
					</span>
				{/if}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
