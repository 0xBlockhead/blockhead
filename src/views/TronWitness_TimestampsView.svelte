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
	}: EntityListViewProps<EntityType.TronWitness_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronWitness_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronWitnessTimestamp })}
		<EntityView
			entityType={EntityType.TronWitness_Timestamp}
			entitySelector={tronWitnessTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron witness timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
