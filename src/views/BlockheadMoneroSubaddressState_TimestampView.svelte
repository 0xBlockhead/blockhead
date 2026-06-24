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
			label: 'subaddress state',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'subaddress state',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'used flag',
				},
				{
					label: 'balance',
				},
				{
					label: 'unlocked balance',
				},
				{
					label: 'unspent output count',
				},
				{
					label: 'blocks to unlock',
				},
				{
					label: 'time to unlock',
				},
				{
					label: 'last synced time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subaddress',
				items: [
					{
						label: 'BlockheadMoneroSubaddressStateView',
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
				label: 'Source evidence',
				items: [
					{
						label: 'monero-wallet-rpc get_balance',
					},
					{
						label: 'transfer scan payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroSubaddressState_Timestamp>
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
	entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
