<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'marketKind',
		{
			label: 'venue',
		},
		{
			label: 'latest derivative observation for non-spot markets',
		},
	],
	content: {
		dl: [
			[
				'marketKind',
				{
					label: 'venue id/label',
				},
				{
					label: 'latest derivative observation for non-spot markets',
				},
				{
					label: 'base asset',
				},
				{
					label: 'quote asset',
				},
			],
			[
				{
					label: 'provider exchange id mappings',
				},
				{
					label: 'quote stream count',
				},
				{
					label: 'OHLC interval count',
				},
				{
					label: 'derivative observation count',
				},
				'$$oracleFeeds',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Quote streams',
				items: [
					{
						label: 'MarketPrice rows',
					},
				],
			},
			{
				label: 'OHLC',
				items: [
					{
						label: 'Market_TimeInterval_Timestamp history grouped by interval',
					},
				],
			},
			{
				label: 'Derivative observations',
				items: [
					{
						label: 'Market_Derivative_Timestamp list for non-spot markets',
					},
				],
			},
			{
				label: 'Oracle feeds',
				items: [
					{
						label: 'linked OracleFeed rows',
					},
				],
			},
			{
				label: 'Source mappings',
				items: [
					'providerExchangeIds',
					{
						label: 'provider pair/feed ids stay on timestamp rows',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'market-prices',
			label: 'market prices',
			field: '$$marketPrices',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'market-time-interval-timestamps',
			label: 'market time interval timestamps',
			field: '$$marketTimeIntervalTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'derivative-timestamps',
			label: 'derivative timestamps',
			field: '$$derivativeTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'oracle-feeds',
			label: 'oracle feeds',
			field: '$$oracleFeeds',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Market>
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
	entityType={EntityType.Market}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
