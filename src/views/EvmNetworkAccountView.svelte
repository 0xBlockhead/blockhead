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
			label: 'icon/name from actor ENS/blockie',
		},
		{
			label: 'network icon',
		},
		{
			label: 'address on network',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'icon/name from actor ENS/blockie',
				},
				{
					label: 'network icon',
				},
				{
					label: 'address on network',
				},
				{
					label: 'latest activity/count/contract summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account observations',
				items: [
					{
						label: 'timestamped account activity/count observations',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'network actor coin balances',
					},
				],
			},
			{
				label: 'Activity',
				items: [
					'$$transactions',
					'$$tokenTransfers',
					'$$internalTransfers',
				],
			},
			{
				label: 'Allowances',
				items: [
					{
						label: 'known ERC-20 allowance identities',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'linked contract row when code/source evidence resolves',
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
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'token-transfers',
			label: 'token transfers',
			field: '$$tokenTransfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'internal-transfers',
			label: 'internal transfers',
			field: '$$internalTransfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'owned-coins',
			label: 'owned coins',
			field: '$$ownedCoins',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'erc20-token-allowances',
			label: 'erc20 token allowances',
			field: '$$erc20TokenAllowances',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount>
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
	entityType={EntityType.EvmNetworkAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
