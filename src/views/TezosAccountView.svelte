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
		'address',
		'accountKind',
		{
			label: 'public key/revealed state',
		},
	],
	content: {
		dl: [
			[
				'address',
				'accountKind',
				{
					label: 'public key/revealed state',
				},
				{
					label: 'latest balance',
				},
				{
					label: 'counter',
				},
			],
			[
				{
					label: 'delegate',
				},
				{
					label: 'token balance count',
				},
				'$$tokenTransfers',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operations',
				items: [
					{
						label: 'Tezos operations involving this account',
					},
				],
			},
			{
				label: 'Token balances',
				items: [
					{
						label: 'token balance observations grouped by token',
					},
				],
			},
			{
				label: 'Token transfers',
				items: [
					{
						label: 'token transfer rows',
					},
				],
			},
			{
				label: 'Delegation/baker',
				items: [
					{
						label: 'Tezos baker when delegate/baker identity resolves',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'Tezos contract for originated accounts',
					},
				],
			},
			{
				label: 'Account history',
				items: [
					{
						label: 'level/source account-state observations',
					},
				],
			},
		],
	},
	lists: [
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
			id: 'token-balance-timestamps',
			label: 'token balance timestamps',
			field: '$$tokenBalanceTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosAccount>
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
	entityType={EntityType.TezosAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
