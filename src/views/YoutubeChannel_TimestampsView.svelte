<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.YoutubeChannel_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeChannel_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$channel: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubeChannelTimestamp })}
		{@const youtubeChannelTimestampSelector = youtubeChannelTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.YoutubeChannel_Timestamp}
			entitySelector={youtubeChannelTimestampSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
					{
						channelId: encodeURIComponent(youtubeChannelTimestampSelector.$channel.channelId),
						timestampMs: String(youtubeChannelTimestampSelector.timestampMs),
						source: youtubeChannelTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubeChannelTimestamp.$channel.title ?? '') || youtubeChannelTimestampSelector.$channel.channelId || 'YouTube channel', String(youtubeChannelTimestampSelector.timestampMs), youtubeChannelTimestampSelector.source].filter(Boolean).join(' ') || 'YouTube channel observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
