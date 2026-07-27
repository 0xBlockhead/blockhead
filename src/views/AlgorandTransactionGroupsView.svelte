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
	}: EntityListViewProps<EntityType.AlgorandTransactionGroup> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTransactionGroup}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandTransactionGroup })}
		<EntityView
			entityType={EntityType.AlgorandTransactionGroup}
			entitySelector={algorandTransactionGroup[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand transaction group
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
