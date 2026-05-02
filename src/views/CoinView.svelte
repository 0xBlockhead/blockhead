<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind, MarketVenue } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import CoinSchema from '$/schema/Coin.ts'
	import { Source } from '$/sources/$Source.ts'

	import { isMarketEntityId } from '$/lib/isMarketEntityId.ts'
	import { mergeEntityCollectionRowFields } from '$/collections/mergeEntityCollectionRowFields.ts'


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
			entityId: typeof CoinSchema.id.infer
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			'entityType' | 'entityId' | 'href' | 'open' | 'title' | 'Details' | 'Content'
		>
	> = $props()


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'


	const coinEntityMergeSourceOrder = [
		Source.Coingecko_Rest,
		Source.CoinMarketCap_Rest,
		Source.Coinpaprika_OpenApi,
		Source.Defillama_Rest,
		Source.Constants_Internal,
	] as const


	// (Derived)
	const coinIdKey = $derived(
		stringify(entityId),
	)

	const coinQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Coin] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						coinIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => coinIdKey],
	)

	const coinFields = $derived(
		mergeEntityCollectionRowFields(
			EntityType.Coin,
			coinQuery.data,
			coinEntityMergeSourceOrder,
		),
	)

	const displayTitle = $derived(
		coinFields.symbol ?? coinFields.name ?? entityId.coinId,
	)

	const coinHref = $derived(
		resolve('/(assets)/(coins)/coin/[coinId]', {
			coinId: entityId.coinId,
		}),
	)

	const coinInstancesFieldQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					link: entityFieldCollections[EntityType.Coin]['$$coinInstances'],
				})
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.ParentIdKey],
						coinIdKey,
					)
				))
				.select(({ link }) => ({
					instance: link[EntityMetaKey.Value],
				}))
		),
		[() => coinIdKey],
	)

	const uniqueCoinInstanceRows = $derived(
		(() => {
			const data = coinInstancesFieldQuery.data
			if (data === undefined) {
				return []
			}
			const byKey = new Map<string, (typeof data)[number]>()
			for (const row of data) {
				const k = stringify(row.instance)
				if (!byKey.has(k)) {
					byKey.set(k, row)
				}
			}
			return [...byKey.values()]
		})(),
	)

	const marketsAsBaseQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					link: entityFieldCollections[EntityType.Coin]['$$marketsWithCoinAsBase'],
				})
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.ParentIdKey],
						coinIdKey,
					)
				))
				.select(({ link }) => ({
					market: link[EntityMetaKey.Value],
				}))
		),
		[() => coinIdKey],
	)

	const marketsAsQuoteQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					link: entityFieldCollections[EntityType.Coin]['$$marketsWithCoinAsQuote'],
				})
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.ParentIdKey],
						coinIdKey,
					)
				))
				.select(({ link }) => ({
					market: link[EntityMetaKey.Value],
				}))
		),
		[() => coinIdKey],
	)

	const uniqueMarketFieldRows = (data) => {
		if (data === undefined) {
			return []
		}
		const byKey = new Map<string, (typeof data)[number]>()
		for (const row of data) {
			if (!isMarketEntityId(row.market)) {
				continue
			}
			const k = stringify(row.market)
			if (!byKey.has(k)) {
				byKey.set(k, row)
			}
		}
		return [...byKey.values()]
	}

	const uniqueMarketsAsBase = $derived(
		uniqueMarketFieldRows(marketsAsBaseQuery.data),
	)

	const uniqueMarketsAsQuote = $derived(
		uniqueMarketFieldRows(marketsAsQuoteQuery.data),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


{#snippet marketLeg(
	_query,
	uniqueRows,
	emptyMsg,
	heading,
	fieldCode,
	edge,
)}
	<section>
		<h2>
			{heading}
		</h2>
		<p data-text="muted">
			<code>{fieldCode}</code>
			—
			<code>Market</code>
			rows where
			<code>
				{edge === 'base' ? '$base' : '$quote'}
			</code>
			points at this catalog coin.
		</p>
		<QueryBoundary
			query={_query}
		>
			{#snippet children(_rows)}
				{#if uniqueRows.length === 0}
					<p data-text="muted">
						{emptyMsg}
					</p>
				{:else}
					<ul>
						{#each uniqueRows as marketRow (stringify(marketRow.market))}
							<li>
								<MarketView
									entityId={marketRow.market}
									href={(
										resolve(
											'/(assets)/coins/market/[marketKey]',
											{
												marketKey: (
													encodeURIComponent(
														stringify(
															marketRow.market,
														),
													)
												),
											},
										)
									)}
									id={stringify(marketRow.market)}
									layout={EntityLayout.Summary}
									open={false}
								/>
							</li>
						{/each}
					</ul>
				{/if}
			{/snippet}
		</QueryBoundary>
	</section>
{/snippet}


<EntityView
	entityType={EntityType.Coin}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Coin id</dt>
				<dd>{entityId.coinId}</dd>
			</div>
			{#if coinFields.symbol != null && coinFields.symbol !== displayTitle}
				<div>
					<dt>Symbol</dt>
					<dd>{coinFields.symbol}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Coin}
			{entityId}
		>
			<QueryBoundary
				query={coinQuery}
			>
				{#snippet children(_rows)}
					{#if _rows.length === 0}
						<p data-text="muted">
							No coin metadata for this id yet.
						</p>
					{:else}
						<dl>
							{#if coinFields.name != null}
								<div>
									<dt>Name</dt>
									<dd>{coinFields.name}</dd>
								</div>
							{/if}
							{#if coinFields.decimals != null}
								<div>
									<dt>Decimals</dt>
									<dd>{String(coinFields.decimals)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<section>
			<h2>
				Spot (USD index)
			</h2>
			<p data-text="muted">
				<code>MarketPrice</code>
				for
				<code>SpotIndex</code>
				· USD — see
				<a href={resolve('/coins/prices')}>
					all spot quotes
				</a>
				.
			</p>
			<MarketPriceView
				entityId={(
					{
						$market: {
							$base: {
								kind: MarketAssetKind.Coin,
								$coin: { coinId: entityId.coinId },
							},
							$quote: {
								kind: MarketAssetKind.Currency,
								iso4217: 'USD',
							},
							venue: MarketVenue.SpotIndex,
						} as const,
					}
				)}
				href={coinHref}
				id={`${coinIdKey}:price`}
				layout={EntityLayout.Summary}
				open={false}
			/>
		</section>

		{@render marketLeg(
			marketsAsBaseQuery,
			uniqueMarketsAsBase,
			'No base-leg markets yet.',
			'Markets (this coin on the base leg)',
			'$$marketsWithCoinAsBase',
			'base',
		)}

		{@render marketLeg(
			marketsAsQuoteQuery,
			uniqueMarketsAsQuote,
			'No quote-leg markets yet.',
			'Markets (this coin on the quote leg)',
			'$$marketsWithCoinAsQuote',
			'quote',
		)}

		<section>
			<h2>
				Deployments
			</h2>
			<QueryBoundary
				query={coinInstancesFieldQuery}
			>
				{#snippet children(_rows)}
					{#if uniqueCoinInstanceRows.length === 0}
						<p data-text="muted">
							No on-chain instances linked yet.
						</p>
					{:else}
						<ul>
							{#each uniqueCoinInstanceRows as instanceRow (stringify(instanceRow.instance))}
								<li>
									<CoinInstanceView
										entityId={instanceRow.instance}
										href={coinHref}
										id={`${coinIdKey}:instance:${stringify(instanceRow.instance)}`}
										layout={EntityLayout.Summary}
										open={false}
									/>
								</li>
							{/each}
						</ul>
					{/if}
				{/snippet}
			</QueryBoundary>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
