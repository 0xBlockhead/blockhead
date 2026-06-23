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
				label: 'transaction',
			},
			'result',
			{
				label: 'fee',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					'result',
					{
						label: 'fee',
					},
					{
						label: 'contract address',
					},
					{
						label: 'energy usage',
					},
					{
						label: 'total energy',
					},
					{
						label: 'energy fee',
					},
					{
						label: 'net usage',
					},
					{
						label: 'net fee',
					},
					{
						label: 'log count',
					},
					{
						label: 'internal transaction count',
					},
					{
						label: 'result-message status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent transaction',
						},
					],
				},
				{
					label: 'Resource usage',
					items: [
						{
							label: 'energy/net/fee fields',
						},
					],
				},
				{
					label: 'Logs',
					items: [
						{
							label: 'event log summaries when decoded rows exist',
						},
					],
				},
				{
					label: 'Internal transactions',
					items: [
						{
							label: 'internal transfer/call summaries when modeled',
						},
					],
				},
				{
					label: 'Contract result',
					items: [
						{
							label: 'contractResultHex/resMessageHex payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronTransactionReceipt>
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
	entityType={EntityType.TronTransactionReceipt}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
