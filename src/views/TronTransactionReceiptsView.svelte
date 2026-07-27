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
	}: EntityListViewProps<EntityType.TronTransactionReceipt> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronTransactionReceipt}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronTransactionReceipt })}
		<EntityView
			entityType={EntityType.TronTransactionReceipt}
			entitySelector={tronTransactionReceipt[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron transaction receipt
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
