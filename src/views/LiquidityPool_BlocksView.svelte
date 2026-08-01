<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		{@const liquidityPool = liquidityPoolBlockSelector.$liquidityPool}
		<EntityView
			entityType={EntityType.LiquidityPool_Block}
			entitySelector={liquidityPoolBlockSelector}
			href={
				'caip2' in liquidityPool.$network ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: liquidityPool.$network.caip2.reference,
							poolId: liquidityPool.id,
							blockNumber: String(liquidityPoolBlockSelector.blockNumber),
						}
					)
				:
					undefined
			}
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
