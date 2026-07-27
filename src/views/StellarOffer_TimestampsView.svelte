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
	}: EntityListViewProps<EntityType.StellarOffer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarOffer_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarOfferTimestamp })}
		<EntityView
			entityType={EntityType.StellarOffer_Timestamp}
			entitySelector={stellarOfferTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar offer timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
