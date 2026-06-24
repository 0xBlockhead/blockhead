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
			label: 'wallet state',
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
					label: 'wallet state',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'wallet height',
				},
				{
					label: 'balance',
				},
				{
					label: 'unlocked balance',
				},
				{
					label: 'multisig import-needed flag',
				},
				{
					label: 'outputs exported time',
				},
				{
					label: 'key images exported time',
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
				label: 'Wallet',
				items: [
					{
						label: 'BlockheadMoneroWalletStateView',
					},
				],
			},
			{
				label: 'Subaddresses',
				items: [
					{
						label: 'BlockheadMoneroSubaddressState list',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'BlockheadMoneroOutputState list',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'BlockheadMoneroTransferState list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'monero-wallet-rpc get_height',
					},
					{
						label: 'get_balance',
					},
					{
						label: 'output export',
					},
					{
						label: 'key-image export/import payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroWalletState_Timestamp>
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
	entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
