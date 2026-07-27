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
	}: EntityListViewProps<EntityType.StellarOffer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarOffer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarOffer })}
		<EntityView
			entityType={EntityType.StellarOffer}
			entitySelector={stellarOffer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar offer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
