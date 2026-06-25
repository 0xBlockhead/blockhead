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
		'outputIndex',
	],
	content: {
		dl: [
			[
				'walletId',
				'txHash',
				'outputIndex',
				{
					label: 'account/subaddress indexes',
				},
				'amountAtomicUnits',
			],
			[
				{
					label: 'key-image presence',
				},
				'globalOutputIndex',
				{
					label: 'latest spent/unlocked state',
				},
				{
					label: 'latest confirmations',
				},
				{
					label: 'latest export height',
				},
			],
			[
				{
					label: 'latest checked time',
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
						label: 'BlockheadMoneroOutputState_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadMoneroOutputState_TimestampsView',
					},
				],
			},
			{
				label: 'Public output',
				items: [
					{
						label: 'MoneroStealthOutputView when resolved',
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
				label: 'Transfer',
				items: [
					{
						label: 'BlockheadMoneroTransferState rows for the tx',
					},
				],
			},
			{
				label: 'Key image',
				items: [
					{
						label: 'redacted key image/signature',
					},
					{
						label: 'import/export status',
					},
				],
			},
			{
				label: 'Wallet',
				items: [
					{
						label: 'BlockheadMoneroWalletStateView',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroOutputState>
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
	entityType={EntityType.BlockheadMoneroOutputState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
