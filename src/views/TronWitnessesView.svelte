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
		id = 'TronWitnesses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TronWitness> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronWitness}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronWitness })}
		<EntityView
			entityType={EntityType.TronWitness}
			entitySelector={tronWitness[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron witness
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
