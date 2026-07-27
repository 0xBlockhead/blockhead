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
	}: EntityListViewProps<EntityType.TezosMichelsonScript> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosMichelsonScript}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosMichelsonScript })}
		<EntityView
			entityType={EntityType.TezosMichelsonScript}
			entitySelector={tezosMichelsonScript[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos michelson script
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
