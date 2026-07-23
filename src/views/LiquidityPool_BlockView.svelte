<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.LiquidityPool_Block>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LiquidityPool_Block>
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
	const liquidityPoolBlock = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			tick: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			tick: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity pool block')
	const viewDomId = $derived('liquidity-pool-block-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'blockNumber' in selection.entitySelector
			&& selection.entitySelector.blockNumber != null
			&& selection.entitySelector != null && '$liquidityPool' in selection.entitySelector
			&& selection.entitySelector.$liquidityPool != null && '$network' in selection.entitySelector.$liquidityPool
			&& selection.entitySelector.$liquidityPool.$network != null && 'caip2' in selection.entitySelector.$liquidityPool.$network
			&& selection.entitySelector.$liquidityPool.$network.caip2 != null && 'reference' in selection.entitySelector.$liquidityPool.$network.caip2
			&& selection.entitySelector.$liquidityPool.$network.caip2.reference != null
			&& selection.entitySelector.$liquidityPool != null && 'id' in selection.entitySelector.$liquidityPool
			&& selection.entitySelector.$liquidityPool.id != null ?
				resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/block/[blockNumber=nonNegativeBigInt]', {
			blockNumber: String(selection.entitySelector.blockNumber ?? ''),
			chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
			poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={liquidityPoolBlock}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const blockNumber0 = resolvedEntity.blockNumber}
				{#if blockNumber0 !== undefined && blockNumber0 !== null}
					<NumberValue
						value={blockNumber0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={liquidityPoolBlock}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const tick0 = resolvedEntity.tick}
				{#if tick0 !== undefined && tick0 !== null}
					<NumberValue
						value={tick0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={liquidityPoolBlock}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						href={
							(
								selection.entitySelector.$liquidityPool != null && 'id' in selection.entitySelector.$liquidityPool
								&& selection.entitySelector.$liquidityPool.id != null
								&& selection.entitySelector.$liquidityPool != null && '$network' in selection.entitySelector.$liquidityPool
								&& selection.entitySelector.$liquidityPool.$network != null && 'caip2' in selection.entitySelector.$liquidityPool.$network
								&& selection.entitySelector.$liquidityPool.$network.caip2 != null && 'reference' in selection.entitySelector.$liquidityPool.$network.caip2
								&& selection.entitySelector.$liquidityPool.$network.caip2.reference != null ?
									resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
								poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
							})
							:
									undefined
							)
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
						selection={select(EntityType.LiquidityPool, selection.entitySelector.$liquidityPool)}
						href={
							(
								selection.entitySelector.$liquidityPool != null && 'id' in selection.entitySelector.$liquidityPool
								&& selection.entitySelector.$liquidityPool.id != null
								&& selection.entitySelector.$liquidityPool != null && '$network' in selection.entitySelector.$liquidityPool
								&& selection.entitySelector.$liquidityPool.$network != null && 'caip2' in selection.entitySelector.$liquidityPool.$network
								&& selection.entitySelector.$liquidityPool.$network.caip2 != null && 'reference' in selection.entitySelector.$liquidityPool.$network.caip2
								&& selection.entitySelector.$liquidityPool.$network.caip2.reference != null ?
									resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
								poolId: String(selection.entitySelector.$liquidityPool.id ?? ''),
								chainId: String(selection.entitySelector.$liquidityPool.$network.caip2.reference ?? ''),
							})
							:
									undefined
							)
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
								sources: selection.sources,
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue
									value={blockNumber}
								/>
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
							selection
								.$parentLiquidityPool({
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
										(
											liquidityPool[EntityMetaKey.Selector] != null && 'id' in liquidityPool[EntityMetaKey.Selector]
											&& liquidityPool[EntityMetaKey.Selector].id != null
											&& liquidityPool[EntityMetaKey.Selector] != null && '$network' in liquidityPool[EntityMetaKey.Selector]
											&& liquidityPool[EntityMetaKey.Selector].$network != null && 'caip2' in liquidityPool[EntityMetaKey.Selector].$network
											&& liquidityPool[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in liquidityPool[EntityMetaKey.Selector].$network.caip2
											&& liquidityPool[EntityMetaKey.Selector].$network.caip2.reference != null ?
												resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
											poolId: String(liquidityPool[EntityMetaKey.Selector].id ?? ''),
											chainId: String(liquidityPool[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
										})
										:
												undefined
										)
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
						sources: selection.sources,
						fields: {
							sqrtPriceX96: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sqrtPriceX96 = resolvedEntity.sqrtPriceX96}
					{#if sqrtPriceX96 !== undefined && sqrtPriceX96 !== null}
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
						sources: selection.sources,
						fields: {
							liquidity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liquidity = resolvedEntity.liquidity}
					{#if liquidity !== undefined && liquidity !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tick: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tick = resolvedEntity.tick}
					{#if tick !== undefined && tick !== null}
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
						sources: selection.sources,
						fields: {
							feeProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeProtocol = resolvedEntity.feeProtocol}
					{#if feeProtocol !== undefined && feeProtocol !== null}
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
						sources: selection.sources,
						fields: {
							unlocked: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							observationIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observationIndex = resolvedEntity.observationIndex}
					{#if observationIndex !== undefined && observationIndex !== null}
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
						sources: selection.sources,
						fields: {
							observationCardinality: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observationCardinality = resolvedEntity.observationCardinality}
					{#if observationCardinality !== undefined && observationCardinality !== null}
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
						sources: selection.sources,
						fields: {
							observationCardinalityNext: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observationCardinalityNext = resolvedEntity.observationCardinalityNext}
					{#if observationCardinalityNext !== undefined && observationCardinalityNext !== null}
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
