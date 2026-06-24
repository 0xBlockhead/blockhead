<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	panels: [
		{
			id: 'chart',
			label: 'Chart',
			kind: 'chart',
			slot: 'OhlcChart',
		},
	],
	charts: [
		{
			id: 'ohlc',
			label: 'OHLC history',
			kind: 'ohlc',
			x: 'timestampMs',
			y: 'close',
			controls: {
				lookbackDays: [
					1,
					7,
					30,
					90,
					365,
				],
				intervals: [
					'1m',
					'5m',
					'1h',
					'1d',
				],
			},
			slot: 'OhlcChart',
		},
	],
	closed: [
		{
			label: 'market',
		},
		{
			label: 'parent market',
		},
		{
			label: 'interval',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'market',
				},
				{
					label: 'parent market',
				},
				{
					label: 'interval',
				},
				{
					label: 'interval start',
				},
				'open',
				'high',
				'low',
				'close',
				'volume',
				{
					label: 'quote volume',
				},
				{
					label: 'trade count',
				},
				{
					label: 'VWAP',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Market',
				items: [
					{
						label: 'Market',
					},
				],
			},
			{
				label: 'Candle',
				items: [
					'open',
					'high',
					'low',
					'close',
					{
						label: 'interval start',
					},
				],
			},
			{
				label: 'Volume',
				items: [
					'volume',
					{
						label: 'quote volume',
					},
					{
						label: 'trade count',
					},
					{
						label: 'VWAP',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'Market_TimeInterval_Timestamp list grouped by interval',
					},
				],
			},
			{
				label: 'Data provenance',
				items: [
					{
						label: 'observing provider on row metadata',
					},
					{
						label: 'provider OHLC/OHLCV feed',
					},
					{
						label: 'provider asset mapping',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Market_TimeInterval_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.Market_TimeInterval_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
