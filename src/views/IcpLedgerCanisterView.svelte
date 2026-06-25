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
		'$canister',
		{
			label: 'standard',
		},
		{
			label: 'latest symbol',
		},
	],
	content: {
		dl: [
			[
				'$canister',
				{
					label: 'standard',
				},
				{
					label: 'latest symbol',
				},
				{
					label: 'latest name',
				},
				{
					label: 'decimals',
				},
			],
			[
				{
					label: 'fee',
				},
				{
					label: 'archive count',
				},
				{
					label: 'latest block index',
				},
				{
					label: 'account observation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ledger state history',
				items: [
					{
						label: 'timestamped ledger metadata/archive observations',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'ledger-local block rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'ledger transaction rows',
					},
				],
			},
			{
				label: 'Account balances',
				items: [
					{
						label: 'account balance observations',
					},
				],
			},
			{
				label: 'Archive canisters',
				items: [
					{
						label: 'canister refs from latest timestamp',
					},
				],
			},
			{
				label: 'Methods',
				items: [
					{
						label: 'canister method rows exposed by ledger interface',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'ledger metadata',
					},
					{
						label: 'supported-standard payloads',
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
			id: 'account-timestamps',
			label: 'account timestamps',
			field: '$$accountTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpLedgerCanister>
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
	entityType={EntityType.IcpLedgerCanister}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
