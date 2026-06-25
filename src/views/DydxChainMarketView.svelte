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
		'ticker',
		{
			label: 'base/quote assets',
		},
		{
			label: 'latest oracle price',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'ticker',
				'baseAsset',
				'quoteAsset',
				'marketKind',
			],
			[
				{
					label: 'latest oracle price',
				},
				{
					label: 'latest open interest',
				},
				{
					label: 'latest status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Market observations',
				items: [
					{
						label: 'timestamped market state observations',
					},
				],
			},
			{
				label: 'Orders',
				items: [
					{
						label: 'dYdX orders when indexed',
					},
				],
			},
			{
				label: 'Positions',
				items: [
					{
						label: 'perpetual position observations',
					},
				],
			},
			{
				label: 'Trades/fills/funding',
				items: [
					{
						label: 'source-window rows only when concrete identifiers are modeled',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent dYdX Chain network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'dYdX indexer perpetual markets payload keyed by ticker',
					},
					{
						label: 'validator app-state/query evidence',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainMarket>
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
	entityType={EntityType.DydxChainMarket}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
