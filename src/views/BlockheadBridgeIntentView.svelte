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
		'$sessionAction',
		{
			label: 'from/to networks',
		},
		{
			label: 'asset',
		},
	],
	content: {
		dl: [
			[
				'$sessionAction',
				{
					label: 'action selected protocol',
				},
				{
					label: 'from/to CAIP-2',
				},
				{
					label: 'asset CAIP-19 values',
				},
				{
					label: 'EVM chain ids/raw token addresses',
				},
			],
			[
				'coinId',
				{
					label: 'resolved network/token refs',
				},
				'amount',
				'slippage',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Session action',
				items: [
					{
						label: 'BlockheadSessionActionView',
					},
				],
			},
			{
				label: 'Readiness',
				items: [
					{
						label: 'BlockheadActionReadinessCheck list',
					},
				],
			},
			{
				label: 'Intent quotes',
				items: [
					{
						label: 'BlockheadIntentQuote list for signed-order/filler-market protocols',
					},
				],
			},
			{
				label: 'Route quotes',
				items: [
					{
						label: 'BridgeRouteQuote_Timestamp for executable route quotes',
					},
				],
			},
			{
				label: 'Execution',
				items: [
					{
						label: 'orders',
					},
					{
						label: 'wallet requests',
					},
					{
						label: 'bridge transfer rows when source-proven',
					},
				],
			},
			{
				label: 'Outcomes',
				items: [
					{
						label: 'BlockheadActionOutcome list',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBridgeIntent>
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
	entityType={EntityType.BlockheadBridgeIntent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
