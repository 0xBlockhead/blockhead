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
	}: EntityListViewProps<EntityType.BlockheadBitTorrentClientState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadBitTorrentClientState_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				clientVersion: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadBitTorrentClientStateTimestamp })}
		{@const blockheadBitTorrentClientStateTimestampSelector = blockheadBitTorrentClientStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadBitTorrentClientState_Timestamp}
			entitySelector={blockheadBitTorrentClientStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadBitTorrentClientStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadBitTorrentClientStateTimestamp.clientVersion ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadBitTorrentClientStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
