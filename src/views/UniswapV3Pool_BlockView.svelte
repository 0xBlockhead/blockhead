<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.UniswapV3Pool_Block>, 'prefetched'> = $props()

	const pool = $derived(selection.entitySelector.$pool)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Voltaire_JsonRpc,
		],
	}))
	const uniswapV3PoolBlock = $derived(viewSelection({
		fields: {
			tick: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UniswapV3PoolView from '$/views/UniswapV3PoolView.svelte'
</script>


<EntityView
	entityType={EntityType.UniswapV3Pool_Block}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.blockNumber)}
	href={
		href === undefined ?
			(
				'caip2' in pool.$network ?
					resolve(
						'/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]/(uniswapV3Pool)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: pool.$network.caip2.reference,
							poolAddress: pool.poolAddress,
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
		<ResourceBoundary resource={uniswapV3PoolBlock}>
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
			<UniswapV3PoolView
				selection={select(EntityType.UniswapV3Pool, selection.entitySelector.$pool)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<UniswapV3PoolView
						selection={select(EntityType.UniswapV3Pool, selection.entitySelector.$pool)}
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
				resource={uniswapV3PoolBlock}
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
							feeGrowthGlobal0X128: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeGrowthGlobal0X128 = entity.feeGrowthGlobal0X128}
					{#if feeGrowthGlobal0X128 != null}
						<div>
							<dt>Fee growth global 0</dt>
							<dd>
								<NumberValue
									value={feeGrowthGlobal0X128}
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
							feeGrowthGlobal1X128: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeGrowthGlobal1X128 = entity.feeGrowthGlobal1X128}
					{#if feeGrowthGlobal1X128 != null}
						<div>
							<dt>Fee growth global 1</dt>
							<dd>
								<NumberValue
									value={feeGrowthGlobal1X128}
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
							protocolFeesToken0: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolFeesToken0 = entity.protocolFeesToken0}
					{#if protocolFeesToken0 != null}
						<div>
							<dt>Protocol fees token 0</dt>
							<dd>
								<NumberValue
									value={protocolFeesToken0}
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
							protocolFeesToken1: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolFeesToken1 = entity.protocolFeesToken1}
					{#if protocolFeesToken1 != null}
						<div>
							<dt>Protocol fees token 1</dt>
							<dd>
								<NumberValue
									value={protocolFeesToken1}
								/>
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
