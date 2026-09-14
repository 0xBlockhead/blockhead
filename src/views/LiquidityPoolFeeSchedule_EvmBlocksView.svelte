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
	}: EntityListViewProps<EntityType.LiquidityPoolFeeSchedule_EvmBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPoolFeeSchedule_EvmBlock}
	bind:open
	resource={
		selection({
			fields: {
				$block: true,
				feePercentage: true,
				$feeSchedule: true,
				sourceRevision: true,
			},
		})
	}
>
	{#snippet Item({ item: liquidityPoolFeeScheduleEvmBlock })}
		{@const liquidityPoolFeeScheduleEvmBlockSelector = liquidityPoolFeeScheduleEvmBlock[EntityMetaKey.Selector]}
		{@const feeSchedule = liquidityPoolFeeScheduleEvmBlockSelector.$feeSchedule}
		<EntityView
			entityType={EntityType.LiquidityPoolFeeSchedule_EvmBlock}
			entitySelector={liquidityPoolFeeScheduleEvmBlockSelector}
			href={
				feeSchedule.$pool.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/fee-schedule/[feeType=stringSegment]/(liquidityPoolFeeSchedule)/observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
						{
							chainId: feeSchedule.$pool.$network.caip2.reference,
							poolId: feeSchedule.$pool.id,
							feeType: feeSchedule.feeType,
							blockSelector: String(stringify(liquidityPoolFeeScheduleEvmBlockSelector.$block)),
							sourceRevision: liquidityPoolFeeScheduleEvmBlockSelector.sourceRevision,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{`Block #${liquidityPoolFeeScheduleEvmBlock.$block.blockNumber}`}
			{/snippet}

			{#snippet Value()}
				{liquidityPoolFeeScheduleEvmBlock.feePercentage ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[liquidityPoolFeeScheduleEvmBlockSelector.$feeSchedule.feeType || 'liquidity pool fee schedule', liquidityPoolFeeScheduleEvmBlockSelector.sourceRevision].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
