<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmCoinInstancesView from '$/views/EvmCoinInstancesView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Coins',
		typeAnnotationParagraphs = ['A market-facing coin or crypto asset identity used across price, market, and network contexts.'],
		placeholderText = 'Loading Coins...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Coins-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Coin>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}


<CollapsibleTabs
	id={`${id}:hub-spot-quotes`}
	sectionIdPrefix={id}
	sections={[
		{ id: 'prices-spot', label: 'Spot quote index' },
	]}
	class="coins-view-collapsible-quotes"
	data-card
	scrollContainerProps={{
		'data-row': 'start align-start',
		style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
	}}
>
	{#snippet Summary()}
		<header
			data-row-item="flexible"
			data-row="wrap gap-4"
		>
			<Heading>Spot quotes</Heading>
		</header>
	{/snippet}

	{#snippet SectionPricesSpot({ id, label })}
		<p data-text="muted">
			Point-in-time spot and index readings. Venue order books live under markets.
		</p>

		<MarketPricesView
			CollapsibleProps={{ canToggle: false }}
			href={resolve('/(assets)/markets')}
			selection={select(
				EntityType._Global,
				{ scope: '$$marketPrices' }
			)[EntityProxyField]<EntityType.MarketPrice>('$$marketPrices')}
			{id}
			open
			title={label}
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
	scrollContainerProps={{
		'data-row': 'start align-start',
		style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
	}}
>
	{#snippet Summary()}
		<header
			data-row-item="flexible"
			data-row="wrap gap-4"
		>
			<Heading>OHLC ranges</Heading>
		</header>
	{/snippet}

	{#snippet SectionOhlcCandlesPreview({ id, label })}
		<div data-row="wrap align-center gap-2">
			<span>OHLC candles</span>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Each row is one <code>Market_TimeInterval_Timestamp</code> candle.
					</p>
				{/snippet}

				<abbr
					class="entity-heading-tip"
					aria-label="OHLC schema"
				>i</abbr>
			</Tooltip>
		</div>

		<Market_TimeInterval_TimestampsView
			CollapsibleProps={{ canToggle: false }}
			selection={select(
				EntityType._Global,
				{ scope: '$$marketTimeIntervalTimestamps' }
			)[EntityProxyField]<EntityType.Market_TimeInterval_Timestamp>('$$marketTimeIntervalTimestamps')}
			{id}
			open
			title={label}
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
	scrollContainerProps={{
		'data-row': 'start align-start',
		style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
	}}
>
	{#snippet Summary()}
		<header
			data-row-item="flexible"
			data-row="wrap gap-4"
		>
			<Heading>Markets</Heading>
		</header>
	{/snippet}

	{#snippet SectionMarketsIndex({ id, label })}
		<div data-row="wrap align-center gap-2">
			<a href={resolve('/(assets)/markets')}>All markets</a>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						<code>Market</code> rows connect base asset, quote asset, venue, and market kind.
					</p>
				{/snippet}

				<abbr
					class="entity-heading-tip"
					aria-label="Market graph"
				>i</abbr>
			</Tooltip>
		</div>

		<MarketsView
			CollapsibleProps={{ canToggle: false }}
			href={resolve('/(assets)/markets')}
			selection={select(
				EntityType._Global,
				{ scope: '$$markets' }
			)[EntityProxyField]<EntityType.Market>('$$markets')}
			{id}
			open
			title={label}
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
	scrollContainerProps={{
		'data-row': 'start align-start',
		style: '--carousel-basis: min(44ch, 100%); gap: 0.5em',
	}}
>
	{#snippet Summary()}
		<header
			data-row-item="flexible"
			data-row="wrap gap-4"
		>
			<Heading>Deployments</Heading>
		</header>
	{/snippet}

	{#snippet SectionDeploymentsEth({ id, label })}
		<p data-text="muted">
			Per-chain deployments are listed on each coin detail page. Preview for catalog
			<a href={resolve('/(assets)/coin/[coinId]', { coinId: CoinId.ETH })}>ETH</a>:
		</p>

		<EvmCoinInstancesView
			CollapsibleProps={{ canToggle: false }}
			href={resolve('/(assets)/coin/[coinId]', { coinId: CoinId.ETH })}
			selection={select(
				EntityType.Coin,
				{ coinId: CoinId.ETH }
			)[EntityProxyField]<EntityType.EvmCoinInstance>('$$coinInstances')}
			{id}
			open
			title={label}
		/>
	{/snippet}
</CollapsibleTabs>
