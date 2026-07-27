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
	}: EntityListViewProps<EntityType.YoutubeChannel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeChannel}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				channelId: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubeChannel })}
		{@const youtubeChannelSelector = youtubeChannel[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.YoutubeChannel}
			entitySelector={youtubeChannelSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
					{
						channelId: encodeURIComponent(String(youtubeChannelSelector.channelId)),
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubeChannel.title ?? ''), youtubeChannelSelector.channelId].filter(Boolean).join(' ') || youtubeChannelSelector.channelId || 'YouTube channel'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
