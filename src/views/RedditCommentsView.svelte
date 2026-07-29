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
	}: EntityListViewProps<EntityType.RedditComment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
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
				{[(redditComment.body ?? ''), redditCommentSelector.fullname].filter(Boolean).join(' ') || redditCommentSelector.fullname || 'Reddit comment'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{redditComment.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
