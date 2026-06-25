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
			label: 'linked base Network',
		},
		'shard',
		'realm',
	],
	content: {
		dl: [
			[
				{
					label: 'linked base Network',
				},
				'shard',
				'realm',
				{
					label: 'latest consensus timestamp',
				},
				{
					label: 'latest block number',
				},
			],
			[
				'$$nodes',
				{
					label: 'mirror-node lag',
				},
				{
					label: 'latest fee/exchange/stake/supply snapshots',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'Hedera block rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Hedera transaction rows',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'Hedera account rows',
					},
				],
			},
			{
				label: 'HTS tokens',
				items: [
					{
						label: 'Hedera token rows',
					},
				],
			},
			{
				label: 'NFTs',
				items: [
					{
						label: 'Hedera NFT serial rows',
					},
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'Hedera contract rows',
					},
				],
			},
			{
				label: 'Consensus topics',
				items: [
					{
						label: 'Hedera consensus topic rows',
					},
				],
			},
			{
				label: 'Schedules',
				items: [
					{
						label: 'Hedera schedule rows',
					},
				],
			},
			{
				label: 'Nodes',
				items: [
					{
						label: 'Hedera node rows',
					},
				],
			},
			{
				label: 'Network observations',
				items: [
					{
						label: 'timestamped head/count/fee/exchange/stake/supply observations',
					},
				],
			},
		],
	},
	lists: [
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
			id: 'tokens',
			label: 'tokens',
			field: '$$tokens',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'nfts',
			label: 'nfts',
			field: '$$nfts',
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
			id: 'topics',
			label: 'topics',
			field: '$$topics',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'schedules',
			label: 'schedules',
			field: '$$schedules',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'nodes',
			label: 'nodes',
			field: '$$nodes',
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
		{
			id: 'fee-timestamps',
			label: 'fee timestamps',
			field: '$$feeTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'exchange-rate-timestamps',
			label: 'exchange rate timestamps',
			field: '$$exchangeRateTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'stake-timestamps',
			label: 'stake timestamps',
			field: '$$stakeTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'supply-timestamps',
			label: 'supply timestamps',
			field: '$$supplyTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetwork>
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
	entityType={EntityType.HederaNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
