<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LiquidityPool_Block> = $props()

	const liquidityPool = $derived(selection.entitySelector.$liquidityPool)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Dexscreener_OpenApi,
		],
	}))
	const liquidityPoolBlock = $derived(viewSelection({
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
	href={
		href === undefined ?
			(
				'caip2' in liquidityPool.$network ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: liquidityPool.$network.caip2.reference,
							poolId: liquidityPool.id,
							blockNumber: String(selection.entitySelector.blockNumber),
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
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Liquidity pool</dt>
				<dd>
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						layout={EntityLayout.Value}
						open={false}
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
								prefetched={liquidityPool}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
					viewSelection({
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
