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
			label: 'linked Cosmos network',
		},
		{
			label: 'latest block/indexer height',
		},
		'$$markets',
	],
	content: {
		dl: [
			[
				{
					label: 'linked Cosmos network',
				},
				{
					label: 'latest block height',
				},
				{
					label: 'latest indexer height',
				},
				'$$markets',
				'$$subaccounts',
				{
					label: 'open order count',
				},
				{
					label: 'open position count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network observations',
				items: [
					{
						label: 'timestamped dYdX Chain status/coverage observations',
					},
				],
			},
			{
				label: 'Markets',
				items: [
					{
						label: 'dYdX market rows',
					},
				],
			},
			{
				label: 'Subaccounts',
				items: [
					{
						label: 'dYdX subaccount rows',
					},
				],
			},
			{
				label: 'Orders',
				items: [
					{
						label: 'dYdX order rows',
					},
				],
			},
			{
				label: 'Positions',
				items: [
					{
						label: 'perpetual position observations',
					},
				],
			},
			{
				label: 'Cosmos base',
				items: [
					{
						label: 'underlying Cosmos network row',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'dYdX indexer status/height',
					},
					{
						label: 'validator Cosmos SDK node status',
					},
					{
						label: 'app-state query support',
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
			id: 'markets',
			label: 'markets',
			field: '$$markets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'subaccounts',
			label: 'subaccounts',
			field: '$$subaccounts',
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
			id: 'positions',
			label: 'positions',
			field: '$$positions',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainNetwork>
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
	entityType={EntityType.DydxChainNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
