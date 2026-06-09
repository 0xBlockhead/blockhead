<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { resolverDefinitionsByEntityType } from '$/resolvers/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/~/(accounts)/accounts/(positions)/position/[chainId]/[positionId]', {
			chainId: String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`)),
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

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'

	const liquidityPosition = useEntity(entityCollectionsContext, EntityType.LiquidityPosition,
		entityId,
		({ sources: (
				resolverDefinitionsByEntityType[EntityType.LiquidityPosition]?.map((r) => r.source)
				?? []
			), fields: { $pool: true, $owner: true, createdAtTimestamp: true, liquidity: true, origin: true, tickLower: true, tickUpper: true, token0Owed: true, token1Owed: true, tokenId: true } }),
	)


	// Components
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
			{#if Value}
			{@render Value()}
			{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Concentrated-liquidity LP position on a Uniswap v3-style pool: owner, tick range, in-range liquidity, uncollected fees, and optional ERC-721 token id.
		</p>
		<p>
			Requires an on-chain resolver; Dexscreener pool liquidityPositions do not supply position-scoped state.
		</p>
		<p>
			No position indexer is wired in this app yet.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={liquidityPosition}
			placeholderText="Loading position…"
		>
			{#snippet children(liquidityPosition)}
				<dl data-column-item="center">
						<div>
							<dt>Network</dt>
							<dd>
								{#if liquidityPosition.fields.$pool !== undefined}
									<EvmNetworkView
										entityId={liquidityPosition.fields.$pool[EntityMetaKey.Id].$network}
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
								{#if liquidityPosition.fields.$pool !== undefined}
									<LiquidityPoolView
										entityId={liquidityPosition.fields.$pool[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={true}
										showTypeAnnotation={false}
									/>
								{:else}
									<span data-text="muted">No pool loaded</span>
								{/if}
							</dd>
						</div>
						{#if open && liquidityPosition.fields.$pool !== undefined && liquidityPosition.fields.$owner !== undefined}
							<div>
								<dt>Owner</dt>
								<dd>
									<EvmNetworkAccountView
										entityId={{
											$network: liquidityPosition.fields.$pool[EntityMetaKey.Id].$network,
											$actor: liquidityPosition.fields.$owner[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.fields.tickLower !== undefined}
							<div>
								<dt>Tick lower</dt>
								<dd>{String(liquidityPosition.fields.tickLower)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.fields.tickUpper !== undefined}
							<div>
								<dt>Tick upper</dt>
								<dd>{String(liquidityPosition.fields.tickUpper)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.fields.liquidity !== undefined}
							<div>
								<dt>Liquidity</dt>
								<dd>{String(liquidityPosition.fields.liquidity)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.fields.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(liquidityPosition.fields.token0Owed)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.fields.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(liquidityPosition.fields.token1Owed)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.fields.tokenId !== undefined}
							<div>
								<dt>Token id</dt>
								<dd>{String(liquidityPosition.fields.tokenId)}</dd>
							</div>
						{/if}

						{#if open && liquidityPosition.fields.origin}
							<div>
								<dt>Origin</dt>
								<dd>{liquidityPosition.fields.origin}</dd>
							</div>
						{/if}

					{#if liquidityPosition.fields.createdAtTimestamp !== undefined}
						<div>
							<dt>Created at</dt>
							<dd>
								<Timestamp
									timestamp={liquidityPosition.fields.createdAtTimestamp}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

</EntityView>
