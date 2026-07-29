<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain market observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainMarket_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainMarket_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainMarketTimestamp })}
		{@const dydxChainMarketTimestampSelector = dydxChainMarketTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainMarket_Timestamp}
			entitySelector={dydxChainMarketTimestampSelector}
		>
			{#snippet Title()}
				{dydxChainMarketTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainMarketTimestamp.status ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
