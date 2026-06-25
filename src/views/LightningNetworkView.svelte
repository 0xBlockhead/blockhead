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
		'name',
		'$settlementNetwork',
		{
			label: 'latest graph snapshot',
		},
	],
	content: {
		dl: [
			[
				'name',
				'$settlementNetwork',
				{
					label: 'latest graph snapshot',
				},
				{
					label: 'connected local node count',
				},
				{
					label: 'public node count',
				},
				{
					label: 'public channel count',
				},
				{
					label: 'total capacity',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Graph nodes',
				items: [
					{
						label: 'public Lightning node rows',
					},
				],
			},
			{
				label: 'Graph channels',
				items: [
					{
						label: 'public Lightning channel rows',
					},
				],
			},
			{
				label: 'Graph snapshots',
				items: [
					{
						label: 'timestamped graph metric observations',
					},
				],
			},
			{
				label: 'Local nodes',
				items: [
					{
						label: 'BlockheadLightningNodeState rows from connected nodes',
					},
				],
			},
			{
				label: 'Local payments',
				items: [
					{
						label: 'BlockheadLightningInvoice and BlockheadLightningPayment rows from connected nodes',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'settlement asset from the underlying Network native asset list',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'faucets',
					},
					{
						label: 'block explorers',
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
			id: 'nodes',
			label: 'nodes',
			field: '$$nodes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'channels',
			label: 'channels',
			field: '$$channels',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'invoices',
			label: 'invoices',
			field: '$$invoices',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'payments',
			label: 'payments',
			field: '$$payments',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'local-node-states',
			label: 'local node states',
			field: '$$localNodeStates',
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNetwork>
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
	entityType={EntityType.LightningNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
