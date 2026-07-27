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
	}: EntityListViewProps<EntityType.SorobanContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanContractTimestamp })}
		<EntityView
			entityType={EntityType.SorobanContract_Timestamp}
			entitySelector={sorobanContractTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				soroban contract timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
