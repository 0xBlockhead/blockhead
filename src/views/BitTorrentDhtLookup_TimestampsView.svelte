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
	}: EntityListViewProps<EntityType.BitTorrentDhtLookup_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentDhtLookup_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				infoHash: true,
				status: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentDhtLookupTimestamp })}
		{@const bitTorrentDhtLookupTimestampSelector = bitTorrentDhtLookupTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitTorrentDhtLookup_Timestamp}
			entitySelector={bitTorrentDhtLookupTimestampSelector}
		>
			{#snippet Title()}
				{bitTorrentDhtLookupTimestampSelector.infoHash || 'bit torrent DHT lookup timestamp'}
			{/snippet}

			{#snippet Value()}
				{bitTorrentDhtLookupTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitTorrentDhtLookupTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
