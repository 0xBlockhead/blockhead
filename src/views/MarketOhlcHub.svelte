<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { EntityId } from '$/schema/$schema.ts'

	import {
		coingeckoOhlcDayWindowLengths,
		MarketAssetKind,
		MarketTimeIntervalUnit,
	} from '$/constants/Market.ts'

	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		id,
		market,
		timeInterval = $bindable(
			{
				unit: MarketTimeIntervalUnit.Day,
				value: 7,
			},
		),
		listOpen = false,
		chartTitlePrefix,
		candlesListTitle = 'OHLC candles',
	}: {
		id: string
		market: EntityId<typeof schema, EntityType.Market>
		timeInterval?: {
			unit: MarketTimeIntervalUnit
			value: number
		}
		listOpen?: boolean
		/** When set (e.g. on coin detail), omits repeating the coin id in chart chrome. */
		chartTitlePrefix?: string
		candlesListTitle?: string
	} = $props()


	const timeIntervalLabel = $derived(
		timeInterval.unit === MarketTimeIntervalUnit.Day ?
			`${String(timeInterval.value)}d`
		: timeInterval.unit === MarketTimeIntervalUnit.Hour ?
			`${String(timeInterval.value)}h`
		: timeInterval.unit === MarketTimeIntervalUnit.Minute ?
			`${String(timeInterval.value)}m`
		: timeInterval.unit === MarketTimeIntervalUnit.Second ?
			`${String(timeInterval.value)}s`
		:
			`${String(timeInterval.value)}`
	)

	const entityFieldReference = $derived(
		({
			entityType: EntityType.Market,
			entityId: market,
			fieldName: '$$marketTimeIntervalTimestamps',
		}) satisfies EntityFieldReference<
			typeof schema,
			EntityType.Market_TimeInterval_Timestamp
		>,
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
		aria-label="OHLC interval"
		data-row="wrap gap-2"
	>
		{#each coingeckoOhlcDayWindowLengths as windowLength (windowLength)}
			<button
				type="button"
				class="interval-tab"
				class:interval-tab-active={
					timeInterval.unit === MarketTimeIntervalUnit.Day
					&& timeInterval.value === windowLength
				}
				onclick={() => {
					timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value: windowLength,
						}
					)
				}}
			>
				{`${String(windowLength)}d`}
			</button>
		{/each}
	</nav>

	<MarketTimeIntervalTimestampChart
		entityFieldReference={entityFieldReference}
		{timeInterval}
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
		entityFieldReference={entityFieldReference}
		id={`${id}:candles`}
		open={listOpen}
		{timeInterval}
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
