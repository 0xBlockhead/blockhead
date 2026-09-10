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
	}: EntityListViewProps<EntityType.LiquidityPool_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool_Block}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				tick: true,
				$liquidityPool: true,
			},
		})
	}
>
	{#snippet Item({ item: liquidityPoolBlock })}
		{@const liquidityPoolBlockSelector = liquidityPoolBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LiquidityPool_Block}
			entitySelector={liquidityPoolBlockSelector}
		>
			{#snippet Title()}
				{liquidityPoolBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{liquidityPoolBlock.tick ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{liquidityPoolBlockSelector.$liquidityPool.id || 'liquidity pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
