<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		route: {
			href: '/network/[caip2]/tx/[txHash]',
		},
		query: {
			sources: [
				'Blockscout_Rest',
				'Voltaire_JsonRpc',
			],
			fields: [
				'kind',
				'value',
				'executionStatus',
				'gasUsed',
				'$block',
				'$from',
				'$to',
				'$contract',
			],
			openFields: [
				'nonce',
				'transactionIndex',
				'gas',
				'gasPrice',
				'envelopeType',
				'maxFeePerGas',
				'maxPriorityFeePerGas',
				'effectiveGasPrice',
				'input',
				'r',
				's',
				'v',
				'blobGasUsed',
				'maxFeePerBlobGas',
				'traceRoot',
				'traceUnavailable',
				'$$blobs',
				'$$logs',
				'$$internalTransfers',
				'$$tokenTransfers',
				'$$userOperations',
			],
			policies: [
				{
					when: {
						selectorPath: 'reference',
						equals: '16661',
					},
					sources: [
						'ZeroGChain_JsonRpc',
					],
				},
			],
		},
		panels: [
			{
				id: 'decode',
				label: 'Decode',
				kind: 'decode',
				slot: 'TransactionDecodePanel',
			},
			{
				id: 'trace',
				label: 'Trace',
				kind: 'tree',
				defer: 'open',
				slot: 'TracePanel',
			},
		],
		decodes: [
			{
				field: 'input',
				kind: 'transactionInput',
				slot: 'EvmTransactionInputDecode',
			},
			{
				field: 'traceRoot',
				kind: 'trace',
				slot: 'EvmTraceTree',
			},
		],
		renderers: [
			{
				slot: 'EvmTransactionInputDecode',
				component: 'EvmTransactionInputDecode',
				label: 'transaction input decode renderer',
				for: 'decode',
			},
			{
				slot: 'EvmTraceTree',
				component: 'EvmTraceTreeView',
				label: 'trace tree renderer',
				for: 'decode',
			},
		],
		summary: {
			value: {
				field: 'txHash',
				format: 'truncated',
			},
			title: [
				{
					label: 'Transaction',
				},
				{
					field: 'txHash',
					format: 'truncated',
				},
			],
		},
		closed: [
			'kind',
			{
				field: 'value',
				format: 'numberValue',
			},
			'executionStatus',
			{
				field: 'gasUsed',
				format: 'numberValue',
			},
			{
				field: '$block',
				referenceDisplay: 'card',
			},
			'$from',
			'$to',
			{
				field: '$contract',
				referenceDisplay: 'card',
			},
		],
		content: {
			dl: [
				[
					'kind',
					{
						field: 'value',
						format: 'numberValue',
					},
					'executionStatus',
					{
						field: 'gasUsed',
						format: 'numberValue',
					},
					{
						field: '$block',
						referenceDisplay: 'card',
					},
					'$from',
					'$to',
					{
						field: '$contract',
						referenceDisplay: 'card',
					},
					{
						field: 'nonce',
						when: 'open',
					},
					{
						field: 'transactionIndex',
						label: 'Position in block',
						when: 'open',
					},
					{
						field: 'gas',
						label: 'Gas limit',
						format: 'numberValue',
						when: 'open',
					},
					{
						field: 'gasPrice',
						format: 'numberValue',
						when: 'open',
					},
					{
						field: 'envelopeType',
						label: 'Transaction envelope type',
						when: 'open',
					},
					{
						field: 'maxFeePerGas',
						format: 'numberValue',
						prefix: 'max ',
						when: 'open',
					},
					{
						field: 'maxPriorityFeePerGas',
						format: 'numberValue',
						prefix: 'priority ',
						when: 'open',
					},
					{
						field: 'effectiveGasPrice',
						format: 'numberValue',
						when: 'open',
					},
					{
						field: 'input',
						format: 'truncated',
						when: 'open',
					},
					{
						field: 'r',
						format: 'truncated',
						prefix: 'r ',
						when: 'open',
					},
					{
						field: 's',
						format: 'truncated',
						prefix: 's ',
						when: 'open',
					},
					{
						field: 'v',
						prefix: 'v ',
						when: 'open',
					},
					{
						field: 'blobGasUsed',
						format: 'numberValue',
						when: 'open',
					},
					{
						field: 'maxFeePerBlobGas',
						format: 'numberValue',
						when: 'open',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Movements',
					items: [
						{
							field: '$$tokenTransfers',
							listDisplay: 'selectorKey',
						},
						{
							field: '$$internalTransfers',
							listDisplay: 'selectorKey',
						},
					],
				},
				{
					label: 'Call',
					items: [
						{
							field: 'input',
							format: 'truncated',
						},
						{
							field: 'traceRoot',
							format: 'json',
						},
					],
				},
				{
					label: 'Events',
					items: [
						{
							field: '$$logs',
							listDisplay: 'selectorKey',
						},
					],
				},
				{
					label: 'Trace',
					items: [
						'traceRoot',
						'traceUnavailable',
					],
				},
				{
					label: 'Blobs',
					items: [
						{
							field: '$$blobs',
							listDisplay: 'selectorKey',
							ifNonEmpty: true,
						},
					],
				},
				{
					label: 'User operations',
					items: [
						{
							field: '$$userOperations',
							listDisplay: 'selectorKey',
							ifNonEmpty: true,
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		layout = view.layout === undefined ? undefined : EntityLayout[view.layout],
		open = $bindable(view.defaultOpen ?? true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmTransaction>
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
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
	{layout}
	bind:open
	{...EntityViewProps}
	{view}
/>
