<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(assets)/(pools)/pool/[chainId]/[poolId]', {
			chainId: String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`)),
			poolId: entityId.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LiquidityPool>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const pool = subscribe(EntityType.LiquidityPool,
		entityId,
		({ fields: { $baseToken: true, $quoteToken: true, $hooks: true, baseTokenSymbol: true, quoteTokenSymbol: true, baseTokenDecimals: true, quoteTokenDecimals: true, fee: true, tickSpacing: true, v4PoolId: true, $$timestamps: ({ sources: [
					Source.Dexscreener_OpenApi,
				], limit: 64 }), sqrtPriceX96: true, liquidity: true, tick: true, volumeUSD: true, totalValueLockedUSD: true, marketCapUsd: true, fdvUsd: true, pairCreatedAtMs: true, dexscreenerLabels: true, dexId: true, dexscreenerPairUrl: true, baseTokenPriceUsd: true, baseTokenPriceQuote: true, priceChangePercent24h: true, transactionBuys24h: true, transactionSells24h: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import LiquidityPool_TimestampsView from '$/views/LiquidityPool_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool}
	{entityId}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-text="muted">
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Concentrated-liquidity AMM pool on this network: token pair, optional on-chain curve state, and (when Dexscreener-backed) market volume and TVL.
		</p>
		<p>
			Dexscreener pair liquidityPools do not include swap fee tier, tick, <code>sqrtPrice</code>, or in-range liquidity <code>L</code>; those fields appear only when an execution RPC or pool indexer maps them. User tick ranges and ERC-721 position ids live on liquidity position liquidityPools.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={pool}
			placeholderText="Loading pool…"
		>
			{#snippet children(pool)}
				<dl data-column-item="center">
					{#if pool.fields.$baseToken}
						<div>
							<dt>Base token</dt>
							<dd>
								<EvmContractView
									entityId={pool.fields.$baseToken[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if pool.fields.$quoteToken}
						<div>
							<dt>Quote token</dt>
							<dd>
								<EvmContractView
									entityId={pool.fields.$quoteToken[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if pool.fields.baseTokenSymbol !== undefined}
						<div>
							<dt>Base token symbol</dt>
							<dd>{pool.fields.baseTokenSymbol}</dd>
						</div>
					{/if}
					{#if pool.fields.quoteTokenSymbol !== undefined}
						<div>
							<dt>Quote token symbol</dt>
							<dd>{pool.fields.quoteTokenSymbol}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.fee !== undefined
					)}
						<div>
							<dt>Fee</dt>
							<dd>{String(pool.fields.fee)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.tickSpacing !== undefined
					)}
						<div>
							<dt>Tick spacing</dt>
							<dd>{String(pool.fields.tickSpacing)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.$hooks
					)}
						<div>
							<dt>Hooks</dt>
							<dd>
								<EvmContractView
									entityId={pool.fields.$hooks[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.v4PoolId !== undefined
					)}
						<div>
							<dt>v4 pool id</dt>
							<dd>
								<TruncatedValue
									value={String(pool.fields.v4PoolId)}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.sqrtPriceX96 !== undefined
					)}
						<div>
							<dt>Sqrt price X96</dt>
							<dd>{String(pool.fields.sqrtPriceX96)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.liquidity !== undefined
					)}
						<div>
							<dt>Active liquidity</dt>
							<dd>{String(pool.fields.liquidity)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.tick !== undefined
					)}
						<div>
							<dt>Tick</dt>
							<dd>{String(pool.fields.tick)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.baseTokenDecimals !== undefined
					)}
						<div>
							<dt>Base token decimals</dt>
							<dd>{String(pool.fields.baseTokenDecimals)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.quoteTokenDecimals !== undefined
					)}
						<div>
							<dt>Quote token decimals</dt>
							<dd>{String(pool.fields.quoteTokenDecimals)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.volumeUSD !== undefined
					)}
						<div>
							<dt>Volume USD</dt>
							<dd>{String(pool.fields.volumeUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.totalValueLockedUSD !== undefined
					)}
						<div>
							<dt>TVL USD</dt>
							<dd>{String(pool.fields.totalValueLockedUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.marketCapUsd !== undefined
					)}
						<div>
							<dt>Market cap USD</dt>
							<dd>{String(pool.fields.marketCapUsd)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.fdvUsd !== undefined
					)}
						<div>
							<dt>FDV USD</dt>
							<dd>{String(pool.fields.fdvUsd)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.pairCreatedAtMs != null
					)}
						<div>
							<dt>Pair created</dt>
							<dd>
								<Timestamp
									timestamp={pool.fields.pairCreatedAtMs}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& (pool.fields.dexscreenerLabels?.values.length ?? 0) > 0
					)}
						<div>
							<dt>Labels</dt>
							<dd>{pool.fields.dexscreenerLabels?.values.join(', ')}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.dexId !== undefined
					)}
						<div>
							<dt>DEX</dt>
							<dd>{pool.fields.dexId}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.dexscreenerPairUrl !== undefined
					)}
						<div>
							<dt>Dexscreener</dt>
							<dd>
								<a
									href={pool.fields.dexscreenerPairUrl}
									rel="noreferrer"
									target="_blank"
								>{pool.fields.dexscreenerPairUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.baseTokenPriceUsd !== undefined
					)}
						<div>
							<dt>Base price USD</dt>
							<dd>{pool.fields.baseTokenPriceUsd}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.baseTokenPriceQuote !== undefined
					)}
						<div>
							<dt>Base price quote</dt>
							<dd>{pool.fields.baseTokenPriceQuote}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.priceChangePercent24h !== undefined
					)}
						<div>
							<dt>Price change 24h</dt>
							<dd>{String(pool.fields.priceChangePercent24h)}%</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.transactionBuys24h !== undefined
					)}
						<div>
							<dt>Buys 24h</dt>
							<dd>{String(pool.fields.transactionBuys24h)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fields.transactionSells24h !== undefined
					)}
						<div>
							<dt>Sells 24h</dt>
							<dd>{String(pool.fields.transactionSells24h)}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<LiquidityPool_TimestampsView
			entityFieldReference={{
				entityType: EntityType.LiquidityPool,
				entityId,
				fieldName: '$$timestamps',
			}}
			open={true}
		/>
	{/snippet}
</EntityView>
