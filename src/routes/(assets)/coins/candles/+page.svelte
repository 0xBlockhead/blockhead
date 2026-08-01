<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
</script>


<svelte:head>
	<title>All OHLC candles • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$marketTimeIntervalTimestamps',
	})
		.$$marketTimeIntervalTimestamps({
			sources: [
				Source.Constants_Internal,
			],
			limit: 256,
		})}

	<Market_TimeInterval_TimestampsView
		href={resolve('/(assets)/coins/candles')}
		title='All OHLC candles'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='market-time-interval-timestamps'
	/>
</Page>
