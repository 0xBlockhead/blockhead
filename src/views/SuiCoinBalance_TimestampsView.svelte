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
	}: EntityListViewProps<EntityType.SuiCoinBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiCoinBalance_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiCoinBalanceTimestamp })}
		<EntityView
			entityType={EntityType.SuiCoinBalance_Timestamp}
			entitySelector={suiCoinBalanceTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui coin balance timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
