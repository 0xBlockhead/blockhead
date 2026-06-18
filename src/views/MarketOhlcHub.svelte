<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'

	import {
		marketOhlcDailyTimeInterval,
		marketOhlcDayLookbackValues,
		MarketAssetKind,
	} from '$/constants/Market.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		id,
		market,
		lookbackDayCount = $bindable(7),
		listOpen = false,
		chartTitlePrefix,
		candlesListTitle = 'OHLC candles',
	}: {
		id: string
		market: EntitySelector<typeof schema, EntityType.Market>
		lookbackDayCount?: number
		listOpen?: boolean
		/** When set (e.g. on coin detail), omits repeating the coin id in chart chrome. */
		chartTitlePrefix?: string
		candlesListTitle?: string
	} = $props()

	const timeIntervalLabel = $derived(
		`${String(lookbackDayCount)}d`
	)

	const resource = $derived(
		select(
			EntityType.Market,
			market
		).$$marketTimeIntervalTimestamps,
	)


	// Components
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import MarketTimeIntervalTimestampChart from '$/views/charts/Market_TimeInterval_Timestamp.svelte'
</script>


<section
	{id}
	class="market-ohlc-hub"
	data-column="gap-3"
>
	<nav
		aria-label="OHLC lookback"
		data-row="wrap gap-2"
	>
		{#each marketOhlcDayLookbackValues as windowLength (windowLength)}
			<button
				type="button"
				class="interval-tab"
				class:interval-tab-active={
					lookbackDayCount === windowLength
				}
				onclick={() => {
					lookbackDayCount = windowLength
				}}
			>
				{`${String(windowLength)}d`}
			</button>
		{/each}
	</nav>

	<MarketTimeIntervalTimestampChart
		{resource}
		timeInterval={marketOhlcDailyTimeInterval}
		limit={lookbackDayCount}
		title={
			chartTitlePrefix != null ?
				`${chartTitlePrefix} · ${timeIntervalLabel} · USD`
			:
				`${
					market.$base.kind === MarketAssetKind.Coin ?
						market.$base.$coin.coinId
					:
						'Market'
				} · ${timeIntervalLabel} · USD OHLC`
		}
	/>
	<Market_TimeInterval_TimestampsView
		href={resolve('/markets')}
		collapsible
		{resource}
		id={`${id}:candles`}
		open={listOpen}
		timeInterval={marketOhlcDailyTimeInterval}
		limit={lookbackDayCount}
		title={`${candlesListTitle} · ${timeIntervalLabel}`}
	/>
</section>


<style>
	.interval-tab {
		border: 1px solid var(--color-border);
		border-radius: 999px;
		padding: 0.2em 0.75em;
		background: transparent;
		color: inherit;
		cursor: pointer;
		font: inherit;
	}

	.interval-tab-active {
		border-color: color-mix(in oklch, var(--color-accent, var(--color-fg)) 40%, var(--color-border));
		font-weight: 600;
	}
</style>
