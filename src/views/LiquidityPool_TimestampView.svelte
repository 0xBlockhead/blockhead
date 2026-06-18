<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(assets)/(pools)/pool/[chainId]/[poolId]', {
			chainId: String(evmChainIdFromCaip2(`${selector.$liquidityPool.$network.caip2.namespace}:${selector.$liquidityPool.$network.caip2.reference}`)),
			poolId: selector.$liquidityPool.id,
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LiquidityPool_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { select } from '$/routes/+layout.svelte'

	const poolTimestamp = $derived(select(EntityType.LiquidityPool_Timestamp, selector, ({ sources: [
				Source.Dexscreener_OpenApi,
			], fields: { $parentLiquidityPool: true, priceUsd: true, priceNative: true, liquidityUsd: true, volumeUsd24h: true, priceChangePercent24h: true, transactionBuys24h: true, transactionSells24h: true, marketCapUsd: true, fdvUsd: true, transport: true } })))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="Pool observation"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			placeholderText="Loading pool observation…"
			resource={poolTimestamp}
		>
			{#snippet children(poolTimestamp)}
				{#if poolTimestamp.fields.priceUsd !== undefined}
					{poolTimestamp.fields.priceUsd}
				{:else}
					<Timestamp
						timestamp={selector.timestampMs}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A timestamped liquidity pool market observation: latest price, volume, liquidity, transaction counts, market cap, and provider provenance.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			placeholderText="Loading pool observation…"
			resource={poolTimestamp}
		>
			{#snippet children(poolTimestamp)}
				<dl data-column-item="center">
					<div>
						<dt>Observed at</dt>
						<dd>
							<Timestamp
								timestamp={selector.timestampMs}
							/>
						</dd>
					</div>

					<div>
						<dt>Pool</dt>
						<dd>
							<LiquidityPoolView
								selector={poolTimestamp.fields.$parentLiquidityPool?.[EntityMetaKey.Selector] ?? selector.$liquidityPool}
								layout={EntityLayout.Title}

								open={false}
								/>
						</dd>
					</div>

					{#if poolTimestamp.fields.priceUsd !== undefined}
						<div>
							<dt>Price USD</dt>
							<dd>{poolTimestamp.fields.priceUsd}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.priceNative !== undefined
					)}
						<div>
							<dt>Price native</dt>
							<dd>{poolTimestamp.fields.priceNative}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.liquidityUsd !== undefined
					)}
						<div>
							<dt>Liquidity USD</dt>
							<dd>{String(poolTimestamp.fields.liquidityUsd)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.volumeUsd24h !== undefined
					)}
						<div>
							<dt>Volume USD 24h</dt>
							<dd>{String(poolTimestamp.fields.volumeUsd24h)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.priceChangePercent24h !== undefined
					)}
						<div>
							<dt>Price change 24h</dt>
							<dd>{String(poolTimestamp.fields.priceChangePercent24h)}%</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.transactionBuys24h !== undefined
					)}
						<div>
							<dt>Buys 24h</dt>
							<dd>{String(poolTimestamp.fields.transactionBuys24h)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.transactionSells24h !== undefined
					)}
						<div>
							<dt>Sells 24h</dt>
							<dd>{String(poolTimestamp.fields.transactionSells24h)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.marketCapUsd !== undefined
					)}
						<div>
							<dt>Market cap USD</dt>
							<dd>{String(poolTimestamp.fields.marketCapUsd)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.fdvUsd !== undefined
					)}
						<div>
							<dt>FDV USD</dt>
							<dd>{String(poolTimestamp.fields.fdvUsd)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fields.transport !== undefined
					)}
						<div>
							<dt>Transport</dt>
							<dd>{poolTimestamp.fields.transport}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

</EntityView>
