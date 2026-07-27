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
	}: EntityListViewProps<EntityType.AlgorandAssetHolding_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAssetHolding_Round}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandAssetHoldingRound })}
		<EntityView
			entityType={EntityType.AlgorandAssetHolding_Round}
			entitySelector={algorandAssetHoldingRound[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand asset holding round
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
