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
			liquidity: true,
			sqrtPriceX96: true,
			feeProtocol: true,
			unlocked: true,
			observationIndex: true,
			observationCardinality: true,
			observationCardinalityNext: true,
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
		Block
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
				showTypeAnnotation={false}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary resource={uniswapV3PoolBlock}>
				{#snippet children(entity)}
					{#if entity.sqrtPriceX96 != null}
						<div>
							<dt>Sqrt price X96</dt>
							<dd>
								<NumberValue value={entity.sqrtPriceX96} />
							</dd>
						</div>
					{/if}

					{#if entity.liquidity != null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue value={entity.liquidity} />
							</dd>
						</div>
					{/if}

					{#if entity.tick != null}
						<div>
							<dt>Tick</dt>
							<dd>
								<NumberValue value={entity.tick} />
							</dd>
						</div>
					{/if}

					{#if entity.feeProtocol != null}
						<div>
							<dt>Fee protocol</dt>
							<dd>
								<NumberValue value={entity.feeProtocol} />
							</dd>
						</div>
					{/if}

					{#if entity.unlocked != null}
						<div>
							<dt>Unlocked</dt>
							<dd>
								{entity.unlocked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={uniswapV3PoolBlock}>
				{#snippet children(entity)}
					{#if entity.observationIndex != null}
						<div>
							<dt>Observation index</dt>
							<dd>
								<NumberValue value={entity.observationIndex} />
							</dd>
						</div>
					{/if}

					{#if entity.observationCardinality != null}
						<div>
							<dt>Observation cardinality</dt>
							<dd>
								<NumberValue value={entity.observationCardinality} />
							</dd>
						</div>
					{/if}

					{#if entity.observationCardinalityNext != null}
						<div>
							<dt>Observation cardinality next</dt>
							<dd>
								<NumberValue value={entity.observationCardinalityNext} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
