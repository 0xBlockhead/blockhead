<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
	import { catalogCoinIdentitySources } from '$/constants/Market.ts'
	import { Source } from '$/sources/$Source.ts'
	import { catalogCoinUsdMarketIdByCoinId } from '$/constants/MarketCatalog.ts'

	import {
		MarketKind,
		marketKinds,
	} from '$/constants/Market.ts'

	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(coins)/coin/[coinId]',
			{ coinId: entityId.coinId },
		),
		layout,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Coin>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const coin = useEntity(
		EntityType.Coin,
		entityId,
		{
			$: [...catalogCoinIdentitySources],
			$logo: {},
			decimals: {},
			name: {},
			symbol: {},
			marketCapRank: {},
			marketCapUsd: {
				$: catalogCoinIdentitySources,
			},
			$$timestamps: {
				$: [
					Source.Blockscout_Rest,
				],
				$limit: 8,
			},
			...(open && {
				$$coinInstances: {
					$: [
						Source.Constants_Internal,
						Source.Coingecko_Rest,
					],
				},
				$$bridgeCapabilities: {
					$: [
						Source.Constants_Internal,
						Source.Lifi_Rest,
					],
				},
			}),
		},
	)


	// Functions
	const formatCoinHeadingLabel = (
		loadedCoin: {
			name?: string
			symbol?: string
		},
		coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
	) => (
		loadedCoin.name != null
		&& loadedCoin.symbol != null
		&& loadedCoin.name !== loadedCoin.symbol ?
			`${loadedCoin.name} (${loadedCoin.symbol})`
		:
			loadedCoin.symbol ?? loadedCoin.name ?? coinId
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import CoinInstancesView from '$/views/CoinInstancesView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	bind:open
	{entityId}
	href={href}
	{layout}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={coin}
		>
			{#snippet children(loadedCoin)}
				{#if loadedCoin.$logo?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						src={loadedCoin.$logo[EntityMetaKey.Id].url}
						alt={loadedCoin.symbol ?? loadedCoin.name ?? entityId.coinId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={coin}
			placeholderText="Loading…"
		>
			{#snippet children(loadedCoin)}
				{formatCoinHeadingLabel(loadedCoin, entityId.coinId)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{entityId.coinId}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A logical <strong>CAIP-19 coin</strong>
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
						{#snippet children(loadedCoin)}
							{#if loadedCoin.marketCapRank != null && Number.isFinite(coin.marketCapRank)}
								{String(coin.marketCapRank)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Market cap</dt>
				<dd>
					<ResourceBoundary resource={coin}>
						{#snippet children(loadedCoin)}
							{#if loadedCoin.marketCapUsd != null && Number.isFinite(coin.marketCapUsd)}
								<CurrencyAmount
									currency="USD"
									scale={1}
									value={loadedCoin.marketCapUsd}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Fundamentals</dt>
				<dd>
					<ResourceBoundary resource={coin}>
						{#snippet children(loadedCoin)}
							{@const headTimestampId = (
								(coin.$$timestamps ?? [])
									.toSorted((
										leftRow,
										rightRow,
									) => (
										rightRow[EntityMetaKey.Id].timestampMs
											- leftRow[EntityMetaKey.Id].timestampMs
									))[0]
									?.[EntityMetaKey.Id]
							)}
							{#if headTimestampId}
								<Coin_TimestampView
									entityId={headTimestampId}
									href={resolve(
										'/(assets)/(coins)/coin/[coinId]',
										{ coinId: entityId.coinId },
									)}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Decimals</dt>
					<dd>
						<ResourceBoundary resource={coin}>
							{#snippet children(loadedCoin)}
								{#if loadedCoin.decimals !== undefined}
									{String(coin.decimals)}
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
		{@const idPrefix = stringify(entityId)}
		{@const catalogUsdMarketId = (
			catalogCoinUsdMarketIdByCoinId[entityId.coinId]
		) satisfies EntityId<typeof schema, EntityType.Market>}
		{@const catalogUsdMarketLabel = (
			catalogUsdMarketId.marketKind === MarketKind.Spot ?
				`${catalogUsdMarketId.$marketVenue.marketVenueId}:${catalogUsdMarketId.$base.$coin.coinId}-${catalogUsdMarketId.$quote.$currency.iso4217}`
			:
				`${catalogUsdMarketId.$marketVenue.marketVenueId}:${catalogUsdMarketId.$base.$coin.coinId}-${catalogUsdMarketId.$quote.$currency.iso4217} (${marketKinds[catalogUsdMarketId.marketKind].label})`
		)}
		{@const catalogUsdMarketHref = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(catalogUsdMarketId)),
			},
		)}
		<EntityDetails
			entityType={EntityType.Coin}
			{entityId}
		/>
		<div
			class="coin-view-carousel-groups entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idPrefix}:carousel-topology`}
				sectionIdPrefix={idPrefix}
				sections={[
					{ id: 'coin-instances', label: 'Instances' },
					...((coin.$$coinInstances ?? []).some((row) => (
						row.representation === CoinInstanceRepresentation.BridgeWrapped
					)) ? [{ id: 'coin-wrapped', label: 'Wrapped' }] : []),
					...((coin.$$bridgeCapabilities ?? []).length ? [{ id: 'coin-bridge-capabilities', label: 'Bridge capabilities' }] : []),
				]}
				class="coin-view-collapsible-topology"
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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
					<CoinInstancesView
						href={resolve('/coins')}
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType.Coin,
							entityId,
							fieldName: '$$coinInstances',
						}}
						{id}
						title="Instances"
					/>
				{/snippet}

				{#snippet SectionCoinWrapped({ id, label })}
					{#if (coin.$$coinInstances ?? []).some((row) => (
						row.representation === CoinInstanceRepresentation.BridgeWrapped
					))}
						<CoinInstancesView
							href={resolve('/coins')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
								fieldName: '$$coinInstances',
							}}
							{id}
							representationFilter={CoinInstanceRepresentation.BridgeWrapped}
							title="Wrapped"
						/>
					{/if}
				{/snippet}

				{#snippet SectionCoinBridgeCapabilities({ id, label })}
					{#if (coin.$$bridgeCapabilities ?? []).length}
						<CoinBridgeCapabilitiesView
							href={resolve('/bridge')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
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
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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
						href={resolve('/markets')}
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType.Coin,
							entityId,
							fieldName: '$$marketsWithCoinAsBase',
						}}
						{id}
						title="Base"
					/>
				{/snippet}

				{#snippet SectionMarketsAsQuote({ id, label })}
					<MarketsView
						href={resolve('/markets')}
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType.Coin,
							entityId,
							fieldName: '$$marketsWithCoinAsQuote',
						}}
						{id}
						title="Quote"
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>


