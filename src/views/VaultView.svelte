<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Vault}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span>
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
		<dl data-column-item="center">
			<div>
				<dt>Token 0</dt>
				<dd>
					<ResourceBoundary
						resource={vault}
						placeholderText="Loading vault…"
					>
						{#snippet children(vault)}
							<EvmContractView
								entityId={vault.$token0}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(vault.$token0.$network.chainId),
										address: vault.$token0.address,
									},
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Token 1</dt>
				<dd>
					<ResourceBoundary
						resource={vault}
						placeholderText="Loading vault…"
					>
						{#snippet children(vault)}
							<EvmContractView
								entityId={vault.$token1}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(vault.$token1.$network.chainId),
										address: vault.$token1.address,
									},
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Token 0 decimals</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.token0Decimals !== undefined}
									{String(vault.token0Decimals)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Token 1 decimals</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.token1Decimals !== undefined}
									{String(vault.token1Decimals)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Fee</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.fee !== undefined}
									{String(vault.fee)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Tick spacing</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.tickSpacing !== undefined}
									{String(vault.tickSpacing)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Sqrt price X96</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.sqrtPriceX96 !== undefined}
									{String(vault.sqrtPriceX96)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Liquidity</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.liquidity !== undefined}
									{String(vault.liquidity)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Tick</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.tick !== undefined}
									{String(vault.tick)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Volume USD</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.volumeUSD !== undefined}
									{String(vault.volumeUSD)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>TVL USD</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.totalValueLockedUSD !== undefined}
									{String(vault.totalValueLockedUSD)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Hooks</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.$hooks !== undefined}
									<EvmContractView
										entityId={vault.$hooks}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
											{
												networkId: String(vault.$hooks.$network.chainId),
												address: vault.$hooks.address,
											},
										)}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Pool id</dt>
					<dd>
						<ResourceBoundary
							resource={vault}
							placeholderText="Loading vault…"
						>
							{#snippet children(vault)}
								{#if vault.v4PoolId !== undefined}
									<TruncatedValue
										value={vault.v4PoolId}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
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
