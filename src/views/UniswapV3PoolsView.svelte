<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.UniswapV3Pool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Uniswap V3 concentrated-liquidity pools keyed by network and pool address — not the Dexscreener liquidity-pool catalog.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapV3Pool}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Voltaire_JsonRpc,
				Source.UniswapContracts_Evm,
			],
			fields: {
				poolAddress: true,
				fee: true,
				$network: true,
			},
			limit: 64,
		})
	}
>
	{#snippet Item({ item: uniswapV3Pool })}
		{@const uniswapV3PoolSelector = uniswapV3Pool[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UniswapV3Pool}
			entitySelector={uniswapV3PoolSelector}
			href={
				'caip2' in uniswapV3PoolSelector.$network ?
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
				<TruncatedValue value={uniswapV3PoolSelector.poolAddress} />
			{/snippet}

			{#snippet Value()}
				{#if uniswapV3Pool.fee != null}
					<NumberValue value={uniswapV3Pool.fee} />
				{/if}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{uniswapV3Pool.$network.name || (uniswapV3Pool.$network.caip2 == null ? '' : `${uniswapV3Pool.$network.caip2.namespace}:${uniswapV3Pool.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
