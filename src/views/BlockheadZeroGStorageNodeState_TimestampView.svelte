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
				{
					label: 'synced time',
				},
				'localFileCount',
				'localChunkCount',
				'localProofCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node',
				items: [
					{
						label: 'parent connected-node state',
					},
				],
			},
			{
				label: 'Local chunks',
				items: [
					{
						label: 'stored chunks known to this connected node',
					},
				],
			},
			{
				label: 'Local proofs',
				items: [
					{
						label: 'proof material known to this connected node',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'storage-node JSON-RPC status/list payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStorageNodeState_Timestamp>
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
	entityType={EntityType.BlockheadZeroGStorageNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
