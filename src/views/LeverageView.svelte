<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/position/[positionId]', {
			positionId: entityId.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Leverage>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const leverage = useEntity(
		EntityType.Leverage,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.Leverage]?.map((r) => r.source)
				?? []
			),
			$pool: {},
			$owner: {},
			createdAtTimestamp: {},
			liquidity: {},
			origin: {},
			tickLower: {},
			tickUpper: {},
			token0Owed: {},
			token1Owed: {},
			tokenId: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Leverage}
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
			resource={leverage}
			placeholderText="Loading leverage row…"
		>
			{#snippet children(loadedLeverage)}
				{loadedLeverage.tokenId != null ?
					`NFT #${String(loadedLeverage.tokenId)}`
				:
					entityId.id
				}
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
			Concentrated-liquidity LP position accounting: owner, tick range, in-range liquidity, uncollected fees, optional ERC-721 token id.
		</p>
		<p>
			Not CEX margin, borrow APR, or liquidation. Requires an on-chain resolver—Dexscreener pool rows do not supply position-scoped state.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={leverage}
			placeholderText="Loading leverage row…"
		>
			{#snippet children(loadedLeverage)}
				<dl data-column-item="center">
					{#if open}
						<div>
							<dt>Note</dt>
							<dd data-text="muted">
								Here “leverage” names concentrated-liquidity position accounting—tick range, in-range liquidity, uncollected fees, ERC-721 token id—not perpetual margin, borrow APR, or liquidation state from a CEX. No position indexer is wired in this app yet.
							</dd>
						</div>
					{/if}
					<div>
						<dt>Network</dt>
						<dd>
							<NetworkView
								entityId={loadedLeverage.$pool.$network}
								layout={EntityLayout.Title}
								open={false}
							/>
						</dd>
					</div>
					<div>
						<dt>AMM pool (Uniswap v3-style)</dt>
						<dd>
							<LiquidityPoolView
								entityId={loadedLeverage.$pool[EntityMetaKey.Id]}
								layout={EntityLayout.SummaryDetails}
								open={true}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					{#if open}
						<div>
							<dt>Owner</dt>
							<dd>
								<ActorNetworkView
									entityId={{
										$network: loadedLeverage.$pool.$network,
										$actor: loadedLeverage.$owner[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
						{#if loadedLeverage.tickLower !== undefined}
							<div>
								<dt>LP NFT range · tick lower</dt>
								<dd>{String(loadedLeverage.tickLower)}</dd>
							</div>
						{/if}

						{#if loadedLeverage.tickUpper !== undefined}
							<div>
								<dt>LP NFT range · tick upper</dt>
								<dd>{String(loadedLeverage.tickUpper)}</dd>
							</div>
						{/if}

						{#if loadedLeverage.liquidity !== undefined}
							<div>
								<dt>Position liquidity (NFT range)</dt>
								<dd>{String(loadedLeverage.liquidity)}</dd>
							</div>
						{/if}

						{#if loadedLeverage.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(loadedLeverage.token0Owed)}</dd>
							</div>
						{/if}

						{#if loadedLeverage.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(loadedLeverage.token1Owed)}</dd>
							</div>
						{/if}

						{#if loadedLeverage.tokenId !== undefined}
							<div>
								<dt>Position NFT token id</dt>
								<dd>{String(loadedLeverage.tokenId)}</dd>
							</div>
						{/if}

						{#if loadedLeverage.origin}
							<div>
								<dt>Origin</dt>
								<dd>{loadedLeverage.origin}</dd>
							</div>
						{/if}
					{/if}

					{#if loadedLeverage.createdAtTimestamp !== undefined}
						<div>
							<dt>Created at</dt>
							<dd>
								<Timestamp
									timestamp={loadedLeverage.createdAtTimestamp}
								/>
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

	{/snippet}
</EntityView>
