<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LiquidityPool_Amm_EvmBlock_InputAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool_Amm_EvmBlock_InputAsset}
	bind:open
	resource={
		selection({
			fields: {
				ordinal: true,
				$observation: true,
			},
		})
	}
>
	{#snippet Item({ item: liquidityPoolAmmEvmBlockInputAsset })}
		{@const liquidityPoolAmmEvmBlockInputAssetSelector = liquidityPoolAmmEvmBlockInputAsset[EntityMetaKey.Selector]}
		{@const observation = liquidityPoolAmmEvmBlockInputAssetSelector.$observation}
		<EntityView
			entityType={EntityType.LiquidityPool_Amm_EvmBlock_InputAsset}
			entitySelector={liquidityPoolAmmEvmBlockInputAssetSelector}
			href={
				observation.$pool.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]/(liquidityPoolAmmEvmBlock)/input-asset/[ordinal=nonNegativeInteger]',
						{
							chainId: observation.$pool.$network.caip2.reference,
							poolId: observation.$pool.id,
							blockSelector: String(stringify(observation.$block)),
							sourceRevision: observation.sourceRevision,
							ordinal: String(liquidityPoolAmmEvmBlockInputAssetSelector.ordinal),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{'Input ' + String(liquidityPoolAmmEvmBlockInputAssetSelector.ordinal)}
			{/snippet}

			{#snippet Value()}
				{[[`Block #${liquidityPoolAmmEvmBlockInputAsset.$observation.$block.blockNumber}`, liquidityPoolAmmEvmBlockInputAssetSelector.$observation.sourceRevision].filter(Boolean).join(' ') || 'AMM pool observation', String(liquidityPoolAmmEvmBlockInputAssetSelector.ordinal)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
