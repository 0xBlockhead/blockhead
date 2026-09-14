<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.LiquidityPoolFeeSchedule_EvmBlock>, 'prefetched'> = $props()

	const feeSchedule = $derived(selection.entitySelector.$feeSchedule)
	const liquidityPoolFeeScheduleEvmBlock = $derived(selection({
		sources: selection.sources ?? [
			Source.TheGraph_Graphql,
		],
		fields: {
			feePercentage: true,
		},
	}))
	const titleFallback = 'liquidity pool fee schedule block observation'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPoolFeeScheduleView from '$/views/LiquidityPoolFeeScheduleView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPoolFeeSchedule_EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				feeSchedule.$pool.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/fee-schedule/[feeType=stringSegment]/(liquidityPoolFeeSchedule)/observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
						{
							chainId: feeSchedule.$pool.$network.caip2.reference,
							poolId: feeSchedule.$pool.id,
							feeType: feeSchedule.feeType,
							blockSelector: String(stringify(selection.entitySelector.$block)),
							sourceRevision: selection.entitySelector.sourceRevision,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmBlockView
			selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={liquidityPoolFeeScheduleEvmBlock}>
			{#snippet children(entity)}
				{(entity.feePercentage ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<LiquidityPoolFeeScheduleView
				selection={select(EntityType.LiquidityPoolFeeSchedule, selection.entitySelector.$feeSchedule)}
				layout={EntityLayout.Title}
			/>
		</span>

		<span data-text="muted">
			{selection.entitySelector.sourceRevision}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Fee schedule</dt>
				<dd>
					<LiquidityPoolFeeScheduleView
						selection={select(EntityType.LiquidityPoolFeeSchedule, selection.entitySelector.$feeSchedule)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd>
					<EvmBlockView
						selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Source revision</dt>
				<dd>
					{selection.entitySelector.sourceRevision}
				</dd>
			</div>

			<ResourceBoundary
				resource={liquidityPoolFeeScheduleEvmBlock}
			>
				{#snippet children(entity)}
					{@const feePercentage = entity.feePercentage}
					{#if feePercentage != null}
						<div>
							<dt>Fee percentage points</dt>
							<dd>
								{feePercentage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
