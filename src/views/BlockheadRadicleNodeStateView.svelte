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
		'connectionId',
		'nodeId',
		'did',
	],
	content: {
		dl: [
			[
				'connectionId',
				'nodeId',
				'did',
				'publicKey',
				'homePath',
			],
			[
				{
					label: 'latest alias',
				},
				{
					label: 'latest address counts',
				},
				{
					label: 'latest node version',
				},
				{
					label: 'latest policy',
				},
				'$$peers',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped connected-node profile/config observations',
					},
				],
			},
			{
				label: 'Peers',
				items: [
					{
						label: 'locally observed peer rows',
					},
				],
			},
			{
				label: 'Inventory',
				items: [
					{
						label: 'timestamped inventory/gossip observations',
					},
				],
			},
			{
				label: 'Seed observations',
				items: [
					{
						label: 'repository seeding/advertisement observations',
					},
				],
			},
			{
				label: 'Sync sessions',
				items: [
					{
						label: 'local sync/fetch sessions',
					},
				],
			},
			{
				label: 'Local storage',
				items: [
					'homePath',
					{
						label: 'redacted local-node config',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'peers',
			label: 'peers',
			field: '$$peers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'inventory-timestamps',
			label: 'inventory timestamps',
			field: '$$inventoryTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'seed-observations',
			label: 'seed observations',
			field: '$$seedObservations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'sync-sessions',
			label: 'sync sessions',
			field: '$$syncSessions',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleNodeState>
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
	entityType={EntityType.BlockheadRadicleNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
