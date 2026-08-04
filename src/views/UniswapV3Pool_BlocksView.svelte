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
	}: EntityListViewProps<EntityType.UniswapV3Pool_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapV3Pool_Block}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				tick: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: uniswapV3PoolBlock })}
		{@const uniswapV3PoolBlockSelector = uniswapV3PoolBlock[EntityMetaKey.Selector]}
		{@const pool = uniswapV3PoolBlockSelector.$pool}
		<EntityView
			entityType={EntityType.UniswapV3Pool_Block}
			entitySelector={uniswapV3PoolBlockSelector}
			href={
				'$network' in pool
				&& 'caip2' in pool.$network
				&& 'poolAddress' in pool ?
					resolve(
						'/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]/(uniswapV3Pool)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: pool.$network.caip2.reference,
							poolAddress: pool.poolAddress,
							blockNumber: String(uniswapV3PoolBlockSelector.blockNumber),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{uniswapV3PoolBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{uniswapV3PoolBlock.tick ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{uniswapV3PoolBlock.$pool.poolAddress || 'Uniswap V3 pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
