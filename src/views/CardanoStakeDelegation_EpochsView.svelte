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
	}: EntityListViewProps<EntityType.CardanoStakeDelegation_Epoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakeDelegation_Epoch}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoStakeDelegationEpoch })}
		<EntityView
			entityType={EntityType.CardanoStakeDelegation_Epoch}
			entitySelector={cardanoStakeDelegationEpoch[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Cardano stake delegation epoch
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
