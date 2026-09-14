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
	}: EntityListViewProps<EntityType.LiquidityPoolFeeSchedule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPoolFeeSchedule}
	bind:open
	resource={
		selection({
			fields: {
				feeType: true,
				feePercentage: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: liquidityPoolFeeSchedule })}
		{@const liquidityPoolFeeScheduleSelector = liquidityPoolFeeSchedule[EntityMetaKey.Selector]}
		{@const pool = liquidityPoolFeeScheduleSelector.$pool}
		<EntityView
			entityType={EntityType.LiquidityPoolFeeSchedule}
			entitySelector={liquidityPoolFeeScheduleSelector}
			href={
				pool.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/fee-schedule/[feeType=stringSegment]',
						{
							chainId: pool.$network.caip2.reference,
							poolId: pool.id,
							feeType: liquidityPoolFeeScheduleSelector.feeType,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{liquidityPoolFeeScheduleSelector.feeType || 'liquidity pool fee schedule'}
			{/snippet}

			{#snippet Value()}
				{liquidityPoolFeeSchedule.feePercentage ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{liquidityPoolFeeScheduleSelector.$pool.id || 'liquidity pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
