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
			label: 'gateway',
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
					label: 'gateway',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'reachability',
				},
				{
					label: 'online state',
				},
				'version',
				{
					label: 'Lightning alias',
				},
				{
					label: 'routing-fee summary',
				},
				{
					label: 'federation count',
				},
				{
					label: 'Lightning balance',
				},
				{
					label: 'ecash balance',
				},
				{
					label: 'on-chain balance',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Gateway',
				items: [
					{
						label: 'parent Fedimint gateway',
					},
				],
			},
			{
				label: 'Federations',
				items: [
					{
						label: 'federation ids/status known to the gateway',
					},
				],
			},
			{
				label: 'Lightning',
				items: [
					{
						label: 'alias',
					},
					{
						label: 'routing fees',
					},
					{
						label: 'balances',
					},
					'channelsJson',
				],
			},
			{
				label: 'Payments',
				items: [
					'paymentSummaryJson',
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'endpoint',
					},
					{
						label: 'freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintGateway_Timestamp>
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
	entityType={EntityType.FedimintGateway_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
