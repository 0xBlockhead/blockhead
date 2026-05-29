<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { evmChainIdFromNetworkId } from '$/lib/caip.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/~/accounts/positions/position/[chainId]/[positionId]', {
			chainId: String(evmChainIdFromNetworkId(entityId.$network)),
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
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
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
		<p>
			No position indexer is wired in this app yet.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={liquidityPosition}
			placeholderText="Loading position…"
		>
			{#snippet children(liquidityPosition)}
				<dl data-column-item="center">
						<div>
							<dt>Network</dt>
							<dd>
								{#if liquidityPosition.$pool !== undefined}
									<EvmNetworkView
										entityId={liquidityPosition.$pool[EntityMetaKey.Id].$network}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<span data-text="muted">No pool network loaded</span>
								{/if}
							</dd>
						</div>
						<div>
							<dt>Pool</dt>
							<dd>
								{#if liquidityPosition.$pool !== undefined}
									<LiquidityPoolView
										entityId={liquidityPosition.$pool[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryDetails}
										open={true}
										showTypeAnnotation={false}
									/>
								{:else}
									<span data-text="muted">No pool loaded</span>
								{/if}
							</dd>
						</div>
						{#if open && liquidityPosition.$pool !== undefined && liquidityPosition.$owner !== undefined}
							<div>
								<dt>Owner</dt>
								<dd>
									<EvmNetworkAccountView
										entityId={{
											$network: liquidityPosition.$pool[EntityMetaKey.Id].$network,
											$actor: liquidityPosition.$owner[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.tickLower !== undefined}
							<div>
								<dt>Tick lower</dt>
								<dd>{String(liquidityPosition.tickLower)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.tickUpper !== undefined}
							<div>
								<dt>Tick upper</dt>
								<dd>{String(liquidityPosition.tickUpper)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.liquidity !== undefined}
							<div>
								<dt>Liquidity</dt>
								<dd>{String(liquidityPosition.liquidity)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(liquidityPosition.token0Owed)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(liquidityPosition.token1Owed)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.tokenId !== undefined}
							<div>
								<dt>Token id</dt>
								<dd>{String(liquidityPosition.tokenId)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.origin}
							<div>
								<dt>Origin</dt>
								<dd>{liquidityPosition.origin}</dd>
							</div>
						{/if}

					{#if liquidityPosition.createdAtTimestamp !== undefined}
						<div>
							<dt>Created at</dt>
							<dd>
								<Timestamp
									timestamp={liquidityPosition.createdAtTimestamp}
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
