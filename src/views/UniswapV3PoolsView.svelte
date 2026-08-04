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
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapV3Pool}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Voltaire_JsonRpc,
				Source.UniswapContracts_Evm,
			],
			fields: {
				poolAddress: true,
				$network: true,
				fee: true,
			},
			limit: 64,
		})
	}
>
	{#snippet Item({ item: uniswapV3Pool })}
		<EntityView
			entityType={EntityType.UniswapV3Pool}
			entitySelector={uniswapV3Pool[EntityMetaKey.Selector]}
			href={
				uniswapV3Pool.$network.caip2 != null ?
					resolve(
						'/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]',
						{
							chainId: uniswapV3Pool.$network.caip2.reference,
							poolAddress: uniswapV3Pool.poolAddress,
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
