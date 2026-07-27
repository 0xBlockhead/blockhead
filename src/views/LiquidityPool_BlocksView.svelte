<!-- Generated from APP.ts. Do not edit by hand. -->

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
		<EntityView
			entityType={EntityType.LiquidityPool_Block}
			entitySelector={liquidityPoolBlockSelector}
			href={
				(
					'caip2' in liquidityPoolBlockSelector.$liquidityPool.$network ?
						resolve(
							'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]',
							{
								chainId: String(liquidityPoolBlockSelector.$liquidityPool.$network.caip2.reference),
								poolId: String(liquidityPoolBlockSelector.$liquidityPool.id),
								blockNumber: String(liquidityPoolBlockSelector.blockNumber),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{String(liquidityPoolBlockSelector.blockNumber) || 'liquidity pool block'}
			{/snippet}

			{#snippet Value()}
				{String(liquidityPoolBlock.tick ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{liquidityPoolBlockSelector.$liquidityPool.id || 'liquidity pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
