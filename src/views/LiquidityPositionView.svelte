<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			| 'Summary'
		>
	> = $props()


	const liquidityPositionIdKey = $derived(
		stringify(entityId),
	)

	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
	)

	const positionQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.LiquidityPosition] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						liquidityPositionIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => liquidityPositionIdKey],
	)

	const liquidityPositionRow = $derived(
		positionQuery.data?.[0]?.row,
	)

	const liquidityPositionField = $derived(
		(() => {
			const bag = liquidityPositionRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				tickLower: typeof b.tickLower === 'number' ? b.tickLower : undefined,
				tickUpper: typeof b.tickUpper === 'number' ? b.tickUpper : undefined,
				liquidity: typeof b.liquidity === 'bigint' ? b.liquidity : undefined,
				token0Owed: typeof b.token0Owed === 'bigint' ? b.token0Owed : undefined,
				token1Owed: typeof b.token1Owed === 'bigint' ? b.token1Owed : undefined,
				tokenId: typeof b.tokenId === 'bigint' ? b.tokenId : undefined,
				origin: typeof b.origin === 'string' && b.origin.length ? b.origin : undefined,
				createdAtTimestamp: typeof b.createdAtTimestamp === 'number' ? b.createdAtTimestamp : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		entityId.id,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPosition}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			{#if chainId != null}
				<div>
					<dt>Chain ID</dt>
					<dd>{String(chainId)}</dd>
				</div>
			{/if}
			<div>
				<dt>Position id</dt>
				<dd>{entityId.id}</dd>
			</div>
		</dl>
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
			>
				<QueryBoundary
					query={positionQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No liquidity position row in collections yet (no resolver row for this id).
						</p>
					{:else}
						<dl>
							{#if liquidityPositionField?.tickLower != null}
								<div>
									<dt>Tick lower</dt>
									<dd>{String(liquidityPositionField.tickLower)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.tickUpper != null}
								<div>
									<dt>Tick upper</dt>
									<dd>{String(liquidityPositionField.tickUpper)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.liquidity != null}
								<div>
									<dt>Liquidity</dt>
									<dd>{String(liquidityPositionField.liquidity)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.token0Owed != null}
								<div>
									<dt>Token0 owed</dt>
									<dd>{String(liquidityPositionField.token0Owed)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.token1Owed != null}
								<div>
									<dt>Token1 owed</dt>
									<dd>{String(liquidityPositionField.token1Owed)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.tokenId != null}
								<div>
									<dt>Token id</dt>
									<dd>{String(liquidityPositionField.tokenId)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.origin != null}
								<div>
									<dt>Origin</dt>
									<dd>{liquidityPositionField.origin}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.createdAtTimestamp != null}
								<div>
									<dt>Created at (timestamp)</dt>
									<dd>{String(liquidityPositionField.createdAtTimestamp)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
