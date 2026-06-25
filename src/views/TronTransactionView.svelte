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
		'$network',
		'transactionId',
		{
			label: 'block ref/height',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'transactionId',
				{
					label: 'block ref/height',
				},
				'timestampMs',
				{
					label: 'expiration',
				},
			],
			[
				'contractType',
				'result',
				{
					label: 'fee',
				},
				'$owner',
				{
					label: 'recipient',
				},
			],
			[
				'$contract',
				{
					label: 'amount',
				},
				'assetName',
				{
					label: 'raw data hash/hex summary',
				},
				'signatures',
			],
			[
				{
					label: 'receipt status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Receipt',
				items: [
					{
						label: 'execution receipt/resource row',
					},
				],
			},
			{
				label: 'Token transfers',
				items: [
					{
						label: 'indexed token transfer effects',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing block',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					'$owner',
				],
			},
			{
				label: 'Recipient',
				items: [
					{
						label: 'recipient account',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'called or created contract',
					},
				],
			},
			{
				label: 'Raw/signatures',
				items: [
					'rawDataHex',
					'signatures',
				],
			},
		],
	},
	lists: [
		{
			id: 'token-transfers',
			label: 'token transfers',
			field: '$$tokenTransfers',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronTransaction>
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
	entityType={EntityType.TronTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
