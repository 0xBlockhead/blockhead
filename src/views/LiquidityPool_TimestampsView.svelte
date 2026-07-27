<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.LiquidityPool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				baseTokenSymbol: true,
				quoteTokenSymbol: true,
				priceUsd: true,
				liquidityUsd: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: liquidityPoolTimestamp })}
		{@const liquidityPoolTimestampSelector = liquidityPoolTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LiquidityPool_Timestamp}
			entitySelector={liquidityPoolTimestampSelector}
			href={
				(
					'caip2' in liquidityPoolTimestampSelector.$liquidityPool.$network ?
						resolve(
							'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
							{
								chainId: String(liquidityPoolTimestampSelector.$liquidityPool.$network.caip2.reference),
								poolId: String(liquidityPoolTimestampSelector.$liquidityPool.id),
								timestampMs: String(liquidityPoolTimestampSelector.timestampMs),
								feedKey: encodeURIComponent(String(liquidityPoolTimestampSelector.feedKey)),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{[(liquidityPoolTimestamp.baseTokenSymbol ?? ''), (liquidityPoolTimestamp.quoteTokenSymbol ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(liquidityPoolTimestamp.priceUsd ?? ''), String(liquidityPoolTimestamp.liquidityUsd ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(liquidityPoolTimestampSelector.timestampMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
