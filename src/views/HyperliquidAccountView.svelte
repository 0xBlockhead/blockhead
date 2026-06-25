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
		'address',
		'accountRole',
	],
	content: {
		dl: [
			[
				'$network',
				'address',
				'accountRole',
				'$masterAccount',
				'$agentAccount',
			],
			[
				{
					label: 'latest account value',
				},
				{
					label: 'latest withdrawable amount',
				},
				{
					label: 'latest spot balance count',
				},
				{
					label: 'latest open order count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account state',
				items: [
					{
						label: 'timestamped clearinghouse/user-state observations',
					},
				],
			},
			{
				label: 'Orders',
				items: [
					{
						label: 'Hyperliquid order rows',
					},
				],
			},
			{
				label: 'Fills',
				items: [
					{
						label: 'Hyperliquid fill rows',
					},
				],
			},
			{
				label: 'Vault equities',
				items: [
					{
						label: 'timestamped vault equity observations',
					},
				],
			},
			{
				label: 'Master/agent',
				items: [
					{
						label: 'Hyperliquid account role links',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'HyperEVM transactions when source context provides activity',
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
			id: 'orders',
			label: 'orders',
			field: '$$orders',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'fills',
			label: 'fills',
			field: '$$fills',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'vault-equities',
			label: 'vault equities',
			field: '$$vaultEquities',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidAccount>
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
	entityType={EntityType.HyperliquidAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
