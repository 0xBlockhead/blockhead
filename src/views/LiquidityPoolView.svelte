<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(assets)/(pools)/pool/[chainId=eip155ChainId]/[poolId]', {
			chainId: String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`)),
			poolId: selection.entitySelector.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool>
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
	import { select } from '$/routes/+layout.svelte'


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
	entitySelector={selection.entitySelector}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.id}
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
			resource={selection(
					({ fields: { $baseToken: true, $quoteToken: true, baseTokenSymbol: true, quoteTokenSymbol: true, pairCreatedAtMs: true, dexscreenerLabels: true, dexId: true, dexscreenerPairUrl: true } }),
				)}
			placeholderText="Loading pool…"
		>
			{#snippet children(pool)}
				<dl data-column-item="center">
					{#if pool.$baseToken}
						<div>
							<dt>Base token</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, pool.$baseToken[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}

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
									selection={select(EntityType.EvmContract, pool.$quoteToken[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}

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
									selection={select(EntityType.EvmContract, pool.$hooks[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}

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
							&& (pool.dexscreenerLabels?.values.length ?? 0) > 0
						)}
						<div>
							<dt>Labels</dt>
								<dd>{pool.dexscreenerLabels?.values.join(', ')}</dd>
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
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<LiquidityPool_TimestampsView
			selection={selection.$$timestamps}
			open={true}
		/>
	{/snippet}
</EntityView>
