<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool_Block>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LiquidityPool_Block>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const liquidityPoolBlock = $derived(selection({
		fields: {
			tick: true,
			$parentLiquidityPool: true,
			sqrtPriceX96: true,
			liquidity: true,
			feeProtocol: true,
			unlocked: true,
			observationIndex: true,
			observationCardinality: true,
			observationCardinalityNext: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity pool block')
	const viewDomId = $derived('liquidity-pool-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Block}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]/block/[blockNumber=nonNegativeInteger]', {
			chainId: String(({ ...selection.entitySelector, ...prefetched }).$liquidityPool.$network.caip2.reference),
			poolId: String(({ ...selection.entitySelector, ...prefetched }).$liquidityPool.id),
			blockNumber: String(({ ...selection.entitySelector, ...prefetched }).blockNumber),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const blockNumber0 = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
			{#if blockNumber0 !== undefined && blockNumber0 !== null}
				<NumberValue value={Number(blockNumber0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const blockNumber0 = ({ ...selection.entitySelector, ...prefetched }).blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue value={Number(blockNumber0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blockNumber0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue value={Number(blockNumber0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const tick0 = ({ ...selection.entitySelector, ...prefetched }).tick}
			{#if tick0 !== undefined && tick0 !== null}
				<NumberValue value={Number(tick0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const tick0 = ({ ...selection.entitySelector, ...prefetched }).tick}
					{#if tick0 !== undefined && tick0 !== null}
						<NumberValue value={Number(tick0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tick0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).tick}
					{#if tick0 !== undefined && tick0 !== null}
						<NumberValue value={Number(tick0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<LiquidityPoolView
					selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
					href={
						resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
							chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference),
							poolId: String(selection.entitySelector.$liquidityPool.id),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					<span data-text="muted">
						<LiquidityPoolView
							selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
							href={
								resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
									chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference),
									poolId: String(selection.entitySelector.$liquidityPool.id),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<LiquidityPoolView
							selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
							href={
								resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
									chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference),
									poolId: String(selection.entitySelector.$liquidityPool.id),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Parent liquidity pool</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.LiquidityPool, false>('$parentLiquidityPool')}
					>
						{#snippet children(liquidityPool)}
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, liquidityPool.entitySelector)}
								prefetched={liquidityPool}
								href={
									resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
										chainId: String(liquidityPool.entitySelector.$network.caip2.reference),
										poolId: String(liquidityPool.entitySelector.id),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const sqrtPriceX96 = prefetched.sqrtPriceX96 ?? selection.entitySelector.sqrtPriceX96}
					{#if sqrtPriceX96 !== undefined && sqrtPriceX96 !== null}
						<div>
							<dt>Sqrt price X96</dt>
							<dd>
								<NumberValue value={Number(sqrtPriceX96)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sqrtPriceX96 = entity.sqrtPriceX96 ?? selection.entitySelector.sqrtPriceX96 ?? prefetched.sqrtPriceX96}
					{#if sqrtPriceX96 !== undefined && sqrtPriceX96 !== null}
						<div>
							<dt>Sqrt price X96</dt>
							<dd>
								<NumberValue value={Number(sqrtPriceX96)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const liquidity = prefetched.liquidity ?? selection.entitySelector.liquidity}
					{#if liquidity !== undefined && liquidity !== null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue value={Number(liquidity)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const liquidity = entity.liquidity ?? selection.entitySelector.liquidity ?? prefetched.liquidity}
					{#if liquidity !== undefined && liquidity !== null}
						<div>
							<dt>Liquidity</dt>
							<dd>
								<NumberValue value={Number(liquidity)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const feeProtocol = prefetched.feeProtocol ?? selection.entitySelector.feeProtocol}
					{#if feeProtocol !== undefined && feeProtocol !== null}
						<div>
							<dt>Fee protocol</dt>
							<dd>
								<NumberValue value={Number(feeProtocol)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const feeProtocol = entity.feeProtocol ?? selection.entitySelector.feeProtocol ?? prefetched.feeProtocol}
					{#if feeProtocol !== undefined && feeProtocol !== null}
						<div>
							<dt>Fee protocol</dt>
							<dd>
								<NumberValue value={Number(feeProtocol)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const unlocked = prefetched.unlocked ?? selection.entitySelector.unlocked}
					{#if unlocked !== undefined && unlocked !== null}
						<div>
							<dt>Unlocked</dt>
							<dd>
								{String((unlocked) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const unlocked = entity.unlocked ?? selection.entitySelector.unlocked ?? prefetched.unlocked}
					{#if unlocked !== undefined && unlocked !== null}
						<div>
							<dt>Unlocked</dt>
							<dd>
								{String((unlocked) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const observationIndex = prefetched.observationIndex ?? selection.entitySelector.observationIndex}
					{#if observationIndex !== undefined && observationIndex !== null}
						<div>
							<dt>Observation index</dt>
							<dd>
								<NumberValue value={Number(observationIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const observationIndex = entity.observationIndex ?? selection.entitySelector.observationIndex ?? prefetched.observationIndex}
					{#if observationIndex !== undefined && observationIndex !== null}
						<div>
							<dt>Observation index</dt>
							<dd>
								<NumberValue value={Number(observationIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const observationCardinality = prefetched.observationCardinality ?? selection.entitySelector.observationCardinality}
					{#if observationCardinality !== undefined && observationCardinality !== null}
						<div>
							<dt>Observation cardinality</dt>
							<dd>
								<NumberValue value={Number(observationCardinality)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const observationCardinality = entity.observationCardinality ?? selection.entitySelector.observationCardinality ?? prefetched.observationCardinality}
					{#if observationCardinality !== undefined && observationCardinality !== null}
						<div>
							<dt>Observation cardinality</dt>
							<dd>
								<NumberValue value={Number(observationCardinality)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={liquidityPoolBlock}>
				{#snippet Pending()}
					{@const observationCardinalityNext = prefetched.observationCardinalityNext ?? selection.entitySelector.observationCardinalityNext}
					{#if observationCardinalityNext !== undefined && observationCardinalityNext !== null}
						<div>
							<dt>Observation cardinality next</dt>
							<dd>
								<NumberValue value={Number(observationCardinalityNext)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const observationCardinalityNext = entity.observationCardinalityNext ?? selection.entitySelector.observationCardinalityNext ?? prefetched.observationCardinalityNext}
					{#if observationCardinalityNext !== undefined && observationCardinalityNext !== null}
						<div>
							<dt>Observation cardinality next</dt>
							<dd>
								<NumberValue value={Number(observationCardinalityNext)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
