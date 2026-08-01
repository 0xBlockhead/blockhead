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
	}: EntityListViewProps<EntityType.TonNftCollection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftCollection}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftCollection })}
		<EntityView
			entityType={EntityType.TonNftCollection}
			entitySelector={tonNftCollection[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON NFT collection
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
