<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	charts: [
		{
			id: 'quotes',
			label: 'Quote history',
			kind: 'timeseries',
			controls: {
				lookbackDays: [
					1,
					7,
					30,
					90,
				],
			},
			slot: 'QuoteHistoryChart',
		},
	],
	closed: [
		'$market',
		'$$quotes',
	],
	content: {
		dl: [
			[
				'$market',
				'$$quotes',
				'$$quotes',
			],
			[
				'$parentMarket',
				{
					label: 'base asset',
				},
				{
					label: 'quote asset',
				},
				{
					label: 'venue',
				},
				{
					label: 'market kind',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest quote',
				items: [
					{
						label: 'head Market_Timestamp',
					},
				],
			},
			{
				label: 'Quote history',
				items: [
					{
						label: 'Market_Timestamp list sorted by timestampMs',
					},
				],
			},
			{
				label: 'Market',
				items: [
					'$parentMarket',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'provider feed mappings and quote payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'quotes',
			label: 'quotes',
			field: '$$quotes',
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
			selection: EntityProxyResource<typeof schema, EntityType.MarketPrice>
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
	entityType={EntityType.MarketPrice}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
