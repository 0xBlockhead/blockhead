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
	}: EntityListViewProps<EntityType.SuiBalanceChange> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiBalanceChange}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiBalanceChange })}
		<EntityView
			entityType={EntityType.SuiBalanceChange}
			entitySelector={suiBalanceChange[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui balance change
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
