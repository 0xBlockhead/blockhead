<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'

	import Page from '$/components/Page.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<Page>
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
		title="All spot quotes"
	/>
</Page>
