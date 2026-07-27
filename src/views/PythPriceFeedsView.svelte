<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PythPriceFeed> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PythPriceFeed}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				channel: true,
				priceFeedId: true,
				$market: true,
			},
		})
	}
>
	{#snippet Item({ item: pythPriceFeed })}
		{@const pythPriceFeedSelector = pythPriceFeed[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PythPriceFeed}
			entitySelector={pythPriceFeedSelector}
		>
			{#snippet Title()}
				{(pythPriceFeed.symbol ?? '') || String(pythPriceFeedSelector.priceFeedId) || 'Pyth price feed'}
			{/snippet}

			{#snippet Value()}
				{pythPriceFeedSelector.channel}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{pythPriceFeed.$market == null ? '' : 'Market'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
