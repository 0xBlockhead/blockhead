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
			'txHash',
		],
		content: {
			dl: [
				[
					'txHash',
					'envelopeType',
					'kind',
					'value',
					'nonce',
					'transactionIndex',
					'gas',
					'gasPrice',
					'gasUsed',
					'cumulativeGasUsed',
					'effectiveGasPrice',
					'maxFeePerGas',
					'maxPriorityFeePerGas',
					'maxFeePerBlobGas',
					'blobGasUsed',
					'input',
					'r',
					's',
					'v',
					'executionStatus',
					'traceRoot',
					'traceUnavailable',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'blobs',
					when: 'open',
					items: [
						'$$blobs',
					],
				},
				{
					label: 'logs',
					when: 'open',
					items: [
						'$$logs',
					],
				},
				{
					label: 'internal transfers',
					when: 'open',
					items: [
						'$$internalTransfers',
					],
				},
				{
					label: 'token transfers',
					when: 'open',
					items: [
						'$$tokenTransfers',
					],
				},
				{
					label: 'user operations',
					when: 'open',
					items: [
						'$$userOperations',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTransaction>
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
	entityType={EntityType.EvmTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
