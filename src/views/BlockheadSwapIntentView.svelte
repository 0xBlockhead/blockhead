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
			label: 'session action',
		},
		{
			label: 'network',
		},
		{
			label: 'asset in/out',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'session action',
				},
				{
					label: 'action selected protocol',
				},
				{
					label: 'network CAIP-2',
				},
				{
					label: 'asset CAIP-19 in/out',
				},
				{
					label: 'EVM chain id/raw token addresses',
				},
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
						label: 'SwapQuote_Timestamp for executable router/aggregator quotes',
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
						label: 'simulation rows when linked',
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
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSwapIntent>
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
	entityType={EntityType.BlockheadSwapIntent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
