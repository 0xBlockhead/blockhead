<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.LiquidityPoolFeeSchedule>, 'prefetched'> = $props()

	const pool = $derived(selection.entitySelector.$pool)
	const liquidityPoolFeeSchedule = $derived(selection({
		sources: selection.sources ?? [
			Source.TheGraph_Graphql,
		],
		fields: {
			feePercentage: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.feeType || 'liquidity pool fee schedule')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPoolFeeSchedule_EvmBlocksView from '$/views/LiquidityPoolFeeSchedule_EvmBlocksView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPoolFeeSchedule}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				pool.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/fee-schedule/[feeType=stringSegment]',
						{
							chainId: pool.$network.caip2.reference,
							poolId: pool.id,
							feeType: selection.entitySelector.feeType,
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
	{#snippet Value()}
		<ResourceBoundary resource={liquidityPoolFeeSchedule}>
			{#snippet children(entity)}
				{(entity.feePercentage ?? '') || selection.entitySelector.feeType || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<LiquidityPoolView
				selection={select(EntityType.LiquidityPool, selection.entitySelector.$pool)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Fee type</dt>
				<dd>
					{selection.entitySelector.feeType}
				</dd>
			</div>

			<ResourceBoundary
				resource={liquidityPoolFeeSchedule}
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

	{#snippet Details()}
		{@const observationsResource = selection
			.$$observations({
				sources: [
					Source.TheGraph_Graphql,
				],
			})}
		<ResourceBoundary
			resource={observationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LiquidityPoolFeeSchedule_EvmBlocksView
						selection={observationsResource}
						countResource={observationsResource.count}
						title='Block observations'
						id='observations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
