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
	}: EntityListViewProps<EntityType.XrplTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTransaction_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplTransactionTimestamp })}
		<EntityView
			entityType={EntityType.XrplTransaction_Timestamp}
			entitySelector={xrplTransactionTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				XRPL transaction timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
