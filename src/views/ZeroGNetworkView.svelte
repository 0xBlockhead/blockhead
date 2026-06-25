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
		'environment',
		{
			label: 'native assets',
		},
	],
	content: {
		dl: [
			[
				'name',
				'environment',
				{
					label: 'native assets',
				},
				'$executionNetwork',
				'$consensusNetwork',
				{
					label: 'latest execution/storage snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution',
				items: [
					'$$blocks',
					{
						label: 'Network snapshots',
					},
					{
						label: 'Consensus',
					},
					{
						label: 'Endpoints',
					},
				],
			},
			{
				label: 'Data & Storage',
				items: [
					'$$dataBlobs',
					'$$storageNodes',
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
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'storage-nodes',
			label: 'storage nodes',
			field: '$$storageNodes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'data-blobs',
			label: 'data blobs',
			field: '$$dataBlobs',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGNetwork>
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
	entityType={EntityType.ZeroGNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
