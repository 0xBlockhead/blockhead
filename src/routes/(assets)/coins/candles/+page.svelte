<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
</script>


<svelte:head>
	<title>All OHLC candles • Blockhead</title>
</svelte:head>


<Page>
	<Market_TimeInterval_TimestampsView
		href={resolve('/coins/candles')}
		title='All OHLC candles'
		selection={
			select(EntityType._Global, {
				scope: '$$marketTimeIntervalTimestamps',
			})
				.$$marketTimeIntervalTimestamps({
					sources: [
						Source.Constants_Internal,
					],
					limit: 256,
				})
		}
		countResource={
			select(EntityType._Global, {
				scope: '$$marketTimeIntervalTimestamps',
			})
				.$$marketTimeIntervalTimestamps({
					sources: [
						Source.Constants_Internal,
					],
					limit: 256,
				}).count
		}
		id='market-time-interval-timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
