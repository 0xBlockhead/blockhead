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
	}: EntityListViewProps<EntityType.BitTorrentDhtNode_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentDhtNode_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				nodeId: true,
				reachable: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentDhtNodeTimestamp })}
		{@const bitTorrentDhtNodeTimestampSelector = bitTorrentDhtNodeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitTorrentDhtNode_Timestamp}
			entitySelector={bitTorrentDhtNodeTimestampSelector}
		>
			{#snippet Title()}
				{bitTorrentDhtNodeTimestampSelector.nodeId || 'bit torrent DHT node timestamp'}
			{/snippet}

			{#snippet Value()}
				{bitTorrentDhtNodeTimestamp.reachable ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitTorrentDhtNodeTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
