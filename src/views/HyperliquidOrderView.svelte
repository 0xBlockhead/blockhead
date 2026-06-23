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
				label: 'account',
			},
			{
				label: 'order id',
			},
			{
				label: 'client order id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'order id',
					},
					{
						label: 'client order id',
					},
					'coin',
					'side',
					{
						label: 'order type',
					},
					{
						label: 'latest status',
					},
					{
						label: 'latest status time',
					},
					{
						label: 'limit price',
					},
					{
						label: 'latest remaining size',
					},
					{
						label: 'original size',
					},
					{
						label: 'trigger condition',
					},
					{
						label: 'reduce-only flag',
					},
					{
						label: 'TIF',
					},
					{
						label: 'timestamp count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest state',
					items: [
						{
							label: 'latest order lifecycle observation',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'timestamped order lifecycle observations',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'parent Hyperliquid account',
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
					label: 'Trigger/TP-SL',
					items: [
						{
							label: 'trigger fields',
						},
						{
							label: 'latest children payload',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'openOrders/frontendOpenOrders/historicalOrders/orderStatus response',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidOrder>
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
	entityType={EntityType.HyperliquidOrder}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
