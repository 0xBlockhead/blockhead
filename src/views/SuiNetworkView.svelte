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
			label: 'latest checkpoint/epoch/protocol version snapshot',
		},
		{
			label: 'execution environment',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'latest checkpoint/epoch/protocol version snapshot',
				},
				{
					label: 'execution environment',
				},
				'$$accounts',
				'$$objects',
			],
			[
				'$$packages',
				'$$coinTypes',
				'$$transactions',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Checkpoints',
				items: [
					{
						label: 'Sui checkpoint rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Sui transaction rows',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'Sui account rows',
					},
				],
			},
			{
				label: 'Objects',
				items: [
					{
						label: 'Sui object rows',
					},
				],
			},
			{
				label: 'Packages',
				items: [
					{
						label: 'Sui package rows',
					},
				],
			},
			{
				label: 'Coin types',
				items: [
					{
						label: 'Sui coin type rows',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'coin balance observations',
					},
				],
			},
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'timestamped network observations',
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
			id: 'checkpoints',
			label: 'checkpoints',
			field: '$$checkpoints',
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
			id: 'objects',
			label: 'objects',
			field: '$$objects',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'packages',
			label: 'packages',
			field: '$$packages',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'coin-types',
			label: 'coin types',
			field: '$$coinTypes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'coin-balance-timestamps',
			label: 'coin balance timestamps',
			field: '$$coinBalanceTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiNetwork>
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
	entityType={EntityType.SuiNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
