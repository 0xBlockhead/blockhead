<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.BitTorrentFile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentFile}
	bind:open
	resource={
		selection({
			fields: {
				path: true,
				length: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentFile })}
		<EntityView
			entityType={EntityType.BitTorrentFile}
			entitySelector={bitTorrentFile[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{bitTorrentFile.path || 'bit torrent file'}
			{/snippet}

			{#snippet Value()}
				{bitTorrentFile.length}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
