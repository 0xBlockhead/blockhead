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
			label: 'subject',
		},
		{
			label: 'payment protocol',
		},
		'required',
	],
	content: {
		dl: [
			[
				{
					label: 'subject kind/selector',
				},
				{
					label: 'payment protocol',
				},
				{
					label: 'timestamp',
				},
				'source',
			],
			[
				'required',
				{
					label: 'HTTP status',
				},
				{
					label: 'request method',
				},
				{
					label: 'resource URL',
				},
			],
			[
				'scheme',
				{
					label: 'asset/network selectors',
				},
				'price',
				{
					label: 'pay-to',
				},
				{
					label: 'facilitator',
				},
				{
					label: 'timeout',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Concrete refs',
				items: [
					{
						label: 'A2A/MCP/EIP-8004/Blockhead refs when known',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'PAYMENT-REQUIRED/PAYMENT-SIGNATURE/PAYMENT-RESPONSE headers',
					},
					{
						label: 'evidence URI',
					},
					{
						label: 'source payload',
					},
				],
			},
			{
				label: 'Payment',
				items: [
					{
						label: 'requirements JSON',
					},
					{
						label: 'payment payload',
					},
					{
						label: 'response payload',
					},
					{
						label: 'asset/network/price/payTo/facilitator',
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
			selection: EntityProxyResource<typeof schema, EntityType.AgentPaymentRequirement_Timestamp>
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
	entityType={EntityType.AgentPaymentRequirement_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
