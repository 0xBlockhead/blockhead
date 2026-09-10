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
	}: EntityListViewProps<EntityType.LiquidityPool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				baseTokenSymbol: true,
				quoteTokenSymbol: true,
				priceUsd: true,
				liquidityUsd: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: liquidityPoolTimestamp })}
		{@const liquidityPoolTimestampSelector = liquidityPoolTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LiquidityPool_Timestamp}
			entitySelector={liquidityPoolTimestampSelector}
		>
			{#snippet Title()}
				{[(liquidityPoolTimestamp.baseTokenSymbol ?? ''), (liquidityPoolTimestamp.quoteTokenSymbol ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(liquidityPoolTimestamp.priceUsd ?? ''), String(liquidityPoolTimestamp.liquidityUsd ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{liquidityPoolTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
