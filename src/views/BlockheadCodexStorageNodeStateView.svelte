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
		'peerId',
		'endpoint',
	],
	content: {
		dl: [
			[
				'connectionId',
				'peerId',
				'endpoint',
				'signedPeerRecord',
				{
					label: 'latest space/peer observation',
				},
				'$$storedData',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped connected-node observations',
					},
				],
			},
			{
				label: 'Stored data',
				items: [
					{
						label: 'local stored-data inventory rows',
					},
				],
			},
			{
				label: 'Peers',
				items: [
					{
						label: 'latest peer table fields from debug info',
					},
				],
			},
			{
				label: 'Network presets',
				items: [
					{
						label: 'bootstrap SPR records from presets',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					'peerId',
					{
						label: '/spr',
					},
					{
						label: '/debug/info',
					},
					{
						label: '/space',
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
			id: 'stored-data',
			label: 'stored datases',
			field: '$$storedData',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCodexStorageNodeState>
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
	entityType={EntityType.BlockheadCodexStorageNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
