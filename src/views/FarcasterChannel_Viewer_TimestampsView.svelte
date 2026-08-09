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
	}: EntityListViewProps<EntityType.FarcasterChannel_Viewer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterChannel_Viewer_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$channel: true,
					$viewer: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: farcasterChannelViewerTimestamp })}
		{@const farcasterChannelViewerTimestampSelector = farcasterChannelViewerTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterChannel_Viewer_Timestamp}
			entitySelector={farcasterChannelViewerTimestampSelector}
			href={
				'id' in farcasterChannelViewerTimestampSelector.$channel ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/viewer/[fid=farcasterFid]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							channelId: farcasterChannelViewerTimestampSelector.$channel.id,
							fid: String(farcasterChannelViewerTimestampSelector.$viewer.fid),
							timestampMs: String(farcasterChannelViewerTimestampSelector.timestampMs),
							source: farcasterChannelViewerTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{farcasterChannelViewerTimestamp.$channel.id || 'Farcaster channel'}
			{/snippet}

			{#snippet Value()}
				{[(farcasterChannelViewerTimestamp.$viewer.displayName ?? ''), (farcasterChannelViewerTimestamp.$viewer.username ?? ''), String(farcasterChannelViewerTimestampSelector.$viewer.fid)].filter(Boolean).join(' ') || 'Farcaster user'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(farcasterChannelViewerTimestampSelector.timestampMs), farcasterChannelViewerTimestampSelector.source].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
