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
	}: EntityListViewProps<EntityType.YoutubeVideo> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeVideo}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				videoId: true,
				$author: true,
				publishedAtMs: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubeVideo })}
		{@const youtubeVideoSelector = youtubeVideo[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.YoutubeVideo}
			entitySelector={youtubeVideoSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
					{
						videoId: encodeURIComponent(String(youtubeVideoSelector.videoId)),
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubeVideo.title ?? ''), youtubeVideoSelector.videoId].filter(Boolean).join(' ') || youtubeVideoSelector.videoId || 'YouTube video'}
			{/snippet}

			{#snippet Value()}
				{youtubeVideo.$author == null ? '' : (youtubeVideo.$author.title ?? '') || youtubeVideo.$author.channelId || 'YouTube channel'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(youtubeVideo.publishedAtMs ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
