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
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
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
			{#snippet children(leverage)}
				{leverage.tokenId != null ?
					`NFT #${String(leverage.tokenId)}`
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
		<p>
			No position indexer is wired in this app yet.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={leverage}
			placeholderText="Loading leverage row…"
		>
			{#snippet children(leverage)}
				<dl data-column-item="center">
						<div>
							<dt>Network</dt>
							<dd>
								{#if leverage.$pool !== undefined}
									<EvmNetworkView
										entityId={leverage.$pool[EntityMetaKey.Id].$network}
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
								{#if leverage.$pool !== undefined}
									<LiquidityPoolView
										entityId={leverage.$pool[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryDetails}
										open={true}
										showTypeAnnotation={false}
									/>
								{:else}
									<span data-text="muted">No pool loaded</span>
								{/if}
							</dd>
						</div>
						{#if open && leverage.$pool !== undefined && leverage.$owner !== undefined}
							<div>
								<dt>Owner</dt>
								<dd>
									<ActorNetworkView
										entityId={{
											$network: leverage.$pool[EntityMetaKey.Id].$network,
											$actor: leverage.$owner[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && leverage.tickLower !== undefined}
							<div>
								<dt>Tick lower</dt>
								<dd>{String(leverage.tickLower)}</dd>
							</div>
						{/if}

						{#if open && leverage.tickUpper !== undefined}
							<div>
								<dt>Tick upper</dt>
								<dd>{String(leverage.tickUpper)}</dd>
							</div>
						{/if}

						{#if open && leverage.liquidity !== undefined}
							<div>
								<dt>Liquidity</dt>
								<dd>{String(leverage.liquidity)}</dd>
							</div>
						{/if}

						{#if open && leverage.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(leverage.token0Owed)}</dd>
							</div>
						{/if}

						{#if open && leverage.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(leverage.token1Owed)}</dd>
							</div>
						{/if}

						{#if open && leverage.tokenId !== undefined}
							<div>
								<dt>Token id</dt>
								<dd>{String(leverage.tokenId)}</dd>
							</div>
						{/if}

						{#if open && leverage.origin}
							<div>
								<dt>Origin</dt>
								<dd>{leverage.origin}</dd>
							</div>
						{/if}

					{#if leverage.createdAtTimestamp !== undefined}
						<div>
							<dt>Created at</dt>
							<dd>
								<Timestamp
									timestamp={leverage.createdAtTimestamp}
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
