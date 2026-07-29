<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain markets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainMarket}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				ticker: true,
				marketKind: true,
				baseAsset: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainMarket })}
		{@const dydxChainMarketSelector = dydxChainMarket[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainMarket}
			entitySelector={dydxChainMarketSelector}
		>
			{#snippet Title()}
				{dydxChainMarketSelector.ticker || 'dydx chain market'}
			{/snippet}

			{#snippet Value()}
				{dydxChainMarket.marketKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{dydxChainMarket.baseAsset ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
