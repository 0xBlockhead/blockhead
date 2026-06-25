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
		'$nodeState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$nodeState',
				'timestampMs',
				'source',
				'nodeVersion',
				'engineState',
			],
			[
				{
					label: 'latest frame number/hash',
				},
				'difficulty',
				'peerCount',
				'pendingMessageCount',
				'frameStoreHead',
			],
			[
				{
					label: 'last synced time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node',
				items: [
					{
						label: 'parent Quilibrium node state',
					},
				],
			},
			{
				label: 'Frames',
				items: [
					{
						label: 'Quilibrium frame refs for latest heads',
					},
				],
			},
			{
				label: 'Metrics',
				items: [
					{
						label: 'Prometheus/node-status counters',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node gRPC/status payload',
					},
					{
						label: 'metrics scrape freshness',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumNodeState_Timestamp>
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
	entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
