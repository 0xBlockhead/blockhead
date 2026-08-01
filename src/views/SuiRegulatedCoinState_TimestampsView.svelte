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
	}: EntityListViewProps<EntityType.SuiRegulatedCoinState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiRegulatedCoinState_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiRegulatedCoinStateTimestamp })}
		<EntityView
			entityType={EntityType.SuiRegulatedCoinState_Timestamp}
			entitySelector={suiRegulatedCoinStateTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui regulated coin state timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
