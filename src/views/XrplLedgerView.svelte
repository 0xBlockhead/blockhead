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
			label: 'ledger index/hash',
		},
		{
			label: 'validation state',
		},
		'closeTimeMs',
	],
	content: {
		dl: [
			[
				'ledgerIndex',
				'ledgerHash',
				{
					label: 'validation state',
				},
				'closeTimeMs',
				'parentHash',
			],
			[
				{
					label: 'total XRP drops',
				},
				'accountHash',
				'transactionHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions in ledger',
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
				label: 'Lookup evidence',
				items: [
					{
						label: 'rippled ledger lookup by index/hash',
					},
					{
						label: 'Clio/XRPScan ledger payload',
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
		{
			id: 'ledger-entries',
			label: 'ledger entries',
			field: '$$ledgerEntries',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplLedger>
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
	entityType={EntityType.XrplLedger}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
