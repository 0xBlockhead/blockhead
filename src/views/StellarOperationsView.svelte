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
	}: EntityListViewProps<EntityType.StellarOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarOperation}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarOperation })}
		<EntityView
			entityType={EntityType.StellarOperation}
			entitySelector={stellarOperation[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar operation
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
