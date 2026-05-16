<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'

	import { resolve } from '$app/paths'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'


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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPosition}
	{entityId}
	{href}
	title={entityId.id}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={liquidityPosition}>
			{#snippet children(p)}
				<dl>
					<div>
						<dt>Network</dt>
						<dd>{String(p.$pool.$network.chainId)}</dd>
					</div>
					<div>
						<dt>Pool</dt>
						<dd>
							<TruncatedValue
								value={p.$pool.id}
								format={TruncatedValueFormat.Visual}
							/>
						</dd>
					</div>
					{#if p.createdAtTimestamp !== undefined}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp
									timestamp={p.createdAtTimestamp}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Owner</dt>
							<dd>
								<ActorNetworkView
									entityId={{
										$network: p.$pool.$network,
										$actor: p.$owner[EntityMetaKey.Id],
									}}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: p.$owner[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Id}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
						{#if p.tickLower !== undefined}
							<div>
								<dt>Tick lower</dt>
								<dd>{String(p.tickLower)}</dd>
							</div>
						{/if}
						{#if p.tickUpper !== undefined}
							<div>
								<dt>Tick upper</dt>
								<dd>{String(p.tickUpper)}</dd>
							</div>
						{/if}
						{#if p.liquidity !== undefined}
							<div>
								<dt>Liquidity</dt>
								<dd>{String(p.liquidity)}</dd>
							</div>
						{/if}
						{#if p.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(p.token0Owed)}</dd>
							</div>
						{/if}
						{#if p.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(p.token1Owed)}</dd>
							</div>
						{/if}
						{#if p.tokenId !== undefined}
							<div>
								<dt>Token id</dt>
								<dd>{String(p.tokenId)}</dd>
							</div>
						{/if}
						{#if p.origin}
							<div>
								<dt>Origin</dt>
								<dd>{p.origin}</dd>
							</div>
						{/if}
						{#if p.createdAtTimestamp !== undefined}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={p.createdAtTimestamp}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
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
