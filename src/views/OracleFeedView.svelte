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
		'$network',
		{
			label: 'feed address',
		},
		{
			label: 'mapped market',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'feed address',
				},
				{
					label: 'mapped market',
				},
				'label',
				'feedKind',
				{
					label: 'latest decimals/description',
				},
				{
					label: 'latest round id when available',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest config',
				items: [
					{
						label: 'latest proxy/aggregator config observation',
					},
				],
			},
			{
				label: 'Config history',
				items: [
					{
						label: 'timestamped proxy/aggregator config observations',
					},
				],
			},
			{
				label: 'Rounds',
				items: [
					{
						label: 'oracle round observations',
					},
				],
			},
			{
				label: 'Market mapping',
				items: [
					{
						label: 'mapped market row',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'EVM contract for proxy feed address',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Chainlink address catalog',
					},
					{
						label: 'AggregatorV3Interface reads',
					},
					{
						label: 'explorer log/indexer claims',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'rounds',
			label: 'rounds',
			field: '$$rounds',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			selection: EntityProxyResource<typeof schema, EntityType.OracleFeed>
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
	entityType={EntityType.OracleFeed}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
