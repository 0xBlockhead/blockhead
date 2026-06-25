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
			label: 'latest round/protocol/genesis snapshot',
		},
		{
			label: 'catchpoint',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'latest round/protocol/genesis snapshot',
				},
				{
					label: 'catchpoint',
				},
				{
					label: 'native ALGO asset',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Rounds',
				items: [
					{
						label: 'ledger round rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'network transaction rows',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'account rows',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'ASA rows',
					},
				],
			},
			{
				label: 'Applications',
				items: [
					{
						label: 'application rows',
					},
				],
			},
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'source-local algod/indexer status observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'rounds',
			label: 'rounds',
			field: '$$rounds',
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
			id: 'assets',
			label: 'assets',
			field: '$$assets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'applications',
			label: 'applications',
			field: '$$applications',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandNetwork>
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
	entityType={EntityType.AlgorandNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
