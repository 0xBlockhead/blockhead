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
	}: EntityListViewProps<EntityType.CardanoProtocolParameters_Epoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoProtocolParameters_Epoch}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoProtocolParametersEpoch })}
		<EntityView
			entityType={EntityType.CardanoProtocolParameters_Epoch}
			entitySelector={cardanoProtocolParametersEpoch[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Cardano protocol parameters epoch
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
