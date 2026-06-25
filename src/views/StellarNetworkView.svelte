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
		{
			label: 'network passphrase',
		},
		{
			label: 'latest network observation',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'network passphrase',
				},
				{
					label: 'latest ledger/protocol observation',
				},
				{
					label: 'base fee/reserve observation',
				},
			],
			[
				{
					label: 'native XLM asset',
				},
				{
					label: 'bounded contract/liquidity-pool/account/transaction windows',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'timestamped network observations',
					},
				],
			},
			{
				label: 'Ledgers',
				items: [
					{
						label: 'Stellar ledger rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Stellar transaction rows',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					{
						label: 'Stellar operation rows',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'Stellar account rows',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'Stellar asset rows',
					},
				],
			},
			{
				label: 'Claimable balances',
				items: [
					{
						label: 'Stellar claimable balance rows',
					},
				],
			},
			{
				label: 'Liquidity pools',
				items: [
					{
						label: 'Stellar liquidity pool rows',
					},
				],
			},
			{
				label: 'Offers',
				items: [
					{
						label: 'Stellar offer rows',
					},
				],
			},
			{
				label: 'Trades',
				items: [
					{
						label: 'Stellar trade rows',
					},
				],
			},
			{
				label: 'Soroban contracts',
				items: [
					{
						label: 'Soroban contract rows',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'ledgers',
			label: 'ledgers',
			field: '$$ledgers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'operations',
			label: 'operations',
			field: '$$operations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'accounts',
			label: 'accounts',
			field: '$$accounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'assets',
			label: 'assets',
			field: '$$assets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'claimable-balances',
			label: 'claimable balances',
			field: '$$claimableBalances',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'contracts',
			label: 'contracts',
			field: '$$contracts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'liquidity-pools',
			label: 'liquidity pools',
			field: '$$liquidityPools',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'offers',
			label: 'offers',
			field: '$$offers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'trades',
			label: 'trades',
			field: '$$trades',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarNetwork>
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
	entityType={EntityType.StellarNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
