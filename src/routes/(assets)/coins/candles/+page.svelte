<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'

	import Page from '$/components/Page.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
</script>


<Page>
	<MarketPriceRangesView
		collapsible={false}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$marketPriceRanges',
		}}
		href={resolve('/coins/candles')}
		id="coin-ohlc-ranges-page"
		limit={96}
		title="All OHLC ranges"
	/>
</Page>
