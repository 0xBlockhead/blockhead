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
	}: EntityListViewProps<EntityType.SwapQuote_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SwapQuote_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: swapQuoteTimestamp })}
		<EntityView
			entityType={EntityType.SwapQuote_Timestamp}
			entitySelector={swapQuoteTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				swap quote timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
