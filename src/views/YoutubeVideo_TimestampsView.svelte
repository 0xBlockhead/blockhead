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
	}: EntityListViewProps<EntityType.YoutubeVideo_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeVideo_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$video: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubeVideoTimestamp })}
		{@const youtubeVideoTimestampSelector = youtubeVideoTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.YoutubeVideo_Timestamp}
			entitySelector={youtubeVideoTimestampSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
					{
						videoId: encodeURIComponent(youtubeVideoTimestampSelector.$video.videoId),
						timestampMs: String(youtubeVideoTimestampSelector.timestampMs),
						source: youtubeVideoTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubeVideoTimestamp.$video.title ?? '') || youtubeVideoTimestampSelector.$video.videoId || 'YouTube video', String(youtubeVideoTimestampSelector.timestampMs), youtubeVideoTimestampSelector.source].filter(Boolean).join(' ') || 'YouTube video observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
