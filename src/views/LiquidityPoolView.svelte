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


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.LiquidityPool>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
			| 'TypeAnnotationTooltip'
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
	{href}
	{open}
	{...entityViewRest}
	summaryUsesHeading={true}
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
			{#snippet children(pool)}
				{pool.token0Symbol} / {pool.token1Symbol}
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
			Concentrated-liquidity AMM pool on this network: two tokens, swap fee parameter, and curve state (<code>sqrtPrice</code>, tick, aggregate liquidity).
		</p>
		<p>
			Concentrated-liquidity positions own tick ranges, accrued fees, and ERC-721 position tokens; the pool row only carries the pair’s shared curve and aggregate depth.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={pool}
			placeholderText="Loading pool…"
		>
			{#snippet children(pool)}
				<dl data-column-item="center">
					{#if open}
						<div>
							<dt>Note</dt>
							<dd>
								<div data-row="wrap align-center gap-2">
									<span data-text="muted">Uniswap v3–style curve metadata on this pool row.</span>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>Canonical Uniswap v3–style curve for the pair: swap fee tier and tick spacing define the pool; <code>sqrtPrice</code>, active tick, and in-range liquidity describe the bonding curve. Fee magnitudes use Uniswap fee units (hundredths of a bip, e.g. <code>500</code> ≈ 0.05%). User-specific tick ranges, owed fees, and the ERC-721 position token id live on liquidity position / leverage rows instead.</p>
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
								entityId={pool.$token0}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(pool.$token0.$network.chainId),
										address: pool.$token0.address,
									},
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					<div>
						<dt>Token 1</dt>
						<dd>
							<EvmContractView
								entityId={pool.$token1}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(pool.$token1.$network.chainId),
										address: pool.$token1.address,
									},
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					{#if open}
						{#if pool.fee !== undefined}
							<div>
								<dt>Fee tier (v3 swap fee parameter)</dt>
								<dd>{String(pool.fee)}</dd>
							</div>
						{/if}

						{#if pool.tickSpacing !== undefined}
							<div>
								<dt>Tick spacing (v3 grid step)</dt>
								<dd>{String(pool.tickSpacing)}</dd>
							</div>
						{/if}

						{#if pool.$hooks}
							<div>
								<dt>Hooks</dt>
								<dd>
									<EvmContractView
										entityId={pool.$hooks}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
											{
												networkId: String(pool.$hooks.$network.chainId),
												address: pool.$hooks.address,
											},
										)}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if pool.v4PoolId !== undefined}
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

						{#if pool.sqrtPriceX96 !== undefined}
							<div>
								<dt>Sqrt price X96</dt>
								<dd>{String(pool.sqrtPriceX96)}</dd>
							</div>
						{/if}

						{#if pool.liquidity !== undefined}
							<div>
								<dt>Active liquidity</dt>
								<dd>{String(pool.liquidity)}</dd>
							</div>
						{/if}

						{#if pool.tick !== undefined}
							<div>
								<dt>Tick</dt>
								<dd>{String(pool.tick)}</dd>
							</div>
						{/if}

						{#if pool.token0Decimals !== undefined}
							<div>
								<dt>Token 0 decimals</dt>
								<dd>{String(pool.token0Decimals)}</dd>
							</div>
						{/if}

						{#if pool.token1Decimals !== undefined}
							<div>
								<dt>Token 1 decimals</dt>
								<dd>{String(pool.token1Decimals)}</dd>
							</div>
						{/if}

						{#if pool.volumeUSD !== undefined}
							<div>
								<dt>Volume USD</dt>
								<dd>{String(pool.volumeUSD)}</dd>
							</div>
						{/if}

						{#if pool.totalValueLockedUSD !== undefined}
							<div>
								<dt>TVL USD</dt>
								<dd>{String(pool.totalValueLockedUSD)}</dd>
							</div>
						{/if}
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

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
