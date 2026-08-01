<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SwapQuoteStep>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SwapQuote_TimestampView from '$/views/SwapQuote_TimestampView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.SwapQuoteStep}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>quote</dt>
				<dd>
					<SwapQuote_TimestampView
						selection={select(EntityType.SwapQuote_Timestamp, selection.entitySelector.$quote)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>index in quote</dt>
				<dd>
					{selection.entitySelector.indexInQuote}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerStepId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerStepId = entity.providerStepId}
					{#if providerStepId != null}
						<div>
							<dt>provider step ID</dt>
							<dd>
								{providerStepId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stepType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stepType = entity.stepType}
					{#if stepType != null}
						<div>
							<dt>step type</dt>
							<dd>
								{stepType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocol = entity.protocol}
					{#if protocol != null}
						<div>
							<dt>protocol</dt>
							<dd>
								{protocol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							poolId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const poolId = entity.poolId}
					{#if poolId != null}
						<div>
							<dt>pool ID</dt>
							<dd>
								{poolId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$liquidityPool}
			>
				{#snippet children(liquidityPool)}
					{#if liquidityPool != null}
						<div>
							<dt>liquidity pool</dt>
							<dd>
								<LiquidityPoolView
									selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$tokenIn}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>token in</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$tokenOut}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>token out</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountIn: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountIn = entity.amountIn}
					{#if amountIn != null}
						<div>
							<dt>amount in</dt>
							<dd>
								{amountIn}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountOut: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountOut = entity.amountOut}
					{#if amountOut != null}
						<div>
							<dt>amount out</dt>
							<dd>
								{amountOut}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeBps: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeBps = entity.feeBps}
					{#if feeBps != null}
						<div>
							<dt>fee bps</dt>
							<dd>
								{feeBps}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shareBps: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const shareBps = entity.shareBps}
					{#if shareBps != null}
						<div>
							<dt>share bps</dt>
							<dd>
								{shareBps}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasEstimate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasEstimate = entity.gasEstimate}
					{#if gasEstimate != null}
						<div>
							<dt>gas estimate</dt>
							<dd>
								{gasEstimate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
