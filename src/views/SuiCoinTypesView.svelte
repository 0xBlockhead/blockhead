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
	}: EntityListViewProps<EntityType.SuiCoinType> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiCoinType}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiCoinType })}
		<EntityView
			entityType={EntityType.SuiCoinType}
			entitySelector={suiCoinType[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui coin type
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
