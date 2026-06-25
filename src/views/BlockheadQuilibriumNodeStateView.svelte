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
		'$network',
		'endpoint',
	],
	content: {
		dl: [
			[
				'connectionId',
				'$network',
				'endpoint',
				{
					label: 'gRPC/REST ports',
				},
				'peerId',
			],
			[
				'$$frames',
				{
					label: 'latest engine state',
				},
				{
					label: 'peer/prover count',
				},
				{
					label: 'latest sync time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped connected-node observations',
					},
				],
			},
			{
				label: 'Frames',
				items: [
					{
						label: 'locally observed frame heads',
					},
				],
			},
			{
				label: 'Provers',
				items: [
					{
						label: 'peers/provers exposed by the connected node',
					},
				],
			},
			{
				label: 'Network',
				items: [
					'$network',
				],
			},
			{
				label: 'Source evidence',
				items: [
					'endpoint',
					{
						label: 'scrape/RPC freshness',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'frames',
			label: 'frames',
			field: '$$frames',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'provers',
			label: 'provers',
			field: '$$provers',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumNodeState>
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
	entityType={EntityType.BlockheadQuilibriumNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
