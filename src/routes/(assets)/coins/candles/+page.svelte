<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
</script>


<Page>
	<Market_TimeInterval_TimestampsView
		href={resolve('/markets')}
		collapsible={false}
		selection={select(
			EntityType._Global,
			{ scope: '$$marketTimeIntervalTimestamps' }
		).$$marketTimeIntervalTimestamps}
		id="coin-ohlc-candles-page"
		limit={256}
		title="All OHLC candles"
	/>
</Page>
