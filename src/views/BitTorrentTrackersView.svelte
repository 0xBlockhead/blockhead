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
	}: EntityListViewProps<EntityType.BitTorrentTracker> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentTracker}
	bind:open
	resource={
		selection({
			fields: {
				trackerUrl: true,
				trackerKind: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentTracker })}
		{@const bitTorrentTrackerSelector = bitTorrentTracker[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitTorrentTracker}
			entitySelector={bitTorrentTrackerSelector}
			href={
				resolve(
					'/bittorrent/tracker/[trackerUrl=stringSegment]',
					{
						trackerUrl: bitTorrentTrackerSelector.trackerUrl,
					}
				)
			}
		>
			{#snippet Title()}
				{bitTorrentTrackerSelector.trackerUrl || 'bit torrent tracker'}
			{/snippet}

			{#snippet Value()}
				{bitTorrentTracker.trackerKind}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
