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
	}: EntityListViewProps<EntityType.BitTorrentPiece> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentPiece}
	bind:open
	resource={
		selection({
			fields: {
				pieceIndex: true,
				length: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentPiece })}
		{@const bitTorrentPieceSelector = bitTorrentPiece[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitTorrentPiece}
			entitySelector={bitTorrentPieceSelector}
		>
			{#snippet Title()}
				{bitTorrentPieceSelector.pieceIndex}
			{/snippet}

			{#snippet Value()}
				{bitTorrentPiece.length ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
