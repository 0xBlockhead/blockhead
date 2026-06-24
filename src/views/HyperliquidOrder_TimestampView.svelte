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
		{
			label: 'order',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'order',
				},
				{
					label: 'observation time',
				},
				'source',
				'status',
				{
					label: 'status time',
				},
				'size',
				{
					label: 'filled size',
				},
				{
					label: 'remaining size',
				},
				{
					label: 'latest fill id',
				},
				{
					label: 'child count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Order',
				items: [
					{
						label: 'parent Hyperliquid order',
					},
				],
			},
			{
				label: 'Fills',
				items: [
					{
						label: 'fills filtered by order id',
					},
				],
			},
			{
				label: 'Children/TP-SL',
				items: [
					{
						label: 'child order payload JSON',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw openOrders/frontendOpenOrders/historicalOrders/orderStatus payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidOrder_Timestamp>
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
	entityType={EntityType.HyperliquidOrder_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
