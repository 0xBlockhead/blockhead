<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { DeclarativeOrderBy } from '$/lib/tanstackDb/orderBySteps.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { enabledSources } from '$/sources/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Coins',
		id = 'coins',
		limit = 300,
		quotesOpen = true,
		ohlcOpen = true,
		marketsOpen = false,
		deploymentsOpen = false,
		sourcesOpen = false,
		open = $bindable(true),
		entityFieldReference,
		href,
		...entitiesListRest
	}: WithRest<
		{
			id?: string
			limit?: number
			quotesOpen?: boolean
			ohlcOpen?: boolean
			marketsOpen?: boolean
			deploymentsOpen?: boolean
			sourcesOpen?: boolean
			title?: string
			open?: boolean
			href: string
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Coin>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			| 'entityType'
			| 'getKey'
			| 'getSortValue'
			| 'items'
			| 'resource'
			| 'Item'
			| 'body'
		>
	> = $props()


	const globalCoinsFieldOrderBy = (
		[
			[
				({ fieldRow }) => (
					(fieldRow[EntityMetaKey.Value] as { marketCapRank?: number }).marketCapRank
				),
				{
					direction: 'asc',
					nulls: 'last',
				},
			],
			[
				({ fieldRow }) => (
					(fieldRow[EntityMetaKey.Value] as { marketCapUsd?: number }).marketCapUsd
				),
				{
					direction: 'desc',
					nulls: 'last',
				},
			],
			[
				({ fieldRow }) => (
					(fieldRow[EntityMetaKey.Value] as { [EntityMetaKey.IdKey]: string })[EntityMetaKey.IdKey]
				),
				'asc',
			],
		] as const satisfies DeclarativeOrderBy<{ fieldRow: unknown }>
	)


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'

	const fieldName = entityFieldReference.fieldName

	const catalogCoinSources = (
		[
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.CoinMarketCap_Rest,
			Source.Coinpaprika_OpenApi,
		].filter((source) => enabledSources.has(source))
	)

	const rankedCoinFieldSources = (
		catalogCoinSources.filter((source) => source !== Source.Constants_Internal)
	)

	const coinsHub = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					$: catalogCoinSources,
					[fieldName]: {
						$: (
							rankedCoinFieldSources.length > 0 ?
								rankedCoinFieldSources
							:	catalogCoinSources
						),
						$orderBy: globalCoinsFieldOrderBy,
						$limit: Math.max(limit, 250),
					},
				}
			:
				{}
		),
	)

	const coinList = derive(
		coinsHub,
		(merged): Entity<typeof schema, EntityType.Coin>[] => {
			const list = merged[fieldName]
			const rows = (
				list == null ?
					[]
				:
					[...list]
			)
			const hasAnyMarketCapRank = (
				rows.some((row) => (
					typeof row.marketCapRank === 'number'
					&& Number.isFinite(row.marketCapRank)
				))
			)
			const rowsForHub = (
				hasAnyMarketCapRank ?
					rows.filter((row) => (
						typeof row.marketCapRank === 'number'
						&& Number.isFinite(row.marketCapRank)
					))
				:	rows
			)
			const presorted = (
				rowsForHub.toSorted((a, b) => {
					const ra = a.marketCapRank
					const rb = b.marketCapRank
					const raN = (
						typeof ra === 'number' && Number.isFinite(ra) ?
							ra
						:	Number.POSITIVE_INFINITY
					)
					const rbN = (
						typeof rb === 'number' && Number.isFinite(rb) ?
							rb
						:	Number.POSITIVE_INFINITY
					)
					if (raN !== rbN)
						return raN - rbN
					const ca = a.marketCapUsd
					const cb = b.marketCapUsd
					const caN = (
						typeof ca === 'number' && Number.isFinite(ca) ?
							ca
						:	-Number.POSITIVE_INFINITY
					)
					const cbN = (
						typeof cb === 'number' && Number.isFinite(cb) ?
							cb
						:	-Number.POSITIVE_INFINITY
					)
					if (caN !== cbN)
						return cbN - caN
					return (
						a[EntityMetaKey.Id].coinId.localeCompare(
							b[EntityMetaKey.Id].coinId,
						)
					)
				})
			)
			const seenCoinIds = new SvelteSet<string>()
			const deduped = (
				presorted.flatMap((row) => {
					const coinId = row[EntityMetaKey.Id].coinId
					if (seenCoinIds.has(coinId)) return []
					seenCoinIds.add(coinId)
					return [row]
				})
			)
			return deduped.slice(0, limit)
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import CoinDataSourcesView from '$/views/CoinDataSourcesView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<div
	class="entity-view-detail-carousels"
	data-column="gap-3"
>
	<EntitiesList
		{...entitiesListRest}
		bind:open
		entityType={EntityType.Coin}
		{href}
		{id}
		{title}
	>
		{#snippet TypeAnnotationTooltip()}
						<p>
							A logical asset id groups tickers, branding, and metadata that may span many chains.
						</p>
						<p>
							Spot prices, OHLC candles, venue markets, and on-chain token contracts are different projections of that same asset—not interchangeable tables.
						</p>
		{/snippet}
		{#snippet body()}
			<ResourceBoundary
				resource={coinList}
			>
				{#snippet children(loaded)}
					<UnorderedList
						items={loaded}
						getKey={(row) => stringify(row[EntityMetaKey.Id])}
						placeholderKeys={new SvelteSet<string | number>()}
						orientation={ListOrientation.Column}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No coins to show yet.
							</p>
						{/snippet}

						{#snippet Item({
							item: row,
						})}
							{#if row}
								{@const entityId = row[EntityMetaKey.Id]}
								<CoinView
									entityId={entityId}
									href={resolve('/(assets)/(coins)/coin/[coinId]', {
										coinId: entityId.coinId,
									})}
									id={stringify(entityId)}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/if}
						{/snippet}
					</UnorderedList>
				{/snippet}
			</ResourceBoundary>
		{/snippet}
	</EntitiesList>

	{#if id !== 'coins'}
		<CollapsibleTabs
			id={`${id}:hub-spot-quotes`}
			{...{ 'data-card': '' }}
			open={quotesOpen}
			scrollContainerProps={{
				'data-row': 'start align-start',
				style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
			}}
		>
			{#snippet Summary({
				open: _summaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<Heading>
						Spot quotes
					</Heading>
				</header>
			{/snippet}

			{#snippet Markers({ open: _markersOpen })}
				<a
					data-scroll-marker-label="Spot quote index"
					href={`#${id}:prices-spot`}
				>Spot quote index</a>
			{/snippet}

			{#snippet children(_childrenContext)}
				<p
					data-text="muted"
				>
					<a href={resolve('/coins/prices')}>
						Spot index
					</a>
					—
					<code>MarketPrice</code>
					rows (USD, 1e8), not venue-level order books.
				</p>
				<section
					data-scroll-marker-label="Spot quote index"
				>
					<MarketPricesView
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$marketPrices',
						}}
						href={resolve('/coins/prices')}
						id={`${id}:prices-spot`}
						open
						title="Spot quote index"
					/>
				</section>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${id}:hub-ohlc-ranges`}
			{...{ 'data-card': '' }}
			open={ohlcOpen}
			scrollContainerProps={{
				'data-row': 'start align-start',
				style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
			}}
		>
			{#snippet Summary({
				open: _summaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<Heading>
						OHLC ranges
					</Heading>
				</header>
			{/snippet}

			{#snippet Markers({ open: _markersOpen })}
				<a
					data-scroll-marker-label="Candle range index"
					href={`#${id}:ohlc-ranges-preview`}
				>Candle range index</a>
			{/snippet}

			{#snippet children(_childrenContext)}
				<div data-row="wrap align-center gap-2">
					<a href={resolve('/coins/candles')}>
						OHLC ranges
					</a>
					<Tooltip contentProps={{ side: 'top' }}>
						{#snippet Content()}
							<p>
								<code>MarketPriceRange</code>
								(1/7/30d, USD; CoinGecko
								<code>$$marketPriceRanges</code>
								).
							</p>
						{/snippet}
						<abbr
							class="entity-heading-tip"
							aria-label="OHLC schema"
						>ⓘ</abbr>
					</Tooltip>
				</div>
				<section data-scroll-marker-label="Candle range index">
					<MarketPriceRangesView
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$marketPriceRanges',
						}}
						href={resolve('/coins/candles')}
						id={`${id}:ohlc-ranges-preview`}
						open
						title="Candle range index"
					/>
				</section>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${id}:hub-markets`}
			{...{ 'data-card': '' }}
			open={marketsOpen}
			scrollContainerProps={{
				'data-row': 'start align-start',
				style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
			}}
		>
			{#snippet Summary({
				open: _summaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<Heading>
						Markets
					</Heading>
				</header>
			{/snippet}

			{#snippet Markers({ open: _markersOpen })}
				<a
					data-scroll-marker-label="Market index"
					href={`#${id}:markets-index`}
				>Market index</a>
			{/snippet}

			{#snippet children(_childrenContext)}
				<div data-row="wrap align-center gap-2">
					<a href={resolve('/coins/markets')}>
						All markets
					</a>
					<Tooltip contentProps={{ side: 'top' }}>
						{#snippet Content()}
							<p>
								<code>Market</code>
								vertices
								(<code>$base</code>
								·
								<code>$quote</code>
								·
								<code>venue</code>
								), with
								<code>$$marketPrices</code>
								/
								<code>$$marketPriceRanges</code>
								hanging off each.
							</p>
						{/snippet}
						<abbr
							class="entity-heading-tip"
							aria-label="Market graph"
						>ⓘ</abbr>
					</Tooltip>
				</div>
				<section data-scroll-marker-label="Market index">
					<MarketsView
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$markets',
						}}
						href={resolve('/coins/markets')}
						id={`${id}:markets-index`}
						open
						title="Market index"
					/>
				</section>
			{/snippet}
		</CollapsibleTabs>
	{/if}

	<CollapsibleTabs
		id={`${id}:hub-deployments`}
		{...{ 'data-card': '' }}
		open={deploymentsOpen}
		scrollContainerProps={{
			'data-row': 'start align-start',
			style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
		}}
	>
		{#snippet Summary({
			open: _summaryOpen,
		})}
			<header
				data-row-item="flexible"
				data-row="wrap gap-4"
			>
				<Heading>
					Deployments
				</Heading>
			</header>
		{/snippet}

		{#snippet Markers({ open: _markersOpen })}
			<a
				data-scroll-marker-label="Note"
				href={`#${id}:deployments-note`}
			>Note</a>
		{/snippet}

		{#snippet children(_childrenContext)}
			<section>
				<EntitiesList
					collapsible={false}
					entityType={EntityType.Coin}
					href={resolve('/coins')}
					id={`${id}:deployments-note`}
					title="Per-chain"
				>
					{#snippet TypeAnnotationTooltip()}
									<p>
										A coin’s token contracts and native-currency tickers are indexed per chain: CAIP-style ids tie a logical ticker to a concrete balance target on one network.
									</p>
									<p>
										The full cross-chain deployment set is the union of those per-network rows—not one flattened global table.
									</p>
					{/snippet}
					{#snippet body()}
						<div
							class="entity-details"
							style:view-transition-name="CoinsView-DeploymentsNote"
						></div>
					{/snippet}
				</EntitiesList>
			</section>
		{/snippet}
	</CollapsibleTabs>

	<CollapsibleTabs
		id={`${id}:hub-data-sources`}
		{...{ 'data-card': '' }}
		open={sourcesOpen}
		scrollContainerProps={{
			'data-row': 'start align-start',
			style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
		}}
	>
		{#snippet Summary({
			open: _summaryOpen,
		})}
			<header
				data-row-item="flexible"
				data-row="wrap gap-4"
			>
				<Heading>
					Data sources
				</Heading>
			</header>
		{/snippet}

		{#snippet Markers({ open: _markersOpen })}
			<a
				data-scroll-marker-label="Overview"
				href={`#${id}:coins-data-sources-body`}
			>Overview</a>
		{/snippet}

		{#snippet children(_childrenContext)}
			<section
				id={`${id}:coins-data-sources-body`}
			>
				<div
					data-column="gap-2"
				>
					<CoinDataSourcesView
						{id}
					/>
				</div>
			</section>
		{/snippet}
	</CollapsibleTabs>
</div>


<style>
	.entity-details {
		display: contents;
	}

	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
