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
		{
			label: 'latest level',
		},
		{
			label: 'protocol hash',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked base Network',
				},
				{
					label: 'latest level',
				},
				{
					label: 'protocol hash',
				},
				{
					label: 'cycle',
				},
				{
					label: 'total supply',
				},
			],
			[
				{
					label: 'active baker count',
				},
				'$$tokens',
				{
					label: 'indexer lag',
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
						label: 'Tezos block rows',
					},
				],
			},
			{
				label: 'Operation groups',
				items: [
					{
						label: 'operation group rows',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					{
						label: 'Tezos operation rows',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'Tezos account rows',
					},
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'Tezos contract rows',
					},
				],
			},
			{
				label: 'Bakers',
				items: [
					{
						label: 'Tezos baker rows',
					},
				],
			},
			{
				label: 'Cycles/rights',
				items: [
					{
						label: 'cycle rows',
					},
					{
						label: 'baking right rows',
					},
				],
			},
			{
				label: 'Tokens',
				items: [
					{
						label: 'token rows',
					},
					{
						label: 'token transfer rows',
					},
				],
			},
			{
				label: 'Network history',
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
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'operation-groups',
			label: 'operation groups',
			field: '$$operationGroups',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			id: 'accounts',
			label: 'accounts',
			field: '$$accounts',
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
			id: 'bakers',
			label: 'bakers',
			field: '$$bakers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'cycles',
			label: 'cycles',
			field: '$$cycles',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'baking-rights',
			label: 'baking rights',
			field: '$$bakingRights',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosNetwork>
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
	entityType={EntityType.TezosNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
