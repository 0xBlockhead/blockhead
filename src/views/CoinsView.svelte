<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import { catalogCoinIdentitySources } from '$/sources/Source.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type CoinOrderFieldRow = {
		marketCapRank?: number
		marketCapUsd?: number
		valueKey: string
	}


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'Coins',
		id = 'coins',
		limit = 300,
		quotesOpen = false,
		ohlcOpen = false,
		marketsOpen = false,
		deploymentsOpen = false,
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		...EntitiesListProps
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
			collapsible?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Coin>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Functions
	const globalCoinsFieldOrderBy = (
		[
			[
				({ fieldRow }) => (
					fieldRow.marketCapRank
				),
				{
					direction: 'asc',
				},
			],
			[
				({ fieldRow }) => (
					fieldRow.marketCapUsd
				),
				{
					direction: 'desc',
				},
			],
			[
				({ fieldRow }) => (
					fieldRow.valueKey
				),
				'asc',
			],
		] as const satisfies DeclarativeOrderBy<CoinOrderFieldRow>
	)
	import type { DeclarativeOrderBy } from '$/client/$client.svelte.ts'
	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import EvmCoinInstancesView from '$/views/EvmCoinInstancesView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<section id={id}>
	<EntitiesList
		{...EntitiesListProps}
		bind:open
		entityType={EntityType.Coin}
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
		{#snippet body({ open: _bodyOpen })}
			{#if open}
				{@const parent = subscribe(entityFieldReference.entityType,
					entityFieldReference.selector,({ sources: catalogCoinIdentitySources, fields: { [entityFieldReference.fieldName]: {
							sources: catalogCoinIdentitySources,
							orderBy: [...globalCoinsFieldOrderBy],
							limit,
						},
					} }),
				)}
				<ResourceBoundary
					resource={parent}
				>
					{#snippet children(parent)}
						<UnorderedList
							items={parent.fields[entityFieldReference.fieldName]?.values ?? []}
							getKey={(coin) => stringify(coin[EntityMetaKey.Selector])}
							placeholderKeys={new SvelteSet<string | number>()}
							orientation={ListOrientation.Column}
						>
						{#snippet Empty()}
							<p data-text="muted">
								No coins to show yet.
							</p>
						{/snippet}

						{#snippet Item({
							item: coin,
						})}
							{@const selector = coin[EntityMetaKey.Selector]}
							<CoinView
								selector={selector}
								id={stringify(selector)}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
						</UnorderedList>
					{/snippet}
				</ResourceBoundary>
			{/if}
		{/snippet}
	</EntitiesList>

	<CollapsibleTabs
		id={`${id}:hub-spot-quotes`}
		sectionIdPrefix={id}
		sections={[
			{ id: 'prices-spot', label: 'Spot quote index' },
		]}
		class="coins-view-collapsible-quotes"
		data-card
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

		{#snippet SectionPricesSpot({ id, label })}
			<p data-text="muted">
				<a href={resolve('/coins/prices')}>Spot quote index</a>
				— point-in-time spot and index readings (not venue order books).
			</p>
			<MarketPricesView
				CollapsibleProps={{ canToggle: false }}
				href={resolve('/markets')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$marketPrices' },
					fieldName: '$$marketPrices',
				}}
				id={`${id}:prices-spot`}
				open
				title="Spot quote index"
			/>
		{/snippet}
	</CollapsibleTabs>

	<CollapsibleTabs
		id={`${id}:hub-ohlc-ranges`}
		sectionIdPrefix={id}
		sections={[
			{ id: 'ohlc-candles-preview', label: 'Candle index' },
		]}
		class="coins-view-collapsible-ohlc"
		data-card
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

		{#snippet SectionOhlcCandlesPreview({ id, label })}
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
			<Market_TimeInterval_TimestampsView
				CollapsibleProps={{ canToggle: false }}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$marketTimeIntervalTimestamps' },
					fieldName: '$$marketTimeIntervalTimestamps',
				}}
				href={resolve('/coins/candles')}
				id={`${id}:ohlc-candles-preview`}
				limit={48}
				title="Recent candles"
			/>
		{/snippet}
	</CollapsibleTabs>

	<CollapsibleTabs
		id={`${id}:hub-markets`}
		sectionIdPrefix={id}
		sections={[
			{ id: 'markets-index', label: 'Market index' },
		]}
		class="coins-view-collapsible-markets"
		data-card
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

		{#snippet SectionMarketsIndex({ id, label })}
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
			<MarketsView
				CollapsibleProps={{ canToggle: false }}
				href={resolve('/markets')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$markets' },
					fieldName: '$$markets',
				}}
				id={`${id}:markets-index`}
				open
				title="Market index"
			/>
		{/snippet}
	</CollapsibleTabs>

	<CollapsibleTabs
		id={`${id}:hub-deployments`}
		sectionIdPrefix={id}
		sections={[
			{ id: 'deployments-eth', label: 'Sample deployments' },
		]}
		class="coins-view-collapsible-deployments"
		data-card
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

		{#snippet SectionDeploymentsEth({ id, label })}
			<p data-text="muted">
				Per-chain deployments are listed on each
				<a href={resolve('/coin/ETH')}>coin detail</a>
				page. Preview for catalog
				<a href={resolve('/coin/ETH')}>ETH</a>:
			</p>
			<EvmCoinInstancesView
				CollapsibleProps={{ canToggle: false }}
				href={resolve('/coins')}
				entityFieldReference={{
					entityType: EntityType.Coin,
					selector: { coinId: CoinId.ETH },
					fieldName: '$$coinInstances',
				}}
				id={`${id}:deployments-eth`}
				open={deploymentsOpen}
				title="Ethereum (ETH)"
			/>
		{/snippet}
	</CollapsibleTabs>
</section>
