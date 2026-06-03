<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
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
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const pool = useEntity(
		EntityType.LiquidityPool,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.LiquidityPool]?.map((resolver) => resolver.source)
				?? [Source.Dexscreener_OpenApi]
			),
			$baseToken: {},
			$quoteToken: {},
			$hooks: {},
			baseTokenSymbol: {},
			quoteTokenSymbol: {},
			baseTokenDecimals: {},
			quoteTokenDecimals: {},
			fee: {},
			tickSpacing: {},
			v4PoolId: {},
			$$timestamps: {
				$: [
					Source.Dexscreener_OpenApi,
				],
				$limit: 64,
			},
			sqrtPriceX96: {},
			liquidity: {},
			tick: {},
			volumeUSD: {},
			totalValueLockedUSD: {},
			marketCapUsd: {},
			fdvUsd: {},
			pairCreatedAtMs: {},
			dexscreenerLabels: {},
			dexId: {},
			dexscreenerPairUrl: {},
			baseTokenPriceUsd: {},
			baseTokenPriceQuote: {},
			priceChangePercent24h: {},
			transactionBuys24h: {},
			transactionSells24h: {},
		},
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
					{#if pool.$baseToken}
						<div>
							<dt>Base token</dt>
							<dd>
								<EvmContractView
									entityId={pool.$baseToken[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if pool.$quoteToken}
						<div>
							<dt>Quote token</dt>
							<dd>
								<EvmContractView
									entityId={pool.$quoteToken[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if pool.baseTokenSymbol !== undefined}
						<div>
							<dt>Base token symbol</dt>
							<dd>{pool.baseTokenSymbol}</dd>
						</div>
					{/if}
					{#if pool.quoteTokenSymbol !== undefined}
						<div>
							<dt>Quote token symbol</dt>
							<dd>{pool.quoteTokenSymbol}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fee !== undefined
					)}
						<div>
							<dt>Fee</dt>
							<dd>{String(pool.fee)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.tickSpacing !== undefined
					)}
						<div>
							<dt>Tick spacing</dt>
							<dd>{String(pool.tickSpacing)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.$hooks
					)}
						<div>
							<dt>Hooks</dt>
							<dd>
								<EvmContractView
									entityId={pool.$hooks[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.v4PoolId !== undefined
					)}
						<div>
							<dt>v4 pool id</dt>
							<dd>
								<TruncatedValue
									value={String(pool.v4PoolId)}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.sqrtPriceX96 !== undefined
					)}
						<div>
							<dt>Sqrt price X96</dt>
							<dd>{String(pool.sqrtPriceX96)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.liquidity !== undefined
					)}
						<div>
							<dt>Active liquidity</dt>
							<dd>{String(pool.liquidity)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.tick !== undefined
					)}
						<div>
							<dt>Tick</dt>
							<dd>{String(pool.tick)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.baseTokenDecimals !== undefined
					)}
						<div>
							<dt>Base token decimals</dt>
							<dd>{String(pool.baseTokenDecimals)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.quoteTokenDecimals !== undefined
					)}
						<div>
							<dt>Quote token decimals</dt>
							<dd>{String(pool.quoteTokenDecimals)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.volumeUSD !== undefined
					)}
						<div>
							<dt>Volume USD</dt>
							<dd>{String(pool.volumeUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.totalValueLockedUSD !== undefined
					)}
						<div>
							<dt>TVL USD</dt>
							<dd>{String(pool.totalValueLockedUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.marketCapUsd !== undefined
					)}
						<div>
							<dt>Market cap USD</dt>
							<dd>{String(pool.marketCapUsd)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.fdvUsd !== undefined
					)}
						<div>
							<dt>FDV USD</dt>
							<dd>{String(pool.fdvUsd)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.pairCreatedAtMs != null
					)}
						<div>
							<dt>Pair created</dt>
							<dd>
								<Timestamp
									timestamp={pool.pairCreatedAtMs}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& (pool.dexscreenerLabels?.length ?? 0) > 0
					)}
						<div>
							<dt>Labels</dt>
							<dd>{pool.dexscreenerLabels?.join(', ')}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.dexId !== undefined
					)}
						<div>
							<dt>DEX</dt>
							<dd>{pool.dexId}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.dexscreenerPairUrl !== undefined
					)}
						<div>
							<dt>Dexscreener</dt>
							<dd>
								<a
									href={pool.dexscreenerPairUrl}
									rel="noreferrer"
									target="_blank"
								>{pool.dexscreenerPairUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.baseTokenPriceUsd !== undefined
					)}
						<div>
							<dt>Base price USD</dt>
							<dd>{pool.baseTokenPriceUsd}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.baseTokenPriceQuote !== undefined
					)}
						<div>
							<dt>Base price quote</dt>
							<dd>{pool.baseTokenPriceQuote}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.priceChangePercent24h !== undefined
					)}
						<div>
							<dt>Price change 24h</dt>
							<dd>{String(pool.priceChangePercent24h)}%</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.transactionBuys24h !== undefined
					)}
						<div>
							<dt>Buys 24h</dt>
							<dd>{String(pool.transactionBuys24h)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& pool.transactionSells24h !== undefined
					)}
						<div>
							<dt>Sells 24h</dt>
							<dd>{String(pool.transactionSells24h)}</dd>
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
