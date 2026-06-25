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
		'walletId',
		'txHash',
		'direction',
	],
	content: {
		dl: [
			[
				'walletId',
				'txHash',
				'direction',
				'amountAtomicUnits',
				'feeAtomicUnits',
			],
			[
				{
					label: 'account/subaddress indexes',
				},
				'paymentId',
				{
					label: 'note presence',
				},
				{
					label: 'key-image presence',
				},
				{
					label: 'first observed timestamp',
				},
			],
			[
				{
					label: 'latest confirmations',
				},
				{
					label: 'latest unlock time',
				},
				{
					label: 'latest spent state',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'BlockheadMoneroTransferState_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadMoneroTransferState_TimestampsView',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'MoneroTransactionView when public tx data is resolved',
					},
				],
			},
			{
				label: 'Subaddress',
				items: [
					{
						label: 'BlockheadMoneroSubaddressStateView',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'BlockheadMoneroOutputState rows for wallet-owned outputs in the tx',
					},
				],
			},
			{
				label: 'Proofs/keys',
				items: [
					{
						label: 'redacted tx key',
					},
					{
						label: 'spend proof',
					},
					{
						label: 'reserve proof',
					},
					{
						label: 'key image material',
					},
				],
			},
			{
				label: 'Notes',
				items: [
					{
						label: 'local tx note',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroTransferState>
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
	entityType={EntityType.BlockheadMoneroTransferState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
