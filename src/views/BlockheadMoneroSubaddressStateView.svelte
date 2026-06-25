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
		'accountIndex',
		'addressIndex',
	],
	content: {
		dl: [
			[
				'walletId',
				'accountIndex',
				'addressIndex',
				'address',
				'label',
			],
			[
				{
					label: 'latest used flag',
				},
				{
					label: 'latest balance',
				},
				{
					label: 'latest unlocked balance',
				},
				{
					label: 'latest unspent output count',
				},
				{
					label: 'latest unlock timing',
				},
			],
			[
				{
					label: 'latest sync time',
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
						label: 'BlockheadMoneroSubaddressState_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadMoneroSubaddressState_TimestampsView',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'MoneroNetworkView',
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
			{
				label: 'Outputs',
				items: [
					{
						label: 'BlockheadMoneroOutputState list filtered to account/subaddress',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'BlockheadMoneroTransferState list filtered to account/subaddress',
					},
				],
			},
			{
				label: 'Address material',
				items: [
					{
						label: 'redacted local address/export data',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroSubaddressState>
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
	entityType={EntityType.BlockheadMoneroSubaddressState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
