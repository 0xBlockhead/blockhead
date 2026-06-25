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
		'$transferState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$transferState',
				'timestampMs',
				'source',
				'confirmations',
				'unlockTime',
				'spent',
				{
					label: 'last checked time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transfer',
				items: [
					{
						label: 'BlockheadMoneroTransferStateView',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'MoneroTransactionView when resolved',
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
				label: 'Subaddress',
				items: [
					{
						label: 'BlockheadMoneroSubaddressStateView',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'monero-wallet-rpc transfer/payment',
					},
					{
						label: 'key-image payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroTransferState_Timestamp>
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
	entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
