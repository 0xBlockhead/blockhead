<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			entityId: EntityId<typeof schema, EntityType.Vault>
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const vault = useEntity(
		EntityType.Vault,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.Vault]?.map((resolver) => resolver.source)
				?? [Source.Dexscreener_OpenApi]
			),
			$token0: {},
			$token1: {},
			token0Symbol: {},
			token1Symbol: {},
			token0Decimals: {},
			token1Decimals: {},
			fee: {},
			tickSpacing: {},
			sqrtPriceX96: {},
			liquidity: {},
			tick: {},
			volumeUSD: {},
			totalValueLockedUSD: {},
			$hooks: {},
			v4PoolId: {},
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
	entityType={EntityType.Vault}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={vault}
			placeholderText="Loading vault…"
		>
			{#snippet children(vault)}
				{`${vault.token0Symbol} / ${vault.token1Symbol}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Concentrated-liquidity AMM pool: two tokens, a fee tier, curve price and tick state shared by LPs.
		</p>
		<p>
			Not an ERC-4626 yield vault, a storage download, or a social feed.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={vault}
			placeholderText="Loading vault…"
		>
			{#snippet children(vault)}
				<dl data-column-item="center">
					<div>
						<dt>Token 0</dt>
						<dd>
							<Address
								network={vault.$token0.$network}
								address={vault.$token0.address}
							/>
						</dd>
					</div>
					<div>
						<dt>Token 1</dt>
						<dd>
							<Address
								network={vault.$token1.$network}
								address={vault.$token1.address}
							/>
						</dd>
					</div>
					{#if open}
						{#if vault.token0Decimals !== undefined}
							<div>
								<dt>Token 0 decimals</dt>
								<dd>{String(vault.token0Decimals)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.token1Decimals !== undefined}
							<div>
								<dt>Token 1 decimals</dt>
								<dd>{String(vault.token1Decimals)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.fee !== undefined}
							<div>
								<dt>Fee</dt>
								<dd>{String(vault.fee)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.tickSpacing !== undefined}
							<div>
								<dt>Tick spacing</dt>
								<dd>{String(vault.tickSpacing)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.sqrtPriceX96 !== undefined}
							<div>
								<dt>Sqrt price X96</dt>
								<dd>{String(vault.sqrtPriceX96)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.liquidity !== undefined}
							<div>
								<dt>Liquidity</dt>
								<dd>{String(vault.liquidity)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.tick !== undefined}
							<div>
								<dt>Tick</dt>
								<dd>{String(vault.tick)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.volumeUSD !== undefined}
							<div>
								<dt>Volume USD</dt>
								<dd>{String(vault.volumeUSD)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.totalValueLockedUSD !== undefined}
							<div>
								<dt>TVL USD</dt>
								<dd>{String(vault.totalValueLockedUSD)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.$hooks !== undefined}
							<div>
								<dt>Hooks</dt>
								<dd>
									<Address
										network={vault.$hooks.$network}
										address={vault.$hooks.address}
									/>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if vault.v4PoolId !== undefined}
							<div>
								<dt>Pool id</dt>
								<dd>
									<TruncatedValue
										value={vault.v4PoolId}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.Vault}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
