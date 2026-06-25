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
			label: 'classic address',
		},
		{
			label: 'latest XRP balance/owner count/sequence snapshot',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'classic address',
				},
				{
					label: 'latest XRP balance/owner count/sequence snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ledger entries',
				items: [
					{
						label: 'ledger objects for account',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'account transactions',
					},
				],
			},
			{
				label: 'Trust lines',
				items: [
					'$$trustlines',
				],
			},
			{
				label: 'Account snapshots',
				items: [
					{
						label: 'ledger-indexed account observations',
					},
				],
			},
		],
	},
	lists: [
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
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'trustlines',
			label: 'trustlines',
			field: '$$trustlines',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplAccount>
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
	entityType={EntityType.XrplAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
