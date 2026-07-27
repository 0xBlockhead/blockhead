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
	}: EntityListViewProps<EntityType.TronTokenTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronTokenTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronTokenTransfer })}
		<EntityView
			entityType={EntityType.TronTokenTransfer}
			entitySelector={tronTokenTransfer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron token transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
