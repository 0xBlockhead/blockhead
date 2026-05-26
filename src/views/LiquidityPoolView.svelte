<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/pool/[chainId]/[poolId]', {
			chainId: String(entityId.$network.chainId),
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const pool = useEntity(
		EntityType.LiquidityPool,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.LiquidityPool]?.map((resolver) => resolver.source)
				?? [Source.Dexscreener_OpenApi]
			),
			$token0: {},
			$token1: {},
			$hooks: {},
			token0Symbol: {},
			token1Symbol: {},
			token0Decimals: {},
			token1Decimals: {},
			fee: {},
			tickSpacing: {},
			v4PoolId: {},
			sqrtPriceX96: {},
			liquidity: {},
			tick: {},
			volumeUSD: {},
			totalValueLockedUSD: {},
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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
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
		<ResourceBoundary
			resource={pool}
			placeholderText="Loading pool…"
		>
			{#snippet children(loadedPool)}
				{loadedPool.token0Symbol} / {loadedPool.token1Symbol}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<span data-text="muted">
			{@render Value()}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Concentrated-liquidity AMM pool on this network: token pair, optional on-chain curve state, and (when Dexscreener-backed) market volume and TVL.
		</p>
		<p>
			Dexscreener pair rows do not include swap fee tier, tick, <code>sqrtPrice</code>, or in-range liquidity <code>L</code>; those fields appear only when an execution RPC or pool indexer maps them. User tick ranges and ERC-721 position ids live on liquidity position rows.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={pool}
			placeholderText="Loading pool…"
		>
			{#snippet children(loadedPool)}
				<dl data-column-item="center">
					{#if open}
						<div>
							<dt>Note</dt>
							<dd>
								<div data-row="wrap align-center gap-2">
									<span data-text="muted">Market stats from Dexscreener when available; on-chain curve fields appear only when another source maps them.</span>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>Dexscreener supplies token addresses, symbols, 24h volume, and USD TVL on the pair API—not Uniswap v3 slot0 fee tier, tick, <code>sqrtPriceX96</code>, or concentrated-liquidity <code>L</code>.</p>
											<p>User-specific tick ranges, owed fees, and ERC-721 position token ids live on liquidity position / leverage rows instead.</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Pool vs position rows"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							</dd>
						</div>
					{/if}
					<div>
						<dt>Token 0</dt>
						<dd>
							<EvmContractView
								entityId={loadedPool.$token0}
								layout={EntityLayout.SummaryDetails}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					<div>
						<dt>Token 1</dt>
						<dd>
							<EvmContractView
								entityId={loadedPool.$token1}
								layout={EntityLayout.SummaryDetails}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					{#if (
						open
						&& loadedPool.fee !== undefined
					)}
						<div>
							<dt>Fee tier (v3 swap fee parameter)</dt>
							<dd>{String(loadedPool.fee)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.tickSpacing !== undefined
					)}
						<div>
							<dt>Tick spacing (v3 grid step)</dt>
							<dd>{String(loadedPool.tickSpacing)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.$hooks
					)}
						<div>
							<dt>Hooks</dt>
							<dd>
								<EvmContractView
									entityId={loadedPool.$hooks}
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.v4PoolId !== undefined
					)}
						<div>
							<dt>v4 pool id</dt>
							<dd>
								<TruncatedValue
									value={String(loadedPool.v4PoolId)}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.sqrtPriceX96 !== undefined
					)}
						<div>
							<dt>Sqrt price X96</dt>
							<dd>{String(loadedPool.sqrtPriceX96)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.liquidity !== undefined
					)}
						<div>
							<dt>Active liquidity</dt>
							<dd>{String(loadedPool.liquidity)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.tick !== undefined
					)}
						<div>
							<dt>Tick</dt>
							<dd>{String(loadedPool.tick)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.token0Decimals !== undefined
					)}
						<div>
							<dt>Token 0 decimals</dt>
							<dd>{String(loadedPool.token0Decimals)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.token1Decimals !== undefined
					)}
						<div>
							<dt>Token 1 decimals</dt>
							<dd>{String(loadedPool.token1Decimals)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.volumeUSD !== undefined
					)}
						<div>
							<dt>Volume USD (24h)</dt>
							<dd>{String(loadedPool.volumeUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.totalValueLockedUSD !== undefined
					)}
						<div>
							<dt>TVL USD</dt>
							<dd>{String(loadedPool.totalValueLockedUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.dexId !== undefined
					)}
						<div>
							<dt>DEX</dt>
							<dd>{loadedPool.dexId}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.dexscreenerPairUrl !== undefined
					)}
						<div>
							<dt>Dexscreener</dt>
							<dd>
								<a
									href={loadedPool.dexscreenerPairUrl}
									rel="noreferrer"
									target="_blank"
								>{loadedPool.dexscreenerPairUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.baseTokenPriceUsd !== undefined
					)}
						<div>
							<dt>Base price (USD)</dt>
							<dd>{loadedPool.baseTokenPriceUsd}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.baseTokenPriceQuote !== undefined
					)}
						<div>
							<dt>Base price (quote)</dt>
							<dd>{loadedPool.baseTokenPriceQuote}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.priceChangePercent24h !== undefined
					)}
						<div>
							<dt>Price change (24h)</dt>
							<dd>{String(loadedPool.priceChangePercent24h)}%</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.transactionBuys24h !== undefined
					)}
						<div>
							<dt>Buys (24h)</dt>
							<dd>{String(loadedPool.transactionBuys24h)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& loadedPool.transactionSells24h !== undefined
					)}
						<div>
							<dt>Sells (24h)</dt>
							<dd>{String(loadedPool.transactionSells24h)}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.LiquidityPool}
			{entityId}
		/>
	{/snippet}
</EntityView>
