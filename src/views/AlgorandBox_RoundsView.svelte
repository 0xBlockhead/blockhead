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
	}: EntityListViewProps<EntityType.AlgorandBox_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandBox_Round}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandBoxRound })}
		<EntityView
			entityType={EntityType.AlgorandBox_Round}
			entitySelector={algorandBoxRound[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand box round
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
