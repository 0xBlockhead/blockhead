<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
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
			entityId: EntityId<typeof schema, EntityType.LiquidityPosition>
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
				?? [Source.Constants_Internal]
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
	{href}
	title={entityId.id}
	{open}
	{...entityViewRest}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}

		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={liquidityPosition}>
			{#snippet children(liquidityPosition)}
				<dl data-column-item="center">
					{#if open}
						<div>
							<dt>Note</dt>
							<dd data-text="muted">
								A concentrated-liquidity LP position on a Uniswap v3-style pool: owner, NFT-bound tick range on the shared curve, position-scoped liquidity, uncollected fees, and (when present) the ERC-721 position token id from the periphery manager.
							</dd>
						</div>
					{/if}
					<div>
						<dt>Network</dt>
						<dd>
							<NetworkView
								entityId={liquidityPosition.$pool.$network}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]',
									{ networkId: String(liquidityPosition.$pool.$network.chainId) },
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					<div>
						<dt>AMM pool (Uniswap v3-style)</dt>
						<dd>
							<LiquidityPoolView
								entityId={liquidityPosition.$pool[EntityMetaKey.Id]}
								href={resolve('/(assets)/(pools)/pool/[poolId]', {
									poolId: liquidityPosition.$pool[EntityMetaKey.Id].id,
								})}
								layout={EntityLayout.Title}
								open={false}
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
										$network: liquidityPosition.$pool.$network,
										$actor: liquidityPosition.$owner[EntityMetaKey.Id],
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
										{
											networkId: String(liquidityPosition.$pool.$network.chainId),
											address: liquidityPosition.$owner[EntityMetaKey.Id].address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
						{#if liquidityPosition.tickLower !== undefined}
							<div>
								<dt>LP NFT range · tick lower</dt>
								<dd>{String(liquidityPosition.tickLower)}</dd>
							</div>
						{/if}

						{#if liquidityPosition.tickUpper !== undefined}
							<div>
								<dt>LP NFT range · tick upper</dt>
								<dd>{String(liquidityPosition.tickUpper)}</dd>
							</div>
						{/if}

						{#if liquidityPosition.liquidity !== undefined}
							<div>
								<dt>Position liquidity (NFT range)</dt>
								<dd>{String(liquidityPosition.liquidity)}</dd>
							</div>
						{/if}

						{#if liquidityPosition.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(liquidityPosition.token0Owed)}</dd>
							</div>
						{/if}

						{#if liquidityPosition.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(liquidityPosition.token1Owed)}</dd>
							</div>
						{/if}

						{#if liquidityPosition.origin}
							<div>
								<dt>Origin</dt>
								<dd>{liquidityPosition.origin}</dd>
							</div>
						{/if}
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
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.LiquidityPosition}
				{entityId}
			/>
		{/if}
	{/snippet}
</EntityView>
