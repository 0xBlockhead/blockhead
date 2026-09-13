<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CurvePoolCoin> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CurvePoolCoin}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				name: true,
				poolBalance: true,
				usdPrice: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: curvePoolCoin })}
		{@const curvePoolCoinSelector = curvePoolCoin[EntityMetaKey.Selector]}
		{@const pool = curvePoolCoinSelector.$pool}
		<EntityView
			entityType={EntityType.CurvePoolCoin}
			entitySelector={curvePoolCoinSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve-pool/[poolAddress=evmAddress]/(curvePool)/coin/[coinAddress=evmAddress]',
					{
						network: (
							pool.$network.caip2 !== undefined ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolAddress: pool.poolAddress,
						coinAddress: curvePoolCoinSelector.coinAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[curvePoolCoin.symbol, curvePoolCoin.name].filter(Boolean).join(' ') || 'Curve pool coin'}
			{/snippet}

			{#snippet Value()}
				{[(curvePoolCoin.poolBalance ?? ''), String(curvePoolCoin.usdPrice ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[curvePoolCoin.$pool.name, curvePoolCoin.$pool.symbol].filter(Boolean).join(' ') || 'Curve pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
