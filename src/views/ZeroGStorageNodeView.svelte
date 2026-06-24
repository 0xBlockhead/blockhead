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
			label: 'network',
		},
		{
			label: 'node id',
		},
		{
			label: 'operator',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'node id',
				},
				{
					label: 'operator',
				},
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
