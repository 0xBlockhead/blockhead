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
	}: EntityListViewProps<EntityType.LiquidityPool_Amm_EvmBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool_Amm_EvmBlock}
	bind:open
	resource={
		selection({
			fields: {
				$block: true,
				sourceRevision: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: liquidityPoolAmmEvmBlock })}
		{@const liquidityPoolAmmEvmBlockSelector = liquidityPoolAmmEvmBlock[EntityMetaKey.Selector]}
		{@const pool = liquidityPoolAmmEvmBlockSelector.$pool}
		<EntityView
			entityType={EntityType.LiquidityPool_Amm_EvmBlock}
			entitySelector={liquidityPoolAmmEvmBlockSelector}
			href={
				pool.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
						{
							chainId: pool.$network.caip2.reference,
							poolId: pool.id,
							blockSelector: String(stringify(liquidityPoolAmmEvmBlockSelector.$block)),
							sourceRevision: liquidityPoolAmmEvmBlockSelector.sourceRevision,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[`Block #${liquidityPoolAmmEvmBlock.$block.blockNumber}`, liquidityPoolAmmEvmBlockSelector.sourceRevision].filter(Boolean).join(' ') || 'AMM pool observation'}
			{/snippet}

			{#snippet Value()}
				{[liquidityPoolAmmEvmBlockSelector.$pool.id || 'liquidity pool', `Block #${liquidityPoolAmmEvmBlock.$block.blockNumber}`, liquidityPoolAmmEvmBlockSelector.sourceRevision].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
