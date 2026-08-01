<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Algorand TEAL program observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandTealProgram_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTealProgram_Timestamp}
	{title}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandTealProgramTimestamp })}
		<EntityView
			entityType={EntityType.AlgorandTealProgram_Timestamp}
			entitySelector={algorandTealProgramTimestamp[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
