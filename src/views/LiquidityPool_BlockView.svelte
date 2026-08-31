<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.LiquidityPool_Block>, 'prefetched'> = $props()

	const liquidityPoolBlock = $derived(selection({
		fields: {
			tick: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Block}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.blockNumber)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.blockNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={liquidityPoolBlock}>
			{#snippet children(entity)}
				{@const tick = entity.tick}
				{#if tick != null}
					<NumberValue
						value={tick}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<LiquidityPoolView
				selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Liquidity pool</dt>
				<dd>
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.blockNumber}
					/>
				</dd>
			</div>

			<div>
				<dt>Parent liquidity pool</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$parentLiquidityPool}
					>
						{#snippet children(liquidityPool)}
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sqrtPriceX96: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sqrtPriceX96 = entity.sqrtPriceX96}
					{#if sqrtPriceX96 != null}
						<div>
							<dt>Sqrt price X96</dt>
							<dd>
								<NumberValue
									value={sqrtPriceX96}
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
							liquidity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liquidity = entity.liquidity}
					{#if liquidity != null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue
									value={liquidity}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={liquidityPoolBlock}
			>
				{#snippet children(entity)}
					{@const tick = entity.tick}
					{#if tick != null}
						<div>
							<dt>Tick</dt>
							<dd>
								<NumberValue
									value={tick}
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
							feeProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeProtocol = entity.feeProtocol}
					{#if feeProtocol != null}
						<div>
							<dt>Fee protocol</dt>
							<dd>
								<NumberValue
									value={feeProtocol}
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
							unlocked: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unlocked = entity.unlocked}
					{#if unlocked != null}
						<div>
							<dt>Unlocked</dt>
							<dd>
								{unlocked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							observationIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observationIndex = entity.observationIndex}
					{#if observationIndex != null}
						<div>
							<dt>Observation index</dt>
							<dd>
								<NumberValue
									value={observationIndex}
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
							observationCardinality: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observationCardinality = entity.observationCardinality}
					{#if observationCardinality != null}
						<div>
							<dt>Observation cardinality</dt>
							<dd>
								<NumberValue
									value={observationCardinality}
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
							observationCardinalityNext: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observationCardinalityNext = entity.observationCardinalityNext}
					{#if observationCardinalityNext != null}
						<div>
							<dt>Observation cardinality next</dt>
							<dd>
								<NumberValue
									value={observationCardinalityNext}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
