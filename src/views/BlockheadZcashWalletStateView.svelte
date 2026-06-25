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
		'$network',
		'accountIndex',
	],
	content: {
		dl: [
			[
				'walletId',
				'$network',
				'accountIndex',
				'unifiedAddress',
				{
					label: 'transparent/Sapling/Orchard address availability',
				},
			],
			[
				'birthdayHeight',
				{
					label: 'latest total balance',
				},
				{
					label: 'latest spendable balance',
				},
				{
					label: 'latest verified balance',
				},
				{
					label: 'latest scan height',
				},
			],
			[
				{
					label: 'latest recovery state',
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
						label: 'latest wallet-state observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped wallet-state observations',
					},
				],
			},
			{
				label: 'Viewing keys',
				items: [
					{
						label: 'local Zcash viewing keys',
					},
				],
			},
			{
				label: 'Notes',
				items: [
					{
						label: 'local Zcash note states grouped by pool',
					},
				],
			},
			{
				label: 'Pools',
				items: [
					{
						label: 'Sapling/Orchard balance summaries from wallet timestamp fields',
					},
				],
			},
			{
				label: 'Transparent state',
				items: [
					{
						label: 'linked UTXO address/transaction rows when resolved',
					},
				],
			},
			{
				label: 'Recovery',
				items: [
					{
						label: 'local scan/recovery status',
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
		{
			id: 'viewing-keys',
			label: 'viewing keys',
			field: '$$viewingKeys',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'notes',
			label: 'notes',
			field: '$$notes',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashWalletState>
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
	entityType={EntityType.BlockheadZcashWalletState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
