<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { evmChainIdFromNetworkId } from '$/lib/caip.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/pool/[chainId]/[poolId]', {
			chainId: String(evmChainIdFromNetworkId(entityId.$liquidityPool.$network)),
			poolId: entityId.$liquidityPool.id,
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LiquidityPool_Timestamp>
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const poolTimestamp = useEntity(
		EntityType.LiquidityPool_Timestamp,
		entityId,
		{
			$: [
				Source.Dexscreener_OpenApi,
			],
			priceUsd: {},
			priceNative: {},
			liquidityUsd: {},
			volumeUsd24h: {},
			priceChangePercent24h: {},
			transactionBuys24h: {},
			transactionSells24h: {},
			marketCapUsd: {},
			fdvUsd: {},
			transport: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Timestamp}
	{entityId}
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
				{#if poolTimestamp.priceUsd !== undefined}
					{poolTimestamp.priceUsd}
				{:else}
					<Timestamp
						timestamp={entityId.timestampMs}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
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
								timestamp={entityId.timestampMs}
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

	{#snippet Details({ open })}
	{/snippet}
</EntityView>
