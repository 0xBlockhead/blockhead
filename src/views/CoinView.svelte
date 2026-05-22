<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
	import { catalogCoinIdentitySources } from '$/constants/Market.ts'
	import { Source } from '$/sources/$Source.ts'
	import { catalogCoinUsdMarketId } from '$/constants/MarketCatalog.ts'
	import { formatMarketIdLabel } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Coin>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	import { EntityLayout } from '$/components/EntityView.svelte'

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
		coin: {
			name?: string
			symbol?: string
		},
		coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
	) => (
		coin.name != null
		&& coin.symbol != null
		&& coin.name !== coin.symbol ?
			`${coin.name} (${coin.symbol})`
		:
			coin.symbol ?? coin.name ?? coinId
	)


	// Components
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
	{href}
	{layout}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={coin}
			placeholderText=""
		>
			{#snippet children(coin)}
				{#if coin.$logo?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						src={coin.$logo[EntityMetaKey.Id].url}
						alt={coin.symbol ?? coin.name ?? entityId.coinId}
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
			{#snippet children(coin)}
				{formatCoinHeadingLabel(coin, entityId.coinId)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<span>
			{entityId.coinId}
		</span>
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
						{#snippet children(coin)}
							{#if coin.marketCapRank != null && Number.isFinite(coin.marketCapRank)}
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
						{#snippet children(coin)}
							{#if coin.marketCapUsd != null && Number.isFinite(coin.marketCapUsd)}
								<CurrencyAmount
									currency="USD"
									scale={1}
									value={coin.marketCapUsd}
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
						{#snippet children(coin)}
							{#if (coin.$$timestamps ?? []).length}
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
										{href}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
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
							{#snippet children(coin)}
								{#if coin.decimals !== undefined}
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
			catalogCoinUsdMarketId(entityId.coinId)
		) satisfies EntityId<typeof schema, EntityType.Market>}
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

				{#snippet Markers({ open: _markersOpen })}
					<ResourceBoundary resource={coin}>
						{#snippet children(coin)}
							<a
								data-scroll-marker-label="Instances"
								href={`#${idPrefix}:coin-instances`}
							>Instances</a>

							{#if (coin.$$coinInstances ?? []).some((row) => (
								row.representation === CoinInstanceRepresentation.BridgeWrapped
							))}
								<a
									data-scroll-marker-label="Wrapped"
									href={`#${idPrefix}:coin-wrapped`}
								>Wrapped</a>
							{/if}

							{#if (coin.$$bridgeCapabilities ?? []).length}
								<a
									data-scroll-marker-label="Bridge capabilities"
									href={`#${idPrefix}:coin-bridge-capabilities`}
								>Bridge capabilities</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body({ open: _detailsOpen })}
					<section data-scroll-marker-label="Instances">
						<CoinInstancesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
								fieldName: '$$coinInstances',
							}}
							{href}
							id={`${idPrefix}:coin-instances`}
							title="Instances"
						/>
					</section>

					{#if (coin.$$coinInstances ?? []).some((row) => (
						row.representation === CoinInstanceRepresentation.BridgeWrapped
					))}
						<section data-scroll-marker-label="Wrapped">
							<CoinInstancesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Coin,
									entityId,
									fieldName: '$$coinInstances',
								}}
								{href}
								id={`${idPrefix}:coin-wrapped`}
								representationFilter={CoinInstanceRepresentation.BridgeWrapped}
								title="Wrapped"
							/>
						</section>
					{/if}

					{#if (coin.$$bridgeCapabilities ?? []).length}
						<section data-scroll-marker-label="Bridge capabilities">
							<CoinBridgeCapabilitiesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Coin,
									entityId,
									fieldName: '$$bridgeCapabilities',
								}}
								{href}
								id={`${idPrefix}:coin-bridge-capabilities`}
								title="Bridge capabilities"
							/>
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${idPrefix}:carousel-markets`}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="USD market"
						href={`#${idPrefix}:catalog-usd-market`}
					>USD market</a>
					<a
						data-scroll-marker-label="Base"
						href={`#${idPrefix}:markets-as-base`}
					>Base</a>
					<a
						data-scroll-marker-label="Quote"
						href={`#${idPrefix}:markets-as-quote`}
					>Quote</a>
				{/snippet}

				{#snippet body({ open: _detailsOpen })}
					<section
						data-scroll-marker-label="USD market"
						id={`${idPrefix}:catalog-usd-market`}
					>
						<p>
							<a href={catalogUsdMarketHref}>
								{formatMarketIdLabel(catalogUsdMarketId)}
							</a>
							<span data-text="muted">
								— spot quote and OHLC on the market page.
							</span>
						</p>
					</section>

					<section data-scroll-marker-label="Base">
						<MarketsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
								fieldName: '$$marketsWithCoinAsBase',
							}}
							href={resolve('/(assets)/(coins)/coin/[coinId]', {
								coinId: entityId.coinId,
							})}
							id={`${idPrefix}:markets-as-base`}
							title="Base"
						/>
					</section>

					<section data-scroll-marker-label="Quote">
						<MarketsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
								fieldName: '$$marketsWithCoinAsQuote',
							}}
							href={resolve('/(assets)/(coins)/coin/[coinId]', {
								coinId: entityId.coinId,
							})}
							id={`${idPrefix}:markets-as-quote`}
							title="Quote"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
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
