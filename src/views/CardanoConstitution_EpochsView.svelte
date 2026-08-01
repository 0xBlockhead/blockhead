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
	}: EntityListViewProps<EntityType.CardanoConstitution_Epoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoConstitution_Epoch}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoConstitutionEpoch })}
		<EntityView
			entityType={EntityType.CardanoConstitution_Epoch}
			entitySelector={cardanoConstitutionEpoch[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Cardano constitution epoch
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
