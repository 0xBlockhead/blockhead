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
			| 'Summary'
		>
	> = $props()


	const vaultIdKey = $derived(
		stringify(entityId),
	)

	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
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
			const bag = vaultRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
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

	const displayTitle = $derived(
		vaultField?.token0Symbol != null && vaultField?.token1Symbol != null ?
			`${vaultField.token0Symbol} / ${vaultField.token1Symbol}`
		:	entityId.id,
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
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Vault id</dt>
				<dd>
					<TruncatedValue
						value={entityId.id}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
			{#if chainId != null}
				<div>
					<dt>Chain ID</dt>
					<dd>{String(chainId)}</dd>
				</div>
			{/if}
		</dl>
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
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No vault row in collections yet (no resolver for this vault).
						</p>
					{:else}
						<dl>
							{#if vaultField?.fee != null}
								<div>
									<dt>Fee</dt>
									<dd>{String(vaultField.fee)}</dd>
								</div>
							{/if}
							{#if vaultField?.tickSpacing != null}
								<div>
									<dt>Tick spacing</dt>
									<dd>{String(vaultField.tickSpacing)}</dd>
								</div>
							{/if}
							{#if vaultField?.v4PoolId != null}
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
							{#if vaultField?.sqrtPriceX96 != null}
								<div>
									<dt>Sqrt price X96</dt>
									<dd>{String(vaultField.sqrtPriceX96)}</dd>
								</div>
							{/if}
							{#if vaultField?.liquidity != null}
								<div>
									<dt>Liquidity</dt>
									<dd>{String(vaultField.liquidity)}</dd>
								</div>
							{/if}
							{#if vaultField?.tick != null}
								<div>
									<dt>Tick</dt>
									<dd>{String(vaultField.tick)}</dd>
								</div>
							{/if}
							{#if vaultField?.token0Symbol != null}
								<div>
									<dt>Token 0 symbol</dt>
									<dd>{vaultField.token0Symbol}</dd>
								</div>
							{/if}
							{#if vaultField?.token1Symbol != null}
								<div>
									<dt>Token 1 symbol</dt>
									<dd>{vaultField.token1Symbol}</dd>
								</div>
							{/if}
							{#if vaultField?.token0Decimals != null}
								<div>
									<dt>Token 0 decimals</dt>
									<dd>{String(vaultField.token0Decimals)}</dd>
								</div>
							{/if}
							{#if vaultField?.token1Decimals != null}
								<div>
									<dt>Token 1 decimals</dt>
									<dd>{String(vaultField.token1Decimals)}</dd>
								</div>
							{/if}
							{#if vaultField?.volumeUSD != null}
								<div>
									<dt>Volume USD</dt>
									<dd>{String(vaultField.volumeUSD)}</dd>
								</div>
							{/if}
							{#if vaultField?.totalValueLockedUSD != null}
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
