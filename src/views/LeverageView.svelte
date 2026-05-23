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
			entityId: EntityId<typeof schema, EntityType.Leverage>
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

	const leverage = useEntity(
		EntityType.Leverage,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.Leverage]?.map((r) => r.source)
				?? [Source.Local_Internal]
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
		<ResourceBoundary resource={leverage}>
			{#snippet children(leverage)}
				<dl data-column-item="center">
					{#if open}
						<div>
							<dt>Note</dt>
							<dd data-text="muted">
								Here “leverage” names concentrated-liquidity position accounting—tick range, in-range liquidity, uncollected fees, ERC-721 token id—not perpetual margin, borrow APR, or liquidation state from a CEX.
							</dd>
						</div>
					{/if}
					<div>
						<dt>Network</dt>
						<dd>
							<NetworkView
								entityId={leverage.$pool.$network}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]',
									{ networkId: String(leverage.$pool.$network.chainId) },
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
								entityId={leverage.$pool[EntityMetaKey.Id]}
								href={resolve('/(assets)/(pools)/pool/[poolId]', {
									poolId: leverage.$pool[EntityMetaKey.Id].id,
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
										$network: leverage.$pool.$network,
										$actor: leverage.$owner[EntityMetaKey.Id],
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
										{
											networkId: String(leverage.$pool.$network.chainId),
											address: leverage.$owner[EntityMetaKey.Id].address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
						{#if leverage.tickLower !== undefined}
							<div>
								<dt>LP NFT range · tick lower</dt>
								<dd>{String(leverage.tickLower)}</dd>
							</div>
						{/if}

						{#if leverage.tickUpper !== undefined}
							<div>
								<dt>LP NFT range · tick upper</dt>
								<dd>{String(leverage.tickUpper)}</dd>
							</div>
						{/if}

						{#if leverage.liquidity !== undefined}
							<div>
								<dt>Range liquidity</dt>
								<dd>{String(leverage.liquidity)}</dd>
							</div>
						{/if}

						{#if leverage.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(leverage.token0Owed)}</dd>
							</div>
						{/if}

						{#if leverage.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(leverage.token1Owed)}</dd>
							</div>
						{/if}

						{#if leverage.origin}
							<div>
								<dt>Origin</dt>
								<dd>{leverage.origin}</dd>
							</div>
						{/if}
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
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.Leverage}
				{entityId}
			/>
		{/if}
	{/snippet}
</EntityView>
