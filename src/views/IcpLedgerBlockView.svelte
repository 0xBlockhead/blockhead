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
		'$ledger',
		'blockIndex',
		'blockHash',
	],
	content: {
		dl: [
			[
				'$ledger',
				'blockIndex',
				'blockHash',
				'parentHash',
				{
					label: 'timestamp',
				},
				{
					label: 'archive canister',
				},
				'transactionCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ledger',
				items: [
					{
						label: 'parent ICP ledger canister',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'ledger transactions in this block',
					},
				],
			},
			{
				label: 'Archive canister',
				items: [
					{
						label: 'resolved archive canister when archive id is present',
					},
				],
			},
			{
				label: 'Rosetta operations',
				items: [
					{
						label: 'Rosetta operation payloads when sourced',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'ledger block/archive payload',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpLedgerBlock>
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
	entityType={EntityType.IcpLedgerBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
