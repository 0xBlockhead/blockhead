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
			entityId: EntityId<typeof schema, EntityType.LiquidityPool>
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

	const poolIdKey = $derived(
		stringify(entityId),
	)

	const poolQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.LiquidityPool] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						poolIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => poolIdKey],
	)

	const poolRow = $derived(
		poolQuery.data?.[0]?.row,
	)

	const poolField = $derived(
		(() => {
			const bag = poolRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const num = (key: string) => (
				typeof b[key] === 'number' && Number.isFinite(b[key] as number) ?
					(b[key] as number)
				:	undefined
			)
			const str = (key: string) => (
				typeof b[key] === 'string' && (b[key] as string).length ?
					(b[key] as string)
				:	undefined
			)
			const big = (key: string) => (
				typeof b[key] === 'bigint' ?
					(b[key] as bigint)
				:	undefined
			)
			const usd = (key: string) => {
				const v = b[key]
				return (
					typeof v === 'string' || typeof v === 'number' ?
						v
					:	undefined
				)
			}
			return {
				fee: num('fee'),
				tickSpacing: num('tickSpacing'),
				v4PoolId: str('v4PoolId'),
				sqrtPriceX96: big('sqrtPriceX96'),
				liquidity: big('liquidity'),
				tick: num('tick'),
				token0Symbol: str('token0Symbol'),
				token1Symbol: str('token1Symbol'),
				token0Decimals: num('token0Decimals'),
				token1Decimals: num('token1Decimals'),
				volumeUSD: usd('volumeUSD'),
				totalValueLockedUSD: usd('totalValueLockedUSD'),
			}
		})(),
	)

	const titleIsTokenPair = $derived(
		poolField?.token0Symbol !== undefined && poolField?.token1Symbol !== undefined,
	)

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={poolField?.token0Symbol !== undefined && poolField?.token1Symbol !== undefined ? `${poolField.token0Symbol} / ${poolField.token1Symbol}` : entityId.id}
>
	{#snippet Content()}
		{#if titleIsTokenPair}
			<dl data-definition-list="vertical">
				<div>
					<dt>Pool id</dt>
					<dd>
						<TruncatedValue
							value={entityId.id}
							format={TruncatedValueFormat.Visual}
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
				entityType={EntityType.LiquidityPool}
				{entityId}
			>
				<QueryBoundary
					query={poolQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No pool data for this id yet.
						</p>
					{:else}
						<dl>
							{#if poolField?.fee !== undefined}
								<div>
									<dt>Fee</dt>
									<dd>{String(poolField.fee)}</dd>
								</div>
							{/if}
							{#if poolField?.tickSpacing !== undefined}
								<div>
									<dt>Tick spacing</dt>
									<dd>{String(poolField.tickSpacing)}</dd>
								</div>
							{/if}
							{#if poolField?.v4PoolId !== undefined}
								<div>
									<dt>v4 pool id</dt>
									<dd>
										<TruncatedValue
											value={poolField.v4PoolId}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
							{#if poolField?.sqrtPriceX96 !== undefined}
								<div>
									<dt>Sqrt price X96</dt>
									<dd>{String(poolField.sqrtPriceX96)}</dd>
								</div>
							{/if}
							{#if poolField?.liquidity !== undefined}
								<div>
									<dt>Liquidity</dt>
									<dd>{String(poolField.liquidity)}</dd>
								</div>
							{/if}
							{#if poolField?.tick !== undefined}
								<div>
									<dt>Tick</dt>
									<dd>{String(poolField.tick)}</dd>
								</div>
							{/if}
							{#if poolField?.token0Symbol !== undefined}
								<div>
									<dt>Token 0 symbol</dt>
									<dd>{poolField.token0Symbol}</dd>
								</div>
							{/if}
							{#if poolField?.token1Symbol !== undefined}
								<div>
									<dt>Token 1 symbol</dt>
									<dd>{poolField.token1Symbol}</dd>
								</div>
							{/if}
							{#if poolField?.token0Decimals !== undefined}
								<div>
									<dt>Token 0 decimals</dt>
									<dd>{String(poolField.token0Decimals)}</dd>
								</div>
							{/if}
							{#if poolField?.token1Decimals !== undefined}
								<div>
									<dt>Token 1 decimals</dt>
									<dd>{String(poolField.token1Decimals)}</dd>
								</div>
							{/if}
							{#if poolField?.volumeUSD !== undefined}
								<div>
									<dt>Volume USD</dt>
									<dd>{String(poolField.volumeUSD)}</dd>
								</div>
							{/if}
							{#if poolField?.totalValueLockedUSD !== undefined}
								<div>
									<dt>TVL USD</dt>
									<dd>{String(poolField.totalValueLockedUSD)}</dd>
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
