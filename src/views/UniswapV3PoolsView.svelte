<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.UniswapV3Pool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapV3Pool}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Voltaire_JsonRpc,
					Source.UniswapContracts_Evm,
				],
				fields: {
					poolAddress: true,
					fee: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: uniswapV3Pool })}
		{@const uniswapV3PoolSelector = uniswapV3Pool[EntityMetaKey.Selector]}
		{@const token0 = uniswapV3PoolSelector.$token0}
		<EntityView
			entityType={EntityType.UniswapV3Pool}
			entitySelector={uniswapV3PoolSelector}
			href={
				'fee' in uniswapV3PoolSelector
				&& '$token1' in uniswapV3PoolSelector
				&& '$token0' in uniswapV3PoolSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/uniswap-v3/pool/[token1Address=evmAddress]/[fee=nonNegativeInteger]',
						{
							network: (
								'caip2' in token0.$network ?
									caip2StringFromValue(token0.$network.caip2)
								:
									token0.$network.slug
							),
							address: token0.address,
							token1Address: uniswapV3PoolSelector.$token1.address,
							fee: String(uniswapV3PoolSelector.fee),
						}
					)
				:
					'poolAddress' in uniswapV3PoolSelector
					&& '$network' in uniswapV3PoolSelector
					&& 'caip2' in uniswapV3PoolSelector.$network ?
						resolve(
							'/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]',
							{
								chainId: uniswapV3PoolSelector.$network.caip2.reference,
								poolAddress: uniswapV3PoolSelector.poolAddress,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{uniswapV3Pool.poolAddress || 'Uniswap V3 pool'}
			{/snippet}

			{#snippet Value()}
				{uniswapV3Pool.fee ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{uniswapV3Pool.$network.name || (uniswapV3Pool.$network.caip2 == null ? '' : `${uniswapV3Pool.$network.caip2.namespace}:${uniswapV3Pool.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
