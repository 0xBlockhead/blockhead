<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BitTorrentMetainfo> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentMetainfo}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				hashVersion: true,
				infoHash: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentMetainfo })}
		{@const bitTorrentMetainfoSelector = bitTorrentMetainfo[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitTorrentMetainfo}
			entitySelector={bitTorrentMetainfoSelector}
		>
			{#snippet Title()}
				{(bitTorrentMetainfo.name ?? '') || bitTorrentMetainfoSelector.infoHash || 'bit torrent metainfo'}
			{/snippet}

			{#snippet Value()}
				{bitTorrentMetainfoSelector.hashVersion}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
