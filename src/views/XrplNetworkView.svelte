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
			label: 'latest validated ledger/range snapshot',
		},
		{
			label: 'load factor',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'latest validated ledger/range snapshot',
				},
				{
					label: 'load factor',
				},
				{
					label: 'peer count',
				},
				{
					label: 'native XRP asset',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ledgers',
				items: [
					{
						label: 'validated ledgers',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'ledger transactions',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'XRPL accounts',
					},
				],
			},
			{
				label: 'Ledger entries',
				items: [
					{
						label: 'ledger object entries',
					},
				],
			},
			{
				label: 'Amendments',
				items: [
					{
						label: 'amendment feature gates',
					},
				],
			},
			{
				label: 'AMMs',
				items: [
					{
						label: 'AMM ledger objects',
					},
				],
			},
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'node/network observations',
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
			id: 'accounts',
			label: 'accounts',
			field: '$$accounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'ledger-entries',
			label: 'ledger entries',
			field: '$$ledgerEntries',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'amendments',
			label: 'amendments',
			field: '$$amendments',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'amms',
			label: 'amms',
			field: '$$amms',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplNetwork>
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
	entityType={EntityType.XrplNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
