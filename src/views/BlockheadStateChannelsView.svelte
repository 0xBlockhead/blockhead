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
		title = 'Channels',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadStateChannel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannel}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadStateChannel })}
		{@const blockheadStateChannelSelector = blockheadStateChannel[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadStateChannel}
			entitySelector={blockheadStateChannelSelector}
			href={
				resolve(
					'/channel/[channelId=stringSegment]',
					{
						channelId: String(blockheadStateChannelSelector.id),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadStateChannelSelector.id || 'blockhead state channel'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadStateChannel.createdAt)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
