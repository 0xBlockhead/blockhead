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
	}: EntityListViewProps<EntityType.TonNftItem> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftItem}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftItem })}
		<EntityView
			entityType={EntityType.TonNftItem}
			entitySelector={tonNftItem[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON NFT item
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
