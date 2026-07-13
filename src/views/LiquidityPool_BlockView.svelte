<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const liquidityPoolBlock = $derived(selection({
		sources: [
			Source.Dexscreener_OpenApi,
		],
		fields: {
			tick: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity pool block')
	const viewDomId = $derived('liquidity-pool-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Block}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.blockNumber !== undefined && pendingEntity.$liquidityPool !== undefined && pendingEntity.$liquidityPool.$network !== undefined && pendingEntity.$liquidityPool.$network.caip2 !== undefined && pendingEntity.$liquidityPool.$network.caip2.reference !== undefined && pendingEntity.$liquidityPool.id !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/block/[blockNumber=nonNegativeBigInt]', {
			blockNumber: String(pendingEntity.blockNumber ?? ''),
			chainId: String(pendingEntity.$liquidityPool.$network.caip2.reference ?? ''),
			poolId: String(pendingEntity.$liquidityPool.id ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={liquidityPoolBlock}>
			{#snippet Pending()}
				{@const blockNumber0 = pendingEntity.blockNumber}
				{#if blockNumber0 !== undefined && blockNumber0 !== null}
					<NumberValue value={Number(blockNumber0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const blockNumber0 = resolvedEntity.blockNumber}
				{#if blockNumber0 !== undefined && blockNumber0 !== null}
					<NumberValue value={Number(blockNumber0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={liquidityPoolBlock}>
			{#snippet Pending()}
				{@const tick0 = pendingEntity.tick}
				{#if tick0 !== undefined && tick0 !== null}
					<NumberValue value={Number(tick0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const tick0 = resolvedEntity.tick}
				{#if tick0 !== undefined && tick0 !== null}
					<NumberValue value={Number(tick0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={liquidityPoolBlock}>
			{#snippet Pending()}
				<span data-text="muted">
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						href={
							(selection.entitySelector.$liquidityPool.id !== undefined && selection.entitySelector.$liquidityPool.$network !== undefined && selection.entitySelector.$liquidityPool.$network.caip2 !== undefined && selection.entitySelector.$liquidityPool.$network.caip2.reference !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
								poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						href={
							(selection.entitySelector.$liquidityPool.id !== undefined && selection.entitySelector.$liquidityPool.$network !== undefined && selection.entitySelector.$liquidityPool.$network.caip2 !== undefined && selection.entitySelector.$liquidityPool.$network.caip2.reference !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
								poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Liquidity pool</dt>
				<dd>
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool, {})}
						href={
							(selection.entitySelector.$liquidityPool.id !== undefined && selection.entitySelector.$liquidityPool.$network !== undefined && selection.entitySelector.$liquidityPool.$network.caip2 !== undefined && selection.entitySelector.$liquidityPool.$network.caip2.reference !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
								poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockNumber = pendingEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Parent liquidity pool</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection.$parentLiquidityPool({
								sources: [
									Source.Dexscreener_OpenApi,
								],
							})
						}
					>
						{#snippet children(liquidityPool)}
							{#if liquidityPool != null && liquidityPool[EntityMetaKey.Selector] != null}
								<LiquidityPoolView
									selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
									prefetched={liquidityPool}
									href={
										(liquidityPool[EntityMetaKey.Selector].id !== undefined && liquidityPool[EntityMetaKey.Selector].$network !== undefined && liquidityPool[EntityMetaKey.Selector].$network.caip2 !== undefined && liquidityPool[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
											poolId: String(liquidityPool[EntityMetaKey.Selector].id ?? ''),
											chainId: String(liquidityPool[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
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
				{#snippet Pending()}
					{@const sqrtPriceX96 = pendingEntity.sqrtPriceX96}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sqrtPriceX96 = resolvedEntity.sqrtPriceX96}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							liquidity: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const liquidity = pendingEntity.liquidity}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liquidity = resolvedEntity.liquidity}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tick: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tick = pendingEntity.tick}
					{#if tick !== undefined && tick !== null}
						<div>
							<dt>Tick</dt>
							<dd>
								<NumberValue value={Number(tick)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tick = resolvedEntity.tick}
					{#if tick !== undefined && tick !== null}
						<div>
							<dt>Tick</dt>
							<dd>
								<NumberValue value={Number(tick)} />
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
				{#snippet Pending()}
					{@const feeProtocol = pendingEntity.feeProtocol}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeProtocol = resolvedEntity.feeProtocol}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unlocked: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unlocked = pendingEntity.unlocked}
					{#if unlocked !== undefined && unlocked !== null}
						<div>
							<dt>Unlocked</dt>
							<dd>
								{unlocked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unlocked = resolvedEntity.unlocked}
					{#if unlocked !== undefined && unlocked !== null}
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
				{#snippet Pending()}
					{@const observationIndex = pendingEntity.observationIndex}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observationIndex = resolvedEntity.observationIndex}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observationCardinality: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observationCardinality = pendingEntity.observationCardinality}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observationCardinality = resolvedEntity.observationCardinality}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observationCardinalityNext: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observationCardinalityNext = pendingEntity.observationCardinalityNext}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observationCardinalityNext = resolvedEntity.observationCardinalityNext}
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
