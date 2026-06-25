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
		'nodeId',
	],
	content: {
		dl: [
			[
				'connectionId',
				'$network',
				'nodeId',
				'endpoint',
				'storagePath',
				{
					label: 'latest file/chunk/proof counts',
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
						label: 'local timestamped file/chunk/proof count rows',
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
				label: 'Public node',
				items: [
					{
						label: 'public storage node when node id maps to a public row',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'local-chunks',
			label: 'local chunks',
			field: '$$localChunks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'local-proofs',
			label: 'local proofs',
			field: '$$localProofs',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStorageNodeState>
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
	entityType={EntityType.BlockheadZeroGStorageNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
