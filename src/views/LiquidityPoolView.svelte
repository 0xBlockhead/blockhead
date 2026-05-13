<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


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
		>
	> = $props()


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
</script>


<EntityView
	entityType={EntityType.LiquidityPool}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={pool}
			placeholderText="Loading pool…"
		>
			{#snippet children(p)}
				<HeadingComponent>
					{p.token0Symbol} / {p.token1Symbol}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={pool}
			placeholderText="Loading pool…"
		>
			{#snippet children(p)}
				<dl>
					<div>
						<dt>Chain id</dt>
						<dd>{String(p.$token0.$network.chainId)}</dd>
					</div>
					<div>
						<dt>Pool id</dt>
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
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.LiquidityPool}
				{entityId}
			>
				<ResourceBoundary
					resource={pool}
					placeholderText="Loading pool…"
				>
					{#snippet children(p)}
						<dl>
							{#if p.fee !== undefined}
								<div>
									<dt>Fee</dt>
									<dd>{String(p.fee)}</dd>
								</div>
							{/if}
							{#if p.tickSpacing !== undefined}
								<div>
									<dt>Tick spacing</dt>
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
									<dt>Liquidity</dt>
									<dd>{String(p.liquidity)}</dd>
								</div>
							{/if}
							{#if p.tick !== undefined}
								<div>
									<dt>Tick</dt>
									<dd>{String(p.tick)}</dd>
								</div>
							{/if}
							{#if p.token0Symbol !== undefined}
								<div>
									<dt>Token 0 symbol</dt>
									<dd>{p.token0Symbol}</dd>
								</div>
							{/if}
							{#if p.token1Symbol !== undefined}
								<div>
									<dt>Token 1 symbol</dt>
									<dd>{p.token1Symbol}</dd>
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
						</dl>
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
