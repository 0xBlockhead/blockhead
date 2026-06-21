<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
	import { Source } from '$/sources/Source.ts'
	import { catalogCoinSpotUsdMarketByCoinId } from '$/constants/MarketCatalog.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'

	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href,
		layout,
		open = $bindable(
			layout === EntityLayout.SummaryDetails
			&& !(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Coin>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Functions
	const formatCoinHeadingLabel = (
		coin: {
			name?: string
			symbol?: string
		},
		coinId: EntitySelector<typeof schema, EntityType.Coin>['coinId'],
	) => (
		coin.name != null
		&& coin.symbol != null
		&& coin.name !== coin.symbol ?
			`${coin.name} (${coin.symbol})`
		:
			coin.symbol ?? coin.name ?? coinId
	)


	const coin = $derived(
		selection(
			{
				sources: (
					open
					|| layout == null
					|| layout === EntityLayout.SummaryDetails
				) ?
					[
						Source.Constants_Internal,
						Source.Coingecko_Rest,
						Source.CoinMarketCap_Rest,
						Source.Coinpaprika_OpenApi,
					]
				:
					[
						Source.Constants_Internal,
					],
				fields: {
					symbol: true,
					...((
						open
						|| layout == null
						|| layout === EntityLayout.SummaryDetails
					) && {
						$logo: true,
						decimals: true,
						name: true,
						$$coinInstances: {
							sources: [
								Source.Constants_Internal,
								Source.Coingecko_Rest,
							],
						},
						$$bridgeCapabilities: {
							sources: [
								Source.Constants_Internal,
							],
						},
					}),
				},
			},
		),
	)


	const idPrefix = $derived(
		stringify(selection.entitySelector)
	)

	const catalogUsdMarketId = $derived({
		$base: {
			kind: MarketAssetKind.Coin,
			$coin: { coinId: catalogCoinSpotUsdMarketByCoinId[selection.entitySelector.coinId].baseCoinId },
		},
		$quote: {
			kind: MarketAssetKind.Currency,
			$currency: { iso4217: catalogCoinSpotUsdMarketByCoinId[selection.entitySelector.coinId].quoteIso4217 },
		},
		$marketVenue: {
			marketVenueId: catalogCoinSpotUsdMarketByCoinId[selection.entitySelector.coinId].marketVenueId,
		},
		marketKind: catalogCoinSpotUsdMarketByCoinId[selection.entitySelector.coinId].marketKind,
	})


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import EvmCoinInstancesView from '$/views/EvmCoinInstancesView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	bind:open
	entitySelector={selection.entitySelector}
	href={href ?? resolve('/(assets)/(coins)/coin/[coinId]', {
		coinId: selection.entitySelector.coinId,
	})}
	{layout}
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Icon()}
		{#if open}
			<ResourceBoundary
				resource={coin}
			>
				{#snippet children(coin)}
					{#if coin.fields.$logo?.[EntityMetaKey.Selector].url !== undefined}
						<IconComponent
							src={coin.fields.$logo[EntityMetaKey.Selector].url}
							alt={coin.fields.symbol ?? coin.fields.name ?? selection.entitySelector.coinId}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		<span>
			{selection.entitySelector.coinId}
		</span>
	{/snippet}

	{#snippet Title()}
		{#if open}
			<ResourceBoundary
				resource={coin}
				placeholderText="Loading…"
			>
				{#snippet children(coin)}
					{formatCoinHeadingLabel(coin.fields, selection.entitySelector.coinId)}
				{/snippet}
			</ResourceBoundary>
		{:else}
			{selection.entitySelector.coinId}
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A logical <strong>CAIP-19 asset</strong>
			id groups every on-chain deployment, time-stamped fundamentals snapshots, and market quote streams for the same asset so duplicate tickers from rival data vendors stay separable by catalog key and vendor attribution.
		</p>
		<p>
			Each <strong>coin instance</strong>
			row is anchored on one execution chain—either the native gas asset or a token contract—while sharing the same catalog coin id across networks.
		</p>
	{/snippet}

	{#snippet Content({
		title: _contentTitle,
		href: _contentHref,
	})}
		<dl data-column-item="center">
				<div>
					<dt>Market cap rank</dt>
					<dd>
						<ResourceBoundary resource={coin}>
							{#snippet children(coin)}
									{#if (
										coin.fields.$$timestamps?.values.at(0)?.marketCapRank != null
										&& Number.isFinite(coin.fields.$$timestamps?.values.at(0)?.marketCapRank)
									)}
										{String(coin.fields.$$timestamps?.values.at(0)?.marketCapRank)}
									{/if}
							{/snippet}
						</ResourceBoundary>
				</dd>
			</div>

				<div>
					<dt>Market cap</dt>
					<dd>
							<ResourceBoundary resource={coin}>
								{#snippet children(coin)}
									{@const marketCapUsd = coin.fields.$$timestamps?.values.at(0)?.marketCapUsd}
										{#if marketCapUsd !== undefined}
											<CurrencyAmount
												currency="USD"
												scale={1}
												value={marketCapUsd}
											/>
										{/if}
								{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

				{#if open}
					<ResourceBoundary resource={coin}>
						{#snippet children(coin)}
								{#if coin.fields.$$timestamps?.values.length}
									<div>
										<dt>Latest snapshot</dt>
										<dd>
										<Coin_TimestampView
											selection={select(EntityType.Coin_Timestamp, coin.fields.$$timestamps.values
											.toSorted((leftRow, rightRow) => (
												rightRow[EntityMetaKey.Selector].timestampMs
													- leftRow[EntityMetaKey.Selector].timestampMs
											))[0][EntityMetaKey.Selector])}
										href={resolve('/(assets)/(coins)/coin/[coinId]', {
											coinId: selection.entitySelector.coinId,
										})}
										layout={EntityLayout.Title}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<div>
					<dt>Decimals</dt>
					<dd>
						<ResourceBoundary resource={coin}>
							{#snippet children(coin)}
								{#if coin.fields.decimals !== undefined}
									{String(coin.fields.decimals)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<ResourceBoundary resource={coin}>
			{#snippet children(coin)}
				<div class="coin-view-carousel-groups">
					<CollapsibleTabs
						id={`${idPrefix}:carousel-topology`}
						sectionIdPrefix={idPrefix}
						sections={collapsibleTabsSections([
							{ id: 'coin-instances', label: 'Instances' },
							{ id: 'coin-wrapped', label: 'Wrapped' },
							...(coin.fields.$$bridgeCapabilities?.values.length ? [{ id: 'coin-bridge-capabilities', label: 'Bridge capabilities' }] : []),
						])}
						class="coin-view-collapsible-topology"
						data-card
					>
						{#snippet Summary({
							open: _summaryOpen,
						})}
							<header
								data-row-item="flexible"
								data-row="wrap gap-4"
							>
								<HeadingComponent>
									Topology
								</HeadingComponent>
							</header>
						{/snippet}

						{#snippet SectionCoinInstances({ id, label })}
							<EvmCoinInstancesView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/coins')}
								selection={selection.$$coinInstances}
								{id}
								title="Instances"
							/>
						{/snippet}

						{#snippet SectionCoinWrapped({ id, label })}
							<EvmCoinInstancesView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/coins')}
								selection={selection.$$coinInstances}
								{id}
								representationFilter={CoinInstanceRepresentation.BridgeWrapped}
								title="Wrapped"
							/>
						{/snippet}

						{#snippet SectionCoinBridgeCapabilities({ id, label })}
							{#if coin.fields.$$bridgeCapabilities?.values.length}
								<CoinBridgeCapabilitiesView
									CollapsibleProps={{ canToggle: false }}
									href={resolve('/bridge')}
									selection={selection.$$bridgeCapabilities}
									{id}
									title="Bridge capabilities"
								/>
							{/if}
						{/snippet}
					</CollapsibleTabs>

					<CollapsibleTabs
						id={`${idPrefix}:carousel-markets`}
						sectionIdPrefix={idPrefix}
						sections={[
							{ id: 'catalog-usd-market', label: 'USD market' },
						]}
						class="coin-view-collapsible-markets"
						data-card
					>
						{#snippet Summary({
							open: _summaryOpen,
						})}
							<header
								data-row-item="flexible"
								data-row="wrap gap-4"
							>
								<HeadingComponent>
									Markets
								</HeadingComponent>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Each market row is a base / quote / venue triple. Open a market for spot quotes and OHLC candles.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="Markets and pricing"
									>ⓘ</abbr>
								</Tooltip>
							</header>
						{/snippet}

						{#snippet SectionCatalogUsdMarket({ id, label })}
							<p>
									<a href={resolve('/(assets)/(markets)/market/[marketKey]', {
										marketKey: encodeURIComponent(stringify(catalogUsdMarketId)),
									})}>
									{catalogUsdMarketId.marketKind === MarketKind.Spot ?
											`${catalogUsdMarketId.$marketVenue.marketVenueId}:${catalogUsdMarketId.$base.$coin.coinId}-${catalogUsdMarketId.$quote.$currency.iso4217}`
										:
											`${catalogUsdMarketId.$marketVenue.marketVenueId}:${catalogUsdMarketId.$base.$coin.coinId}-${catalogUsdMarketId.$quote.$currency.iso4217} (${marketKindByMarketKind[catalogUsdMarketId.marketKind].label})`}
								</a>
								<span data-text="muted">
									— spot quote and OHLC on the market page.
								</span>
							</p>
						{/snippet}
					</CollapsibleTabs>
				</div>
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
