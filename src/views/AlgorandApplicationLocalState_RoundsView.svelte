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
	}: EntityListViewProps<EntityType.AlgorandApplicationLocalState_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandApplicationLocalState_Round}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandApplicationLocalStateRound })}
		<EntityView
			entityType={EntityType.AlgorandApplicationLocalState_Round}
			entitySelector={algorandApplicationLocalStateRound[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand application local state round
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
