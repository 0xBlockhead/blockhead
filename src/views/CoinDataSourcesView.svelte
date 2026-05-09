<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'

	let { id }: { id: string } = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<div
	data-column="gap-3"
	data-e2e="coin-data-sources"
>
	<div
		data-scroll-container="inline layout-carousel carousel-marker-tabs"
		data-e2e="coin-data-sources-carousel"
		style="--carousel-basis: 38ch; gap: 0.5em"
	>
		<section
			data-e2e="coin-source-constants"
			data-scroll-marker-label="Constants (internal)"
		>
			<EntitiesList
				collapsible={false}
				entityType={EntityType._Global}
				href={resolve('/coins')}
				id={`${id}:source-constants`}
				title="Constants (internal)"
			>
				{#snippet body()}
					<div
						class="entity-details"
						style:view-transition-name={`CoinDataSources-Constants-${id}`}
					>
						<p>
							<cite>{Source.Constants_Internal}</cite>
							— seeds global
							<code>$$coins</code>
							and
							<code>$$marketPrices</code>
							(quote list pointers)
							from
							<code>constants/Coin.ts</code>
							; also supplies network execution endpoint overlays for
							<code>EntityType.Network</code>
							in
							<code>resolvers/Constants.ts</code>
							.
						</p>
					</div>
				{/snippet}
			</EntitiesList>
		</section>

		<section
			data-e2e="coin-source-coingecko"
			data-scroll-marker-label="CoinGecko (REST)"
		>
			<EntitiesList
				collapsible={false}
				entityType={EntityType._Global}
				href={resolve('/coins')}
				id={`${id}:source-coingecko`}
				title="CoinGecko (REST)"
			>
				{#snippet body()}
					<div
						class="entity-details"
						style:view-transition-name={`CoinDataSources-Coingecko-${id}`}
					>
						<p>
							<cite>{Source.Coingecko_Rest}</cite>
							—
							<code>resolvers/Coingecko-Rest.ts</code>
							: global
							<code>$$coins</code>
							,
							<code>$$marketPrices</code>
							(spot
							<code>Market price</code>
							)
							,
							<code>$$marketPriceRanges</code>
							(
							<code>GET /coins/…/ohlc</code>
							)
							; entity
							<code>EntityType.Coin</code>
							; per-chain
							<code>EntityType.CoinInstance</code>
							(
							deployments
							)
							.
						</p>
					</div>
				{/snippet}
			</EntitiesList>
		</section>

		<section
			data-e2e="coin-source-coinmarketcap"
			data-scroll-marker-label="CoinMarketCap (REST)"
		>
			<EntitiesList
				collapsible={false}
				entityType={EntityType._Global}
				href={resolve('/coins')}
				id={`${id}:source-cmc`}
				title="CoinMarketCap (REST)"
			>
				{#snippet body()}
					<div
						class="entity-details"
						style:view-transition-name={`CoinDataSources-Cmc-${id}`}
					>
						<p>
							<cite>{Source.CoinMarketCap_Rest}</cite>
							—
							<code>resolvers/CoinMarketCap-Rest.ts</code>
							: list wiring, CMC info for
							<code>EntityType.Coin</code>
							, and
							<code>EntityType.MarketPrice</code>
							USD rows.
						</p>
					</div>
				{/snippet}
			</EntitiesList>
		</section>

		<section
			data-e2e="coin-source-coinpaprika"
			data-scroll-marker-label="CoinPaprika (OpenAPI)"
		>
			<EntitiesList
				collapsible={false}
				entityType={EntityType._Global}
				href={resolve('/coins')}
				id={`${id}:source-paprika`}
				title="CoinPaprika (OpenAPI)"
			>
				{#snippet body()}
					<div
						class="entity-details"
						style:view-transition-name={`CoinDataSources-Paprika-${id}`}
					>
						<p>
							<cite>{Source.Coinpaprika_OpenApi}</cite>
							—
							<code>resolvers/Coinpaprika-OpenApi.ts</code>
							: list wiring, markets, and
							<code>EntityType.MarketPrice</code>
							rows from tickers.
						</p>
					</div>
				{/snippet}
			</EntitiesList>
		</section>

		<section
			data-e2e="coin-source-defillama"
			data-scroll-marker-label="DeFi Llama (REST)"
		>
			<EntitiesList
				collapsible={false}
				entityType={EntityType._Global}
				href={resolve('/coins')}
				id={`${id}:source-llama`}
				title="DeFi Llama (REST)"
			>
				{#snippet body()}
					<div
						class="entity-details"
						style:view-transition-name={`CoinDataSources-Defillama-${id}`}
					>
						<p>
							<cite>{Source.Defillama_Rest}</cite>
							—
							<code>resolvers/Defillama-Rest.ts</code>
							: global
							<code>$$marketPrices</code>
							and
							<code>EntityType.MarketPrice</code>
							via
							<code>sources/Defillama/Rest/constants.ts</code>
							(
							<code>defillamaCurrentPriceIdByCoinId</code>
							)
							.
						</p>
					</div>
				{/snippet}
			</EntitiesList>
		</section>
	</div>
</div>
