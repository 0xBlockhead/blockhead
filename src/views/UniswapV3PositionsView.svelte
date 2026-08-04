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
	import NumberValue from '$/components/NumberValue.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Uniswap V3 NFT liquidity positions identified by NonfungiblePositionManager address and token ID.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UniswapV3Position}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Voltaire_JsonRpc,
				Source.UniswapContracts_Evm,
			],
			fields: {
				tokenId: true,
				positionManager: true,
			},
			limit: 64,
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
				<NumberValue value={uniswapV3PositionSelector.tokenId} />
			{/snippet}

			{#snippet Value()}
				<TruncatedValue value={uniswapV3PositionSelector.positionManager} />
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
