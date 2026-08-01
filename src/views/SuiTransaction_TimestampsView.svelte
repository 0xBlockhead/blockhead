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
	}: EntityListViewProps<EntityType.SuiTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiTransaction_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiTransactionTimestamp })}
		<EntityView
			entityType={EntityType.SuiTransaction_Timestamp}
			entitySelector={suiTransactionTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui transaction timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
