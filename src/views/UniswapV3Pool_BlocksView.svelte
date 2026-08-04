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
	import NumberValue from '$/components/NumberValue.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
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
				'caip2' in pool.$network ?
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
				<NumberValue value={uniswapV3PoolBlockSelector.blockNumber} />
			{/snippet}

			{#snippet Value()}
				{#if uniswapV3PoolBlock.tick != null}
					<NumberValue value={uniswapV3PoolBlock.tick} />
				{/if}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">
					<TruncatedValue value={pool.poolAddress} />
				</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
