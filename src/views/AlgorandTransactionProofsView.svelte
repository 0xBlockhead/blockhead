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
	}: EntityListViewProps<EntityType.AlgorandTransactionProof> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTransactionProof}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandTransactionProof })}
		<EntityView
			entityType={EntityType.AlgorandTransactionProof}
			entitySelector={algorandTransactionProof[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand transaction proof
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
