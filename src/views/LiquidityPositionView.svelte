<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/~/(accounts)/accounts/(positions)/position/[chainId=eip155ChainId]/[positionId]', {
			chainId: String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`)),
			positionId: selection.entitySelector.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPosition>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { select } from '$/routes/+layout.svelte'

	


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
	entitySelector={selection.entitySelector}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.id}
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
			resource={selection( { fields: { $pool: true, $owner: true, createdAtTimestamp: true, liquidity: true, origin: true, tickLower: true, tickUpper: true, token0Owed: true, token1Owed: true, tokenId: true } })}
			placeholderText="Loading position…"
		>
			{#snippet children(liquidityPosition)}
				<dl data-column-item="center">
						<div>
							<dt>Network</dt>
							<dd>
								{#if liquidityPosition.$pool !== undefined}
									<EvmNetworkView
										selection={select(EntityType.EvmNetwork, liquidityPosition.$pool[EntityMetaKey.Selector].$network)}
										layout={EntityLayout.Value}

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
										selection={select(EntityType.LiquidityPool, liquidityPosition.$pool[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}
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
										selection={select(EntityType.EvmNetworkAccount, {
											$network: liquidityPosition.$pool[EntityMetaKey.Selector].$network,
											$actor: liquidityPosition.$owner[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Value}

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

</EntityView>
