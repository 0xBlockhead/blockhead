<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'

	import Page from '$/components/Page.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<Page>
	<MarketPricesView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$marketPrices',
		}}
		href={resolve('/coins/prices')}
		id="coin-prices-page"
		title="All spot quotes"
	/>
</Page>
