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
	}: EntityListViewProps<EntityType.BitTorrentAnnounce_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentAnnounce_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentAnnounceTimestamp })}
		{@const bitTorrentAnnounceTimestampSelector = bitTorrentAnnounceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitTorrentAnnounce_Timestamp}
			entitySelector={bitTorrentAnnounceTimestampSelector}
		>
			{#snippet Title()}
				{bitTorrentAnnounceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bitTorrentAnnounceTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitTorrentAnnounceTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
