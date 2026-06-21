<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
		selection,
		href = resolve('/(assets)/(pools)/pool/[chainId=eip155ChainId]/[poolId]', {
			chainId: String(evmChainIdFromCaip2(`${selection.entitySelector.$liquidityPool.$network.caip2.namespace}:${selection.entitySelector.$liquidityPool.$network.caip2.reference}`)),
			poolId: selection.entitySelector.$liquidityPool.id,
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool_Timestamp>
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

	const poolTimestamp = $derived(selection( { sources: [
				...(layout === EntityLayout.Summary ? [] : [Source.Dexscreener_OpenApi]),
			], fields: { ...(layout !== EntityLayout.Summary && { $parentLiquidityPool: true, priceUsd: true, priceNative: true, liquidityUsd: true, volumeUsd24h: true, priceChangePercent24h: true, transactionBuys24h: true, transactionSells24h: true, marketCapUsd: true, fdvUsd: true, transport: true }) } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Timestamp}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	title="Pool observation"
	{...EntityViewProps}
>
	{#snippet Value()}
		{#if layout === EntityLayout.Summary}
			<Timestamp
				timestamp={selection.entitySelector.timestampMs}
			/>
		{:else}
			<ResourceBoundary
				placeholderText="Loading pool observation…"
				resource={poolTimestamp}
			>
				{#snippet children(poolTimestamp)}
					{#if poolTimestamp.priceUsd !== undefined}
						{poolTimestamp.priceUsd}
					{:else}
						<Timestamp
							timestamp={selection.entitySelector.timestampMs}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
								timestamp={selection.entitySelector.timestampMs}
							/>
						</dd>
					</div>

					<div>
						<dt>Pool</dt>
						<dd>
							<LiquidityPoolView
								selection={select(EntityType.LiquidityPool, poolTimestamp.$parentLiquidityPool?.[EntityMetaKey.Selector] ?? selection.entitySelector.$liquidityPool)}
								layout={EntityLayout.Title}

								open={false}
								/>
						</dd>
					</div>

					{#if poolTimestamp.priceUsd !== undefined}
						<div>
							<dt>Price USD</dt>
							<dd>{poolTimestamp.priceUsd}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.priceNative !== undefined
					)}
						<div>
							<dt>Price native</dt>
							<dd>{poolTimestamp.priceNative}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.liquidityUsd !== undefined
					)}
						<div>
							<dt>Liquidity USD</dt>
							<dd>{String(poolTimestamp.liquidityUsd)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.volumeUsd24h !== undefined
					)}
						<div>
							<dt>Volume USD 24h</dt>
							<dd>{String(poolTimestamp.volumeUsd24h)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.priceChangePercent24h !== undefined
					)}
						<div>
							<dt>Price change 24h</dt>
							<dd>{String(poolTimestamp.priceChangePercent24h)}%</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.transactionBuys24h !== undefined
					)}
						<div>
							<dt>Buys 24h</dt>
							<dd>{String(poolTimestamp.transactionBuys24h)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.transactionSells24h !== undefined
					)}
						<div>
							<dt>Sells 24h</dt>
							<dd>{String(poolTimestamp.transactionSells24h)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.marketCapUsd !== undefined
					)}
						<div>
							<dt>Market cap USD</dt>
							<dd>{String(poolTimestamp.marketCapUsd)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.fdvUsd !== undefined
					)}
						<div>
							<dt>FDV USD</dt>
							<dd>{String(poolTimestamp.fdvUsd)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& poolTimestamp.transport !== undefined
					)}
						<div>
							<dt>Transport</dt>
							<dd>{poolTimestamp.transport}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

</EntityView>
