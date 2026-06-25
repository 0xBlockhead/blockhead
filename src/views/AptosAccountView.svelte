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
		{
			label: 'latest account-state summary',
		},
		{
			label: 'latest native coin balance',
		},
	],
	content: {
		dl: [
			[
				'address',
				{
					label: 'latest sequence/authentication-key summary',
				},
				{
					label: 'latest native coin balance',
				},
				'$$resources',
				'$$modules',
				'$$transactions',
				'$network',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account observations',
				items: [
					{
						label: 'ledger-versioned account auth/state observations',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'coin/fungible-asset balance observations grouped by coin type',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'account resource identities and value observations',
					},
				],
			},
			{
				label: 'Modules',
				items: [
					{
						label: 'published Move modules',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions involving this account when indexed',
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
			id: 'balances',
			label: 'balances',
			field: '$$balances',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'resources',
			label: 'resources',
			field: '$$resources',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'modules',
			label: 'modules',
			field: '$$modules',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AptosAccount>
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
	entityType={EntityType.AptosAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
