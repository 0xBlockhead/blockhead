<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<svelte:head>
	<title>Spot quote index · Coins</title>
</svelte:head>


<Page>
	<p data-text="muted">
		Point-in-time spot and index readings for catalog markets—not venue order books.
		Each row opens the market pair for quote history and OHLC ranges.
	</p>

	<MarketPricesView
		collapsible={false}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$marketPrices',
		}}
		href={resolve('/coins/prices')}
		id="coin-prices-page"
		limit={96}
		title="Spot quote index"
	/>
</Page>
