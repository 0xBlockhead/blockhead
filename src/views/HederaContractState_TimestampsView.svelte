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
	}: EntityListViewProps<EntityType.HederaContractState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContractState_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractStateTimestamp })}
		<EntityView
			entityType={EntityType.HederaContractState_Timestamp}
			entitySelector={hederaContractStateTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera contract state timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
