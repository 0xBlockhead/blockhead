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
	}: EntityListViewProps<EntityType.UniswapV3Position_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapV3Position_Block}
	bind:open
	resource={
		selection({
			...{
				fields: {
					blockNumber: true,
					liquidity: true,
					$position: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: uniswapV3PositionBlock })}
		{@const uniswapV3PositionBlockSelector = uniswapV3PositionBlock[EntityMetaKey.Selector]}
		{@const position = uniswapV3PositionBlockSelector.$position}
		<EntityView
			entityType={EntityType.UniswapV3Position_Block}
			entitySelector={uniswapV3PositionBlockSelector}
			href={
				resolve(
					'/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]/(uniswapV3Position)/block/[blockNumber=nonNegativeBigInt]',
					{
						positionManager: position.positionManager,
						tokenId: String(position.tokenId),
						blockNumber: String(uniswapV3PositionBlockSelector.blockNumber),
					}
				)
			}
		>
			{#snippet Title()}
				{uniswapV3PositionBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{uniswapV3PositionBlock.liquidity ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(uniswapV3PositionBlockSelector.$position.tokenId) || 'Uniswap V3 position'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
