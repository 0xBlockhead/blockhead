<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'


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
			entityId: EntityId<typeof schema, EntityType.Market>
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


	// Functions
	const isMarketValueLink = (
		row: unknown,
	): row is { m: unknown } => (
		typeof row === 'object'
			&& row !== undefined
			&& 'm' in row
	)

	// (Derived)
	const marketIdKey = $derived(
		stringify(entityId),
	)

	const baseLabel = $derived(
		(() => {
			const b = entityId.$base
			if (b.kind === MarketAssetKind.Coin) {
				return b.$coin.coinId
			}
			if (b.kind === MarketAssetKind.CoinInstance) {
				return `instance ${stringify(b.$coinInstance)}`
			}
			return b.iso4217
		})(),
	)

	const quoteLabel = $derived(
		(() => {
			const q = entityId.$quote
			if (q.kind === MarketAssetKind.Coin) {
				return q.$coin.coinId
			}
			if (q.kind === MarketAssetKind.CoinInstance) {
				return `instance ${stringify(q.$coinInstance)}`
			}
			return q.iso4217
		})(),
	)

	const displayTitle = $derived(
		`${baseLabel} / ${quoteLabel} · ${String(entityId.venue)}`,
	)

	const baseCoinId = $derived(
		entityId.$base.kind === MarketAssetKind.Coin ?
			entityId.$base.$coin.coinId
		:	undefined,
	)

	const baseCoinCatalogHref = $derived(
		baseCoinId === undefined ?
			undefined
		:	(
			resolve(
				'/(assets)/(coins)/coin/[coinId]',
				{ coinId: baseCoinId },
			)
		),
	)

	const marketQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Market] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						marketIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => marketIdKey],
	)

	const marketRow = $derived(
		(
			marketQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Coingecko_Rest,
			)?.row
			?? marketQuery.data?.[0]?.row
		),
	)

	const baseCoinFieldQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					link: entityFieldCollections[EntityType.Market]['$$baseCoin'],
				})
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.ParentIdKey],
						marketIdKey,
					)
				))
				.select(({ link }) => ({
					coin: link[EntityMetaKey.Value],
				}))
		),
		[() => marketIdKey],
	)

	const priceLinksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					link: entityFieldCollections[EntityType.Market]['$$marketPrices'],
				})
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.ParentIdKey],
						marketIdKey,
					)
				))
				.select(({ link }) => ({
					m: link[EntityMetaKey.Value],
				}))
		),
		[() => marketIdKey],
	)

	const rangeLinksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					link: entityFieldCollections[EntityType.Market]['$$marketPriceRanges'],
				})
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.ParentIdKey],
						marketIdKey,
					)
				))
				.select(({ link }) => ({
					m: link[EntityMetaKey.Value],
				}))
		),
		[() => marketIdKey],
	)

	const uniquePriceRows = $derived(
		(() => {
			const data = priceLinksQuery.data
			if (data === undefined) {
				return []
			}
			const by = new Map<string, { m: unknown }>()
			for (const row of data) {
				if (!isMarketValueLink(row) || row.m === undefined) {
					continue
				}
				const p = (
					typeof row.m === 'object'
					&& EntityMetaKey.Id in row.m
				) ?
					row.m[EntityMetaKey.Id]
				:
					row.m
				if (p === undefined) {
					continue
				}
				const k = stringify(p)
				if (by.has(k)) {
					continue
				}
				by.set(k, { m: row.m })
			}
			return [...by.values()]
		})(),
	)

	const uniqueRangeRows = $derived(
		(() => {
			const data = rangeLinksQuery.data
			if (data === undefined) {
				return []
			}
			const by = new Map<string, { m: unknown }>()
			for (const row of data) {
				if (!isMarketValueLink(row) || row.m === undefined) {
					continue
				}
				const p = (
					typeof row.m === 'object'
					&& EntityMetaKey.Id in row.m
				) ?
					row.m[EntityMetaKey.Id]
				:
					row.m
				if (p === undefined) {
					continue
				}
				const k = stringify(p)
				if (by.has(k)) {
					continue
				}
				by.set(k, { m: row.m })
			}
			return [...by.values()]
		})(),
	)

	const firstCatalogBaseCoin = $derived(
		(
			(() => {
				for (const row of baseCoinFieldQuery.data ?? []) {
					const c = row.coin
					if (c === undefined || typeof c !== 'object') {
						continue
					}
					const idv = (
						EntityMetaKey.Id in c ?
							c[EntityMetaKey.Id]
						:
							c
					)
					if (
						idv === undefined
						|| typeof idv !== 'object'
						|| !('coinId' in idv)
					) {
						continue
					}
					return idv
				}
				return null
			})()
		),
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import MarketPriceRangeView from '$/views/MarketPriceRangeView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Venue</dt>
				<dd>{String(entityId.venue)}</dd>
			</div>
			<div>
				<dt>Base leg</dt>
				<dd>
					<code>{String(entityId.$base.kind)}</code>
					·
					{baseLabel}
				</dd>
			</div>
			<div>
				<dt>Quote leg</dt>
				<dd>
					<code>{String(entityId.$quote.kind)}</code>
					·
					{quoteLabel}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Market}
			{entityId}
		>
			<QueryBoundary
				query={marketQuery}
			>
				{#snippet children(_rows)}
					{#if marketRow === undefined}
						<p data-text="muted">
							No local
							<code>Market</code>
							collection row (sources may be pending).
						</p>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<section>
			<h2>
				Asset legs
			</h2>
			<p data-text="muted">
				<code>$$base</code>
				/
				<code>$$quote</code>
				—
				MarketAsset
				vertices; catalog coins and instances are linked where resolvers have ids.
			</p>
			<ul>
				<li>
					<strong>Base</strong>
					:
					{#if entityId.$base.kind === MarketAssetKind.Coin}
						<CoinView
							entityId={entityId.$base.$coin}
							href={(
								resolve(
									'/(assets)/(coins)/coin/[coinId]',
									{ coinId: entityId.$base.$coin.coinId },
								)
							)}
							id={`${marketIdKey}:leg-base-coin`}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{:else if entityId.$base.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$base.$coinInstance}
							{href}
							id={`${marketIdKey}:leg-base-instance`}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{:else}
						{entityId.$base.iso4217}
					{/if}
				</li>
				<li>
					<strong>Quote</strong>
					:
					{#if entityId.$quote.kind === MarketAssetKind.Coin}
						<CoinView
							entityId={entityId.$quote.$coin}
							href={(
								resolve(
									'/(assets)/(coins)/coin/[coinId]',
									{ coinId: entityId.$quote.$coin.coinId },
								)
							)}
							id={`${marketIdKey}:leg-quote-coin`}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{:else if entityId.$quote.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$quote.$coinInstance}
							{href}
							id={`${marketIdKey}:leg-quote-instance`}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{:else}
						{entityId.$quote.iso4217}
					{/if}
				</li>
			</ul>
		</section>

		{#if entityId.$base.kind === MarketAssetKind.Coin}
			<section>
				<h2>
					Catalog base
				</h2>
				<p data-text="muted">
					<code>$$baseCoin</code>
					—
					join
					<code>Coin</code>
					for this
					<code>Market</code>
					’s catalog base; empty when the resolver has not produced the edge.
				</p>
				<QueryBoundary
					query={baseCoinFieldQuery}
				>
					{#snippet children(_rows)}
						{#if firstCatalogBaseCoin === undefined}
							<p data-text="muted">
								No catalog
								<code>Coin</code>
								edge.
							</p>
						{:else if 'coinId' in firstCatalogBaseCoin}
							<CoinView
								entityId={{
									coinId: firstCatalogBaseCoin.coinId,
								}}
								href={(
									resolve(
										'/(assets)/(coins)/coin/[coinId]',
										{ coinId: firstCatalogBaseCoin.coinId },
									)
								)}
								id={`${marketIdKey}:catalog-base`}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</QueryBoundary>
			</section>
		{/if}

		<section>
			<h2>
				Market prices
			</h2>
			<p data-text="muted">
				<code>$$marketPrices</code>
				—
				<code>$$parentMarket</code>
				on
				<code>MarketPrice</code>
				cuts back to this node; multiple feeds share one market id when keyed by
				<code>$market</code>
				only.
			</p>
			<QueryBoundary
				query={priceLinksQuery}
			>
				{#snippet children(_rows)}
					{#if uniquePriceRows.length === 0}
						<p data-text="muted">
							No price links yet.
						</p>
					{:else}
						<ul>
							{#each uniquePriceRows as row, i (stringify((typeof row.m === 'object' && EntityMetaKey.Id in row.m ? row.m[EntityMetaKey.Id] : row.m) ?? i))}
								{@const pe = (typeof row.m === 'object' && EntityMetaKey.Id in row.m ? row.m[EntityMetaKey.Id] : row.m)}
								<li>
									{#if pe !== undefined && baseCoinId !== undefined}
										<MarketPriceView
											entityId={pe}
											href={baseCoinCatalogHref ?? href}
											id={stringify(pe)}
											layout={EntityLayout.Summary}
											open={false}
										/>
									{:else if pe !== undefined}
										<MarketPriceView
											entityId={pe}
											{href}
											id={stringify(pe)}
											layout={EntityLayout.Summary}
											open={false}
										/>
									{:else}
										<span data-text="muted">
											—
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				{/snippet}
			</QueryBoundary>
		</section>

		<section>
			<h2>
				OHLC ranges
			</h2>
			<p data-text="muted">
				<code>$$marketPriceRanges</code>
				—
				candles for this same
				<code>Market</code>
				identifier; window is
				<code>timeInterval</code>
				(e.g. 1/7/30
				<code>day</code>
				rows from resolvers).
			</p>
			<QueryBoundary
				query={rangeLinksQuery}
			>
				{#snippet children(_rows)}
					{#if uniqueRangeRows.length === 0}
						<p data-text="muted">
							No range links yet.
						</p>
					{:else}
						<ul>
							{#each uniqueRangeRows as row, i (stringify((typeof row.m === 'object' && EntityMetaKey.Id in row.m ? row.m[EntityMetaKey.Id] : row.m) ?? i))}
								{@const re = (typeof row.m === 'object' && EntityMetaKey.Id in row.m ? row.m[EntityMetaKey.Id] : row.m)}
								<li>
									{#if re !== undefined}
										<MarketPriceRangeView
											entityId={re}
											href={baseCoinCatalogHref ?? href}
											id={stringify(re)}
											layout={EntityLayout.Summary}
											open={false}
										/>
									{:else}
										<span data-text="muted">
											—
										</span>
									{/if}
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
