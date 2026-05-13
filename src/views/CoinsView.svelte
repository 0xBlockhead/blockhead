<script module lang="ts">
</script>


<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import CoinDataSourcesView from '$/views/CoinDataSourcesView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'


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


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const coinsHub = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
			],
			[fieldName]: {
				$limit: limit,
			},
		},
	)

	const coins = derive(
		coinsHub,
		(merged): Entity<typeof schema, EntityType.Coin>[] => {
			const list = merged[fieldName as keyof typeof merged]
			return (
				(
					list == null ?
						[]
					:
						[...list]
				)
					.toSorted((first, second) => (
						first[EntityMetaKey.IdKey].localeCompare(second[EntityMetaKey.IdKey])
					))
			)
		},
	)
</script>


<div
	data-e2e="coins-hub-carousel-groups"
>
	<EntitiesList
		{...entitiesListRest}
		bind:open
		entityType={EntityType.Coin}
		{href}
		{id}
		{title}
	>
		{#snippet body()}
			<ResourceBoundary resource={coins}>
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
		<Collapsible
			id={`${id}:hub-spot-quotes`}
			{...{ 'data-card': '' }}
			data-e2e="coins-collapsible-spot-quotes"
			open={quotesOpen}
		>
			{#snippet Summary({
				open: _o,
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
			{#snippet children(_c)}
				<div
					data-column="gap-2"
				>
					<p
						data-text="muted"
						data-e2e="coins-spot-quotes-desc"
					>
						<a href={resolve('/coins/prices')}>
							Spot index
						</a>
						—
						<code>MarketPrice</code>
						rows (USD, 1e8), not venue-level order books.
					</p>
					<div
						data-e2e="coins-carousel-spot-quotes"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						style="--carousel-basis: min(44ch, 100%); gap: 0.5em"
					>
						<section
							data-e2e="coins-section-spot-quotes"
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
					</div>
				</div>
			{/snippet}
		</Collapsible>

		<Collapsible
			id={`${id}:hub-ohlc-ranges`}
			{...{ 'data-card': '' }}
			data-e2e="coins-collapsible-ohlc"
			open={ohlcOpen}
		>
			{#snippet Summary({
				open: _o,
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
			{#snippet children(_c)}
				<div
					data-column="gap-2"
				>
					<p data-text="muted">
						<a href={resolve('/coins/candles')}>
							OHLC ranges
						</a>
						—
						<code>MarketPriceRange</code>
						(1/7/30d, USD; CoinGecko
						<code>$$marketPriceRanges</code>
						)
						.
					</p>
					<div
						data-e2e="coins-carousel-ohlc"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						style="--carousel-basis: min(44ch, 100%); gap: 0.5em"
					>
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
					</div>
				</div>
			{/snippet}
		</Collapsible>

		<Collapsible
			id={`${id}:hub-markets`}
			{...{ 'data-card': '' }}
			data-e2e="coins-collapsible-markets"
			open={marketsOpen}
		>
			{#snippet Summary({
				open: _o,
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
			{#snippet children(_c)}
				<div
					data-column="gap-2"
				>
					<p data-text="muted">
						<a href={resolve('/coins/markets')}>
							All markets
						</a>
						—
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
					<div
						data-e2e="coins-carousel-markets"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						style="--carousel-basis: min(44ch, 100%); gap: 0.5em"
					>
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
					</div>
				</div>
			{/snippet}
		</Collapsible>
	{/if}

	<Collapsible
		id={`${id}:hub-deployments`}
		{...{ 'data-card': '' }}
		data-e2e="coins-collapsible-deployments"
		open={deploymentsOpen}
	>
		{#snippet Summary({
			open: _o,
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
		{#snippet children(_c)}
			<EntitiesList
				collapsible={false}
				entityType={EntityType.Coin}
				href={resolve('/coins')}
				id={`${id}:deployments-note`}
				title="Per-chain"
			>
				{#snippet body()}
					<div
						class="entity-details"
						style:view-transition-name="CoinsView-DeploymentsNote"
					>
						<p data-text="muted">
							Per-coin
							<code>$$coinInstances</code>
							(native / ERC-20); no global flat list.
						</p>
					</div>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</Collapsible>

	<Collapsible
		id={`${id}:hub-data-sources`}
		{...{ 'data-card': '' }}
		data-e2e="coins-collapsible-data-sources"
		open={sourcesOpen}
	>
		{#snippet Summary({
			open: _o,
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
		{#snippet children(_c)}
			<div
				data-column="gap-2"
			>
				<CoinDataSourcesView
					{id}
				/>
			</div>
		{/snippet}
	</Collapsible>
</div>


<style>
	.entity-details {
		display: contents;
	}
</style>
