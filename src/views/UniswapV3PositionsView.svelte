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
	}: EntityListViewProps<EntityType.UniswapV3Position> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapV3Position}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Voltaire_JsonRpc,
					Source.UniswapContracts_Evm,
				],
				fields: {
					tokenId: true,
					positionManager: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: uniswapV3Position })}
		{@const uniswapV3PositionSelector = uniswapV3Position[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UniswapV3Position}
			entitySelector={uniswapV3PositionSelector}
			href={
				resolve(
					'/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]',
					{
						positionManager: uniswapV3PositionSelector.positionManager,
						tokenId: String(uniswapV3PositionSelector.tokenId),
					}
				)
			}
		>
			{#snippet Title()}
				{uniswapV3PositionSelector.tokenId}
			{/snippet}

			{#snippet Value()}
				{uniswapV3PositionSelector.positionManager}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
