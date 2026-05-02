<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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

	const liquidityPositionIdKey = $derived(
		stringify(entityId),
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
			if (bag === undefined || typeof bag !== 'object') return null
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

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPosition}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={entityId.id}
>
	{#snippet Content()}
		{#if liquidityPositionField?.createdAtTimestamp !== undefined && typeof liquidityPositionField.createdAtTimestamp === 'number' && Number.isFinite(liquidityPositionField.createdAtTimestamp)}
			<dl data-definition-list="vertical">
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={liquidityPositionField.createdAtTimestamp}
							format={TimestampFormat.Both}
						/>
					</dd>
				</div>
			</dl>
		{/if}
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
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No liquidity position data for this id yet.
						</p>
					{:else}
						<dl>
							{#if liquidityPositionField?.tickLower !== undefined}
								<div>
									<dt>Tick lower</dt>
									<dd>{String(liquidityPositionField.tickLower)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.tickUpper !== undefined}
								<div>
									<dt>Tick upper</dt>
									<dd>{String(liquidityPositionField.tickUpper)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.liquidity !== undefined}
								<div>
									<dt>Liquidity</dt>
									<dd>{String(liquidityPositionField.liquidity)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.token0Owed !== undefined}
								<div>
									<dt>Token0 owed</dt>
									<dd>{String(liquidityPositionField.token0Owed)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.token1Owed !== undefined}
								<div>
									<dt>Token1 owed</dt>
									<dd>{String(liquidityPositionField.token1Owed)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.tokenId !== undefined}
								<div>
									<dt>Token id</dt>
									<dd>{String(liquidityPositionField.tokenId)}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.origin !== undefined}
								<div>
									<dt>Origin</dt>
									<dd>{liquidityPositionField.origin}</dd>
								</div>
							{/if}
							{#if liquidityPositionField?.createdAtTimestamp !== undefined && typeof liquidityPositionField.createdAtTimestamp === 'number' && Number.isFinite(liquidityPositionField.createdAtTimestamp)}
								<div>
									<dt>Created at (timestamp)</dt>
									<dd>
										<Timestamp
											timestamp={liquidityPositionField.createdAtTimestamp}
											format={TimestampFormat.Both}
										/>
									</dd>
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
