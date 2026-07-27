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
	}: EntityListViewProps<EntityType.TezosBaker_Cycle_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBaker_Cycle_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBakerCycleTimestamp })}
		<EntityView
			entityType={EntityType.TezosBaker_Cycle_Timestamp}
			entitySelector={tezosBakerCycleTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos baker cycle timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
