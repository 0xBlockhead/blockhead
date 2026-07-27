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
	}: EntityListViewProps<EntityType.TonContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonContractTimestamp })}
		<EntityView
			entityType={EntityType.TonContract_Timestamp}
			entitySelector={tonContractTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON contract timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
