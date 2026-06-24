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
			label: 'order record id',
		},
		'source',
		{
			label: 'order id',
		},
		{
			label: 'latest status',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'order record id',
				},
				'source',
				{
					label: 'order id',
				},
				{
					label: 'provider protocol',
				},
				{
					label: 'submitted time',
				},
				{
					label: 'signature hash',
				},
				{
					label: 'order payload hash',
				},
				{
					label: 'latest status',
				},
				{
					label: 'latest fill tx',
				},
				{
					label: 'latest claim tx',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Quote',
				items: [
					{
						label: 'BlockheadIntentQuoteView when linked',
					},
				],
			},
			{
				label: 'Status history',
				items: [
					{
						label: 'BlockheadIntentOrder_Timestamp list',
					},
				],
			},
			{
				label: 'Session action',
				items: [
					{
						label: 'BlockheadSessionActionView when linked',
					},
				],
			},
			{
				label: 'Order summary',
				items: [
					{
						label: 'signed provider/order-server payload summary',
					},
					{
						label: 'raw order retained only when needed',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentOrder>
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
	entityType={EntityType.BlockheadIntentOrder}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
