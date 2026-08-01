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
	}: EntityListViewProps<EntityType.TonNftCollection_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftCollection_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftCollectionTimestamp })}
		<EntityView
			entityType={EntityType.TonNftCollection_Timestamp}
			entitySelector={tonNftCollectionTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON NFT collection timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
