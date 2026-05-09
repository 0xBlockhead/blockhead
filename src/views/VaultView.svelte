<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
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
			entityId: EntityId<typeof schema, EntityType.Vault>
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

	const vaultIdKey = $derived(
		stringify(entityId),
	)

	const vaultQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Vault] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						vaultIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => vaultIdKey],
	)

	const vaultRow = $derived(
		vaultQuery.data?.[0]?.row,
	)

	const vaultField = $derived(
		(() => {
			const bagUnknown = vaultRow?.[EntityMetaKey.Fields]
			if (!(typeof bagUnknown === 'object' && bagUnknown !== null && !Array.isArray(bagUnknown))) return null
			const b: Record<string, JsonValue> = bagUnknown
			const num = (key: string) => {
				const v = b[key]
				return typeof v === 'number' && Number.isFinite(v) ? v : undefined
			}
			const str = (key: string) => {
				const v = b[key]
				return typeof v === 'string' && v.length ? v : undefined
			}
			const big = (key: string) => {
				const v = b[key]
				return typeof v === 'bigint' ? v : undefined
			}
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
		vaultField?.token0Symbol !== undefined && vaultField?.token1Symbol !== undefined,
	)

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Vault}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={vaultField?.token0Symbol !== undefined && vaultField?.token1Symbol !== undefined ? `${vaultField.token0Symbol} / ${vaultField.token1Symbol}` : entityId.id}
>
	{#snippet Content()}
		{#if titleIsTokenPair}
			<dl>
				<div>
					<dt>Vault id</dt>
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
				entityType={EntityType.Vault}
				{entityId}
			>
				<QueryBoundary
					query={vaultQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No vault data for this id yet.
						</p>
					{:else}
						<dl>
							{#if vaultField?.fee !== undefined}
								<div>
									<dt>Fee</dt>
									<dd>{String(vaultField.fee)}</dd>
								</div>
							{/if}
							{#if vaultField?.tickSpacing !== undefined}
								<div>
									<dt>Tick spacing</dt>
									<dd>{String(vaultField.tickSpacing)}</dd>
								</div>
							{/if}
							{#if vaultField?.v4PoolId !== undefined}
								<div>
									<dt>v4 pool id</dt>
									<dd>
										<TruncatedValue
											value={vaultField.v4PoolId}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
							{#if vaultField?.sqrtPriceX96 !== undefined}
								<div>
									<dt>Sqrt price X96</dt>
									<dd>{String(vaultField.sqrtPriceX96)}</dd>
								</div>
							{/if}
							{#if vaultField?.liquidity !== undefined}
								<div>
									<dt>Liquidity</dt>
									<dd>{String(vaultField.liquidity)}</dd>
								</div>
							{/if}
							{#if vaultField?.tick !== undefined}
								<div>
									<dt>Tick</dt>
									<dd>{String(vaultField.tick)}</dd>
								</div>
							{/if}
							{#if vaultField?.token0Symbol !== undefined}
								<div>
									<dt>Token 0 symbol</dt>
									<dd>{vaultField.token0Symbol}</dd>
								</div>
							{/if}
							{#if vaultField?.token1Symbol !== undefined}
								<div>
									<dt>Token 1 symbol</dt>
									<dd>{vaultField.token1Symbol}</dd>
								</div>
							{/if}
							{#if vaultField?.token0Decimals !== undefined}
								<div>
									<dt>Token 0 decimals</dt>
									<dd>{String(vaultField.token0Decimals)}</dd>
								</div>
							{/if}
							{#if vaultField?.token1Decimals !== undefined}
								<div>
									<dt>Token 1 decimals</dt>
									<dd>{String(vaultField.token1Decimals)}</dd>
								</div>
							{/if}
							{#if vaultField?.volumeUSD !== undefined}
								<div>
									<dt>Volume USD</dt>
									<dd>{String(vaultField.volumeUSD)}</dd>
								</div>
							{/if}
							{#if vaultField?.totalValueLockedUSD !== undefined}
								<div>
									<dt>TVL USD</dt>
									<dd>{String(vaultField.totalValueLockedUSD)}</dd>
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
