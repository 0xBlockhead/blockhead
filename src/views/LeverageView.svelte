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
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Leverage}
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
		<ResourceBoundary resource={leverage}>
			{#snippet children(merged)}
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
						<dd>{String(merged.$pool.$network.chainId)}</dd>
					</div>
					<div>
						<dt>AMM pool (Uniswap v3-style)</dt>
						<dd>
							<TruncatedValue
								value={merged.$pool.id}
								format={TruncatedValueFormat.Visual}
							/>
						</dd>
					</div>
					{#if open}
						<div>
							<dt>Owner</dt>
							<dd>
								<ActorNetworkView
									entityId={{
										$network: merged.$pool.$network,
										$actor: merged.$owner[EntityMetaKey.Id],
									}}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: merged.$owner[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Id}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
						{#if merged.tickLower !== undefined}
							<div>
								<dt>LP NFT range · tick lower</dt>
								<dd>{String(merged.tickLower)}</dd>
							</div>
						{/if}

						{#if merged.tickUpper !== undefined}
							<div>
								<dt>LP NFT range · tick upper</dt>
								<dd>{String(merged.tickUpper)}</dd>
							</div>
						{/if}

						{#if merged.liquidity !== undefined}
							<div>
								<dt>Range liquidity</dt>
								<dd>{String(merged.liquidity)}</dd>
							</div>
						{/if}

						{#if merged.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(merged.token0Owed)}</dd>
							</div>
						{/if}

						{#if merged.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(merged.token1Owed)}</dd>
							</div>
						{/if}

						{#if merged.tokenId !== undefined}
							<div>
								<dt>Position NFT (token id)</dt>
								<dd>{String(merged.tokenId)}</dd>
							</div>
						{/if}

						{#if merged.origin}
							<div>
								<dt>Origin</dt>
								<dd>{merged.origin}</dd>
							</div>
						{/if}
					{/if}

					{#if merged.createdAtTimestamp !== undefined}
						<div>
							<dt>Created at</dt>
							<dd>
								<Timestamp
									timestamp={merged.createdAtTimestamp}
									format={TimestampFormat.Both}
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
