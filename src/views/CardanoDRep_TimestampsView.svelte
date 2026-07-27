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
	}: EntityListViewProps<EntityType.CardanoDRep_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoDRep_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoDRepTimestamp })}
		<EntityView
			entityType={EntityType.CardanoDRep_Timestamp}
			entitySelector={cardanoDRepTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Cardano DRep timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
