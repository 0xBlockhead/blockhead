<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
	import { catalogCoinIdentitySources } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'
	import { catalogCoinUsdMarketIdByCoinId } from '$/constants/MarketCatalog.ts'

	import {
		MarketKind,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'

	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { Entity, EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(assets)/(coins)/coin/[coinId]', {
			coinId: selector.coinId,
		}),
		layout,
		open = $bindable(
			layout === EntityLayout.SummaryDetails
			&& !(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Coin>
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
		subscribe(
			EntityType.Coin,
			selector,
			{
				sources: open ?
					[...catalogCoinIdentitySources]
				:
					[
						Source.Constants_Internal,
					],
				fields: {
					symbol: true,
					...(open && {
						$logo: true,
						decimals: true,
						name: true,
						marketCapRank: true,
						marketCapUsd: {
							sources: catalogCoinIdentitySources,
						},
						$$timestamps: {
							sources: [
							Source.Blockscout_Rest,
							],
							limit: 8,
						},
						$$coinInstances: {
							sources: [
								Source.Constants_Internal,
								Source.Coingecko_Rest,
							],
						},
						$$bridgeCapabilities: {
							sources: [
								Source.Constants_Internal,
								Source.Lifi_Rest,
							],
						},
					}),
				},
			},
		),
	)


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
	import MarketsView from '$/views/MarketsView.svelte'
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	bind:open
	entitySelector={selector}
	href={href}
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
							alt={coin.fields.symbol ?? coin.fields.name ?? selector.coinId}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		<span>
			{selector.coinId}
		</span>
	{/snippet}

	{#snippet Title()}
		{#if open}
			<ResourceBoundary
				resource={coin}
				placeholderText="Loading…"
			>
				{#snippet children(coin)}
					{formatCoinHeadingLabel(coin.fields, selector.coinId)}
				{/snippet}
			</ResourceBoundary>
		{:else}
			{selector.coinId}
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
							{#if coin.fields.marketCapRank != null && Number.isFinite(coin.fields.marketCapRank)}
								{String(coin.fields.marketCapRank)}
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
							{#if coin.fields.marketCapUsd != null && Number.isFinite(coin.fields.marketCapUsd)}
								<CurrencyAmount
									currency="USD"
									scale={1}
									value={coin.fields.marketCapUsd}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if (
				open
				&& coin.current?.fields.$$timestamps?.values.length
			)}
			<div>
				<dt>Latest snapshot</dt>
				<dd>
					<ResourceBoundary resource={coin}>
						{#snippet children(coin)}
							{@const headTimestampId = (
								(coin.fields.$$timestamps?.values ?? [])
									.toSorted((
											leftRow: Entity<typeof schema, EntityType.Coin_Timestamp>,
											rightRow: Entity<typeof schema, EntityType.Coin_Timestamp>,
									) => (
										rightRow[EntityMetaKey.Selector].timestampMs
											- leftRow[EntityMetaKey.Selector].timestampMs
									))[0]
									?.[EntityMetaKey.Selector]
							)}
							{#if headTimestampId}
								<Coin_TimestampView
									selector={headTimestampId}
									href={resolve('/(assets)/(coins)/coin/[coinId]', {
											coinId: selector.coinId,
										})}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
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
		{@const idPrefix = stringify(selector)}
		{@const catalogUsdMarketId = (
			catalogCoinUsdMarketIdByCoinId[selector.coinId]
		) satisfies EntitySelector<typeof schema, EntityType.Market>}
		{@const catalogUsdMarketLabel = (
			catalogUsdMarketId.marketKind === MarketKind.Spot ?
				`${catalogUsdMarketId.$marketVenue.marketVenueId}:${catalogUsdMarketId.$base.$coin.coinId}-${catalogUsdMarketId.$quote.$currency.iso4217}`
			:
				`${catalogUsdMarketId.$marketVenue.marketVenueId}:${catalogUsdMarketId.$base.$coin.coinId}-${catalogUsdMarketId.$quote.$currency.iso4217} (${marketKindByMarketKind[catalogUsdMarketId.marketKind].label})`
		)}
		{@const catalogUsdMarketHref = `/market/${encodeURIComponent(stringify(catalogUsdMarketId))}`}
		<ResourceBoundary resource={coin}>
			{#snippet children(coin)}
				<div class="coin-view-carousel-groups">
					<CollapsibleTabs
						id={`${idPrefix}:carousel-topology`}
						sectionIdPrefix={idPrefix}
						sections={collapsibleTabsSections([
							{ id: 'coin-instances', label: 'Instances' },
							...((coin.fields.$$coinInstances?.values ?? []).some((row: Entity<typeof schema, EntityType.EvmCoinInstance>) => (
								row.representation === CoinInstanceRepresentation.BridgeWrapped
							)) ? [{ id: 'coin-wrapped', label: 'Wrapped' } as const] : []),
							...((coin.fields.$$bridgeCapabilities?.values ?? []).length ? [{ id: 'coin-bridge-capabilities', label: 'Bridge capabilities' } as const] : []),
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
								entityFieldReference={{
									entityType: EntityType.Coin,
									selector,
									fieldName: '$$coinInstances',
								}}
								{id}
								title="Instances"
							/>
						{/snippet}

						{#snippet SectionCoinWrapped({ id, label })}
							{#if (coin.fields.$$coinInstances?.values ?? []).some((row: Entity<typeof schema, EntityType.EvmCoinInstance>) => (
								row.representation === CoinInstanceRepresentation.BridgeWrapped
							))}
								<EvmCoinInstancesView
									CollapsibleProps={{ canToggle: false }}
									href={resolve('/coins')}
									entityFieldReference={{
										entityType: EntityType.Coin,
										selector,
										fieldName: '$$coinInstances',
									}}
									{id}
									representationFilter={CoinInstanceRepresentation.BridgeWrapped}
									title="Wrapped"
								/>
							{/if}
						{/snippet}

						{#snippet SectionCoinBridgeCapabilities({ id, label })}
							{#if (coin.fields.$$bridgeCapabilities?.values ?? []).length}
								<CoinBridgeCapabilitiesView
									CollapsibleProps={{ canToggle: false }}
									href={resolve('/bridge')}
									entityFieldReference={{
										entityType: EntityType.Coin,
										selector,
										fieldName: '$$bridgeCapabilities',
									}}
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
							{ id: 'markets-as-base', label: 'Base' },
							{ id: 'markets-as-quote', label: 'Quote' },
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
								<a href={catalogUsdMarketHref}>
									{catalogUsdMarketLabel}
								</a>
								<span data-text="muted">
									— spot quote and OHLC on the market page.
								</span>
							</p>
						{/snippet}

						{#snippet SectionMarketsAsBase({ id, label })}
							<MarketsView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/markets')}
								entityFieldReference={{
									entityType: EntityType.Coin,
									selector,
									fieldName: '$$marketsWithCoinAsBase',
								}}
								{id}
								title="Base"
							/>
						{/snippet}

						{#snippet SectionMarketsAsQuote({ id, label })}
							<MarketsView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/markets')}
								entityFieldReference={{
									entityType: EntityType.Coin,
									selector,
									fieldName: '$$marketsWithCoinAsQuote',
								}}
								{id}
								title="Quote"
							/>
						{/snippet}
					</CollapsibleTabs>
				</div>
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
