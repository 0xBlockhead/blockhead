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
		'$payment',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$payment',
				'timestampMs',
				'source',
				'status',
				'feeMsat',
				'failureReason',
				{
					label: 'preimage status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Payment',
				items: [
					{
						label: 'parent local payment',
					},
				],
			},
			{
				label: 'Local node',
				items: [
					{
						label: 'connected Lightning node state',
					},
				],
			},
			{
				label: 'Invoice',
				items: [
					{
						label: 'linked local invoice when resolved',
					},
				],
			},
			{
				label: 'Result',
				items: [
					'status',
					'feeMsat',
					'failureReason',
					'preimage',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'LND listpayments',
					},
					{
						label: 'trackpayment',
					},
					{
						label: 'or payment subscription payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningPayment_Timestamp>
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
	entityType={EntityType.BlockheadLightningPayment_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
