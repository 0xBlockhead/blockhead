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
	}: EntityListViewProps<EntityType.FarcasterChannel_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterChannel_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$channel: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: farcasterChannelTimestamp })}
		{@const farcasterChannelTimestampSelector = farcasterChannelTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterChannel_Timestamp}
			entitySelector={farcasterChannelTimestampSelector}
			href={
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/observations/[timestampMs=nonNegativeInteger]',
					{
						channelId: String(farcasterChannelTimestampSelector.$channel.id),
						timestampMs: String(farcasterChannelTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{[farcasterChannelTimestamp.$channel.name, farcasterChannelTimestampSelector.$channel.id].filter(Boolean).join(' ') || 'Farcaster channel'}
			{/snippet}

			{#snippet Value()}
				{String(farcasterChannelTimestampSelector.timestampMs)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
