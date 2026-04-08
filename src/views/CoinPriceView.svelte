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
			entityId: EntityId<typeof schema, EntityType.CoinPrice>
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


	const coinPriceIdKey = $derived(
		stringify(entityId),
	)

	const coinPriceQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.CoinPrice] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						coinPriceIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => coinPriceIdKey],
	)

	const coinPriceRow = $derived(
		coinPriceQuery.data?.[0]?.row,
	)

	const coinPriceField = $derived(
		(() => {
			const bag = coinPriceRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				price: typeof b.price === 'bigint' ? b.price : undefined,
				timestampNs: typeof b.timestampNs === 'bigint' ? b.timestampNs : undefined,
				updatedAt: typeof b.updatedAt === 'number' ? b.updatedAt : undefined,
				transport: typeof b.transport === 'string' ? b.transport : undefined,
				encodedAssetId: typeof b.encodedAssetId === 'string' ? b.encodedAssetId : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		coinPriceField?.price != null ?
			`${entityId.$coin.coinId} $${(Number(coinPriceField.price) / 1e8).toFixed(4)}`
		:	entityId.$coin.coinId,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinPrice}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Coin id</dt>
				<dd>{entityId.$coin.coinId}</dd>
			</div>
			{#if coinPriceField?.price != null}
				<div>
					<dt>Price (1e8)</dt>
					<dd>{String(coinPriceField.price)}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.CoinPrice}
			{entityId}
		>
			<QueryBoundary
				query={coinPriceQuery}
			>

				{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No coin price row in collections yet (no resolver for this coin + feed).
						</p>
					{:else}
						<dl>
							{#if coinPriceField?.price != null}
								<div>
									<dt>Price (1e8)</dt>
									<dd>{String(coinPriceField.price)}</dd>
								</div>
							{/if}
							{#if coinPriceField?.timestampNs != null}
								<div>
									<dt>Timestamp ns</dt>
									<dd>{String(coinPriceField.timestampNs)}</dd>
								</div>
							{/if}
							{#if coinPriceField?.updatedAt != null}
								<div>
									<dt>Updated at</dt>
									<dd>{new Date(coinPriceField.updatedAt).toISOString()}</dd>
								</div>
							{/if}
							{#if coinPriceField?.transport != null}
								<div>
									<dt>Transport</dt>
									<dd>{coinPriceField.transport}</dd>
								</div>
							{/if}
							{#if coinPriceField?.encodedAssetId != null}
								<div>
									<dt>Encoded asset id</dt>
									<dd>{coinPriceField.encodedAssetId}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
