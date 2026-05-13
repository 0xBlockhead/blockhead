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
			fee: {},
			tickSpacing: {},
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
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
	{#snippet Heading()}
		<ResourceBoundary
			resource={vault}
			placeholderText="Loading vault…"
		>
			{#snippet children(v)}
				<HeadingComponent>{`${v.token0Symbol} / ${v.token1Symbol}`}</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={vault}
			placeholderText="Loading vault…"
		>
			{#snippet children(v)}
				<dl>
					<div>
						<dt>Vault id</dt>
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
								network={v.$token0.$network}
								address={v.$token0.address}
							/>
						</dd>
					</div>
					<div>
						<dt>Token 1</dt>
						<dd>
							<Address
								network={v.$token1.$network}
								address={v.$token1.address}
							/>
						</dd>
					</div>
					{#if open}
						{#if v.fee !== undefined}
							<div>
								<dt>Fee</dt>
								<dd>{String(v.fee)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if v.tickSpacing !== undefined}
							<div>
								<dt>Tick spacing</dt>
								<dd>{String(v.tickSpacing)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if v.sqrtPriceX96 !== undefined}
							<div>
								<dt>Sqrt price X96</dt>
								<dd>{String(v.sqrtPriceX96)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if v.liquidity !== undefined}
							<div>
								<dt>Liquidity</dt>
								<dd>{String(v.liquidity)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if v.tick !== undefined}
							<div>
								<dt>Tick</dt>
								<dd>{String(v.tick)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if v.volumeUSD !== undefined}
							<div>
								<dt>Volume USD</dt>
								<dd>{String(v.volumeUSD)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if v.totalValueLockedUSD !== undefined}
							<div>
								<dt>TVL USD</dt>
								<dd>{String(v.totalValueLockedUSD)}</dd>
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
