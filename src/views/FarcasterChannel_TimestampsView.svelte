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
				$icon: true,
				name: true,
				$channel: true,
				timestampMs: true,
				source: true,
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
				'id' in farcasterChannelTimestampSelector.$channel ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
						{
							channelId: farcasterChannelTimestampSelector.$channel.id,
							timestampMs: String(farcasterChannelTimestampSelector.timestampMs),
							source: farcasterChannelTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[(farcasterChannelTimestamp.name ?? ''), farcasterChannelTimestamp.$channel.id || 'Farcaster channel'].filter(Boolean).join(' ') || 'Farcaster channel observation'}
			{/snippet}

			{#snippet Value()}
				{farcasterChannelTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{farcasterChannelTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
