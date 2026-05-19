<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { marketVenueById } from '$/constants/MarketVenue.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const market = useEntity(
		EntityType.Market,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.Defillama_OpenApi,
				Source.Dexscreener_OpenApi,
			],
			$$baseCoin: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={`${
		entityId.$base.kind === MarketAssetKind.Coin ?
			entityId.$base.$coin.coinId
		: entityId.$base.kind === MarketAssetKind.CoinInstance ?
			`instance ${stringify(entityId.$base.$coinInstance)}`
		:
			entityId.$base.iso4217
	} / ${
		entityId.$quote.kind === MarketAssetKind.Coin ?
			entityId.$quote.$coin.coinId
		: entityId.$quote.kind === MarketAssetKind.CoinInstance ?
			`instance ${stringify(entityId.$quote.$coinInstance)}`
		:
			entityId.$quote.iso4217
	} · ${marketVenueById[entityId.$marketVenue.marketVenueId].label}`}
>
	{#snippet Heading()}
		{`${
			entityId.$base.kind === MarketAssetKind.Coin ?
				entityId.$base.$coin.coinId
			: entityId.$base.kind === MarketAssetKind.CoinInstance ?
				`instance ${stringify(entityId.$base.$coinInstance)}`
			:
				entityId.$base.iso4217
		} / ${
			entityId.$quote.kind === MarketAssetKind.Coin ?
				entityId.$quote.$coin.coinId
			: entityId.$quote.kind === MarketAssetKind.CoinInstance ?
				`instance ${stringify(entityId.$quote.$coinInstance)}`
			:
				entityId.$quote.iso4217
		} · ${marketVenueById[entityId.$marketVenue.marketVenueId].label}`}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Venue</dt>
				<dd>{marketVenueById[entityId.$marketVenue.marketVenueId].label}</dd>
			</div>
			<div>
				<dt>Base leg</dt>
				<dd>{(
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					: entityId.$base.kind === MarketAssetKind.CoinInstance ?
						`instance ${stringify(entityId.$base.$coinInstance)}`
					:
						entityId.$base.iso4217
				)}</dd>
			</div>
			<div>
				<dt>Quote leg</dt>
				<dd>{(
					entityId.$quote.kind === MarketAssetKind.Coin ?
						entityId.$quote.$coin.coinId
					: entityId.$quote.kind === MarketAssetKind.CoinInstance ?
						`instance ${stringify(entityId.$quote.$coinInstance)}`
					:
						entityId.$quote.iso4217
				)}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const marketIdKey = stringify(entityId)}
		{@const pricingHubHref = (
			entityId.$base.kind === MarketAssetKind.Coin ?
				resolve(
					'/(assets)/(coins)/coin/[coinId]',
					{ coinId: entityId.$base.$coin.coinId },
				)
			:
				undefined
		)}
		<EntityDetails
			entityType={EntityType.Market}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${marketIdKey}:carousel-assets`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 40ch',
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
							Assets
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<section data-scroll-marker-label="Base">
						{#if entityId.$base.kind === MarketAssetKind.Coin}
							<CoinView
								entityId={entityId.$base.$coin}
								href={resolve(
									'/(assets)/(coins)/coin/[coinId]',
									{ coinId: entityId.$base.$coin.coinId },
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
							<p>{entityId.$base.iso4217}</p>
						{/if}
					</section>

					<section data-scroll-marker-label="Quote">
						{#if entityId.$quote.kind === MarketAssetKind.Coin}
							<CoinView
								entityId={entityId.$quote.$coin}
								href={resolve(
									'/(assets)/(coins)/coin/[coinId]',
									{ coinId: entityId.$quote.$coin.coinId },
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
							<p>{entityId.$quote.iso4217}</p>
						{/if}
					</section>

					{#if entityId.$base.kind === MarketAssetKind.Coin}
						<section data-scroll-marker-label="Catalog base">
							<ResourceBoundary
								placeholderText="Loading market…"
								resource={market}
							>
								{#snippet children(loaded)}
									{#if loaded.$$baseCoin !== undefined}
										<CoinView
											entityId={loaded.$$baseCoin[EntityMetaKey.Id]}
											href={resolve(
												'/(assets)/(coins)/coin/[coinId]',
												{ coinId: loaded.$$baseCoin[EntityMetaKey.Id].coinId },
											)}
											id={`${marketIdKey}:catalog-base`}
											layout={EntityLayout.Summary}
											open={false}
										/>
									{:else}
										<p data-text="muted">
											No catalog base coin yet.
										</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${marketIdKey}:carousel-pricing`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 40ch',
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
							Pricing hub
						</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Spot and index rows capture timestamped prints—last trade, mid, or composite index level—for a venue and pair.
								</p>
								<p>
									OHLC ladders compress those prints into interval bars; feeds and candle APIs are usually separate products with different refresh rules.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="How pricing sections differ"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<section data-scroll-marker-label="Spot and index">
						<MarketPricesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Market,
								entityId,
								fieldName: '$$marketPrices',
							}}
							href={pricingHubHref ?? href}
							id={`${marketIdKey}:market-prices`}
							title="Spot & index streams"
						/>
					</section>

					<section data-scroll-marker-label="Interval OHLC">
						<MarketPriceRangesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Market,
								entityId,
								fieldName: '$$marketPriceRanges',
							}}
							href={pricingHubHref ?? href}
							id={`${marketIdKey}:market-price-ranges`}
							title="Interval OHLC bars"
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
