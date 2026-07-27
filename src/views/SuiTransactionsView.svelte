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
	}: EntityListViewProps<EntityType.SuiTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiTransaction })}
		<EntityView
			entityType={EntityType.SuiTransaction}
			entitySelector={suiTransaction[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui transaction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
