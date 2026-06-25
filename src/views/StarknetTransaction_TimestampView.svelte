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
		'$transaction',
		'timestampMs',
		{
			label: 'status',
		},
	],
	content: {
		dl: [
			[
				'$transaction',
				'timestampMs',
				'source',
				'blockNumber',
				'finalityStatus',
			],
			[
				'executionStatus',
				'actualFee',
				'revertReason',
				{
					label: 'message count',
				},
				{
					label: 'event count',
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
						label: 'parent Starknet transaction',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'event rows from this receipt',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'L1/L2 message payloads when decoded',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'starknet_getTransactionReceipt',
					},
					{
						label: 'indexer transaction payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetTransaction_Timestamp>
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
	entityType={EntityType.StarknetTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
