<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'

	import Page from '$/components/Page.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
</script>


<Page>
	<Market_TimeInterval_TimestampsView
		collapsible={false}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$marketTimeIntervalTimestamps',
		}}
		href={resolve('/coins/candles')}
		id="coin-ohlc-candles-page"
		limit={256}
		title="All OHLC candles"
	/>
</Page>
