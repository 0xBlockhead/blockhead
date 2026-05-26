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
		href = resolve('/~/accounts/positions/position/[chainId]/[positionId]', {
			chainId: String(entityId.$network.chainId),
			positionId: entityId.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LiquidityPosition>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const liquidityPosition = useEntity(
		EntityType.LiquidityPosition,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.LiquidityPosition]?.map((r) => r.source)
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
	entityType={EntityType.LiquidityPosition}
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
			resource={liquidityPosition}
			placeholderText="Loading position…"
		>
			{#snippet children(loadedLiquidityPosition)}
				{loadedLiquidityPosition.tokenId != null ?
					`NFT #${String(loadedLiquidityPosition.tokenId)}`
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
			Concentrated-liquidity LP position on a Uniswap v3-style pool: owner, tick range, in-range liquidity, uncollected fees, and optional ERC-721 token id.
		</p>
		<p>
			Requires an on-chain resolver; Dexscreener pool rows do not supply position-scoped state.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={liquidityPosition}
			placeholderText="Loading position…"
		>
			{#snippet children(loadedLiquidityPosition)}
				<dl data-column-item="center">
					{#if open}
						<div>
							<dt>Note</dt>
							<dd data-text="muted">
								A concentrated-liquidity LP position on a Uniswap v3-style pool: owner, NFT-bound tick range on the shared curve, position-scoped liquidity, uncollected fees, and (when present) the ERC-721 position token id from the periphery manager. No position indexer is wired in this app yet.
							</dd>
						</div>
					{/if}
					<div>
						<dt>Network</dt>
						<dd>
							<NetworkView
								entityId={loadedLiquidityPosition.$pool.$network}
								layout={EntityLayout.Title}
								open={false}
							/>
						</dd>
					</div>
					<div>
						<dt>AMM pool (Uniswap v3-style)</dt>
						<dd>
							<LiquidityPoolView
								entityId={loadedLiquidityPosition.$pool[EntityMetaKey.Id]}
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
										$network: loadedLiquidityPosition.$pool.$network,
										$actor: loadedLiquidityPosition.$owner[EntityMetaKey.Id],
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
						{#if loadedLiquidityPosition.tickLower !== undefined}
							<div>
								<dt>LP NFT range · tick lower</dt>
								<dd>{String(loadedLiquidityPosition.tickLower)}</dd>
							</div>
						{/if}

						{#if loadedLiquidityPosition.tickUpper !== undefined}
							<div>
								<dt>LP NFT range · tick upper</dt>
								<dd>{String(loadedLiquidityPosition.tickUpper)}</dd>
							</div>
						{/if}

						{#if loadedLiquidityPosition.liquidity !== undefined}
							<div>
								<dt>Position liquidity (NFT range)</dt>
								<dd>{String(loadedLiquidityPosition.liquidity)}</dd>
							</div>
						{/if}

						{#if loadedLiquidityPosition.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(loadedLiquidityPosition.token0Owed)}</dd>
							</div>
						{/if}

						{#if loadedLiquidityPosition.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(loadedLiquidityPosition.token1Owed)}</dd>
							</div>
						{/if}

						{#if loadedLiquidityPosition.tokenId !== undefined}
							<div>
								<dt>Position NFT token id</dt>
								<dd>{String(loadedLiquidityPosition.tokenId)}</dd>
							</div>
						{/if}

						{#if loadedLiquidityPosition.origin}
							<div>
								<dt>Origin</dt>
								<dd>{loadedLiquidityPosition.origin}</dd>
							</div>
						{/if}
					{/if}

					{#if loadedLiquidityPosition.createdAtTimestamp !== undefined}
						<div>
							<dt>Created at</dt>
							<dd>
								<Timestamp
									timestamp={loadedLiquidityPosition.createdAtTimestamp}
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
