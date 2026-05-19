<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


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
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<ResourceBoundary
			resource={pool}
			placeholderText="Loading pool…"
		>
			{#snippet children(p)}
				{p.token0Symbol} / {p.token1Symbol}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<span data-text="muted">
			<span data-text="font-monospace">
				{entityId.id}
			</span>
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
			{#snippet children(p)}
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
						<dt>Pool id (AMM)</dt>
						<dd>
							<TruncatedValue
								value={entityId.id}
								format={TruncatedValueFormat.Visual}
							/>
						</dd>
					</div>
					<div>
						<dt>Token 0</dt>
						<dd>
							<Address
								network={p.$token0.$network}
								address={p.$token0.address}
							/>
						</dd>
					</div>
					<div>
						<dt>Token 1</dt>
						<dd>
							<Address
								network={p.$token1.$network}
								address={p.$token1.address}
							/>
						</dd>
					</div>
					{#if open}
						{#if p.fee !== undefined}
							<div>
								<dt>Fee tier (v3 swap fee parameter)</dt>
								<dd>{String(p.fee)}</dd>
							</div>
						{/if}

						{#if p.tickSpacing !== undefined}
							<div>
								<dt>Tick spacing (v3 grid step)</dt>
								<dd>{String(p.tickSpacing)}</dd>
							</div>
						{/if}

						{#if p.$hooks}
							<div>
								<dt>Hooks</dt>
								<dd>
									<Address
										network={p.$hooks.$network}
										address={p.$hooks.address}
									/>
								</dd>
							</div>
						{/if}

						{#if p.v4PoolId !== undefined}
							<div>
								<dt>v4 pool id</dt>
								<dd>
									<TruncatedValue
										value={String(p.v4PoolId)}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if p.sqrtPriceX96 !== undefined}
							<div>
								<dt>Sqrt price X96</dt>
								<dd>{String(p.sqrtPriceX96)}</dd>
							</div>
						{/if}

						{#if p.liquidity !== undefined}
							<div>
								<dt>Active liquidity</dt>
								<dd>{String(p.liquidity)}</dd>
							</div>
						{/if}

						{#if p.tick !== undefined}
							<div>
								<dt>Tick</dt>
								<dd>{String(p.tick)}</dd>
							</div>
						{/if}

						{#if p.token0Decimals !== undefined}
							<div>
								<dt>Token 0 decimals</dt>
								<dd>{String(p.token0Decimals)}</dd>
							</div>
						{/if}

						{#if p.token1Decimals !== undefined}
							<div>
								<dt>Token 1 decimals</dt>
								<dd>{String(p.token1Decimals)}</dd>
							</div>
						{/if}

						{#if p.volumeUSD !== undefined}
							<div>
								<dt>Volume USD</dt>
								<dd>{String(p.volumeUSD)}</dd>
							</div>
						{/if}

						{#if p.totalValueLockedUSD !== undefined}
							<div>
								<dt>TVL USD</dt>
								<dd>{String(p.totalValueLockedUSD)}</dd>
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
