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
	}: EntityListViewProps<EntityType.TronContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronContractTimestamp })}
		<EntityView
			entityType={EntityType.TronContract_Timestamp}
			entitySelector={tronContractTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron contract timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
