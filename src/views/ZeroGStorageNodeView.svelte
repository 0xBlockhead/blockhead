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
		'nodeId',
		'$operator',
	],
	content: {
		dl: [
			[
				'$network',
				'nodeId',
				'$operator',
				'endpoint',
				{
					label: 'latest storage-node observation balance/reward/mining summary',
				},
				{
					label: 'latest observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node observations',
				items: [
					{
						label: 'timestamped balance/reward/mining rows',
					},
				],
			},
			{
				label: 'Stored chunks',
				items: [
					{
						label: 'public data-chunk rows linked to this node',
					},
				],
			},
			{
				label: 'Proofs',
				items: [
					{
						label: 'public storage-proof rows linked to this node',
					},
				],
			},
			{
				label: 'Operator',
				items: [
					{
						label: 'operator EVM account when resolved',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent 0G network',
					},
				],
			},
			{
				label: 'Local node state',
				items: [
					{
						label: 'Blockhead node state when connected',
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
			id: 'stored-chunks',
			label: 'stored chunks',
			field: '$$storedChunks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'proofs',
			label: 'proofs',
			field: '$$proofs',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageNode>
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
	entityType={EntityType.ZeroGStorageNode}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
