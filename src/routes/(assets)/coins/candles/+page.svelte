<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


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
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$marketTimeIntervalTimestamps' },
			fieldName: '$$marketTimeIntervalTimestamps',
		}}
		id="coin-ohlc-candles-page"
		limit={256}
		title="All OHLC candles"
	/>
</Page>
