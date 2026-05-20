<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { DeclarativeOrderBy } from '$/lib/tanstackDb/orderBySteps.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import { catalogCoinIdentitySources } from '$/constants/Market.ts'
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
		open = $bindable(true),
		collapsible = true,
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
		[...catalogCoinIdentitySources].filter((source) => enabledSources.has(source))
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
	import CoinInstancesView from '$/views/CoinInstancesView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<div
	{id}
	class="coins-view-carousel-groups entity-view-detail-carousels"
	data-column="gap-3"
>
	<EntitiesList
		{...entitiesListRest}
		bind:open
		entityType={EntityType.Coin}
		{href}
		id={`${id}-catalog`}
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
			{#if open}
				{@const parent = useEntity(
					entityFieldReference.entityType,
					entityFieldReference.entityId,
					{
						$: catalogCoinSources,
						[fieldName]: {
							$: catalogCoinSources,
							$orderBy: globalCoinsFieldOrderBy,
							$limit: Math.max(limit, 250),
						},
					},
				)}
				{@const coins = derive(
					parent,
					(parent): Entity<typeof schema, EntityType.Coin>[] => {
						const list = parent[fieldName]
						const rows = (
							list == null ?
								[]
							:
								[...list]
						)
						const filtered = (
							rows.some((row) => (
								typeof row.marketCapRank === 'number'
								&& Number.isFinite(row.marketCapRank)
							)) ?
								rows.filter((row) => (
									typeof row.marketCapRank === 'number'
									&& Number.isFinite(row.marketCapRank)
								))
							:	rows
						)
						const seenCoinIds = new SvelteSet<string>()
						const deduped = (
							filtered.flatMap((row) => {
								const coinId = row[EntityMetaKey.Id].coinId
								if (seenCoinIds.has(coinId)) return []
								seenCoinIds.add(coinId)
								return [row]
							})
						)
						return deduped.slice(0, limit)
					},
				)}
				<ResourceBoundary
					resource={coins}
				>
					{#snippet children(coins)}
						<UnorderedList
							items={coins}
							getKey={(row) => stringify(row[EntityMetaKey.Id])}
							getSortValue={(row) => {
								const rank = row.marketCapRank
								const rankN = (
									typeof rank === 'number' && Number.isFinite(rank) ?
										rank
									:	Number.POSITIVE_INFINITY
								)
								const cap = row.marketCapUsd
								const capN = (
									typeof cap === 'number' && Number.isFinite(cap) ?
										cap
									:	-Number.POSITIVE_INFINITY
								)
								return (
									`${String(rankN).padStart(12, '0')}\0${String(-capN).padStart(24, '0')}\0${row[EntityMetaKey.Id].coinId}`
								)
							}}
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
			{/if}
		{/snippet}
	</EntitiesList>

	<CollapsibleTabs
			id={`${id}:hub-spot-quotes`}
			class="coins-view-collapsible-quotes"
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

			{#snippet body(_childrenContext)}
				<p data-text="muted">
					<a href={resolve('/coins/prices')}>Spot quote index</a>
					— point-in-time spot and index readings (not venue order books).
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
			class="coins-view-collapsible-ohlc"
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
					data-scroll-marker-label="Candle index"
					href={`#${id}:ohlc-candles-preview`}
				>Candle index</a>
			{/snippet}

			{#snippet body(_childrenContext)}
				<div data-row="wrap align-center gap-2">
					<a href={resolve('/coins/candles')}>
						OHLC candles
					</a>
					<Tooltip contentProps={{ side: 'top' }}>
						{#snippet Content()}
							<p>
								Each row is one
								<code>Market_TimeInterval_Timestamp</code>
								candle (open/high/low/close at 1e8 USD).
							</p>
						{/snippet}
						<abbr
							class="entity-heading-tip"
							aria-label="OHLC schema"
						>ⓘ</abbr>
					</Tooltip>
				</div>
				<section data-scroll-marker-label="Candle index">
					<Market_TimeInterval_TimestampsView
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$marketTimeIntervalTimestamps',
						}}
						href={resolve('/coins/candles')}
						id={`${id}:ohlc-candles-preview`}
						limit={48}
						title="Recent candles"
					/>
				</section>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${id}:hub-markets`}
			class="coins-view-collapsible-markets"
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

			{#snippet body(_childrenContext)}
				<div data-row="wrap align-center gap-2">
					<a href={resolve('/markets')}>
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
								<code>$$marketTimeIntervalTimestamps</code>
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
						href={resolve('/markets')}
						id={`${id}:markets-index`}
						open
						title="Market index"
					/>
				</section>
			{/snippet}
		</CollapsibleTabs>

	<CollapsibleTabs
		id={`${id}:hub-deployments`}
		class="coins-view-collapsible-deployments"
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
				data-scroll-marker-label="Sample deployments"
				href={`#${id}:deployments-eth`}
			>Sample</a>
		{/snippet}

		{#snippet body(_childrenContext)}
			<p data-text="muted">
				Per-chain deployments are listed on each
				<a href={resolve('/coin/ETH')}>coin detail</a>
				page. Preview for catalog
				<a href={resolve('/coin/ETH')}>ETH</a>:
			</p>
			<section data-scroll-marker-label="Sample deployments">
				<CoinInstancesView
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.Coin,
						entityId: { coinId: CoinId.ETH },
						fieldName: '$$coinInstances',
					}}
					href={resolve('/coin/ETH')}
					id={`${id}:deployments-eth`}
					open={deploymentsOpen}
					title="Ethereum (ETH)"
				/>
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
