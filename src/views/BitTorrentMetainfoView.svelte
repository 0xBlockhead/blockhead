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
		'infoHash',
		'hashVersion',
		{
			label: 'v1/v2 hashes',
		},
	],
	content: {
		dl: [
			[
				'infoHash',
				'hashVersion',
				{
					label: 'v1/v2 hashes',
				},
				'metainfoHash',
				'bencodedInfoHash',
			],
			[
				'name',
				'pieceLength',
				'totalLength',
				'private',
				'$$trackers',
			],
			[
				'$$files',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Files',
				items: [
					{
						label: 'flattened file layout rows',
					},
				],
			},
			{
				label: 'File tree',
				items: [
					{
						label: 'BEP-52 or path-tree entries',
					},
				],
			},
			{
				label: 'Pieces',
				items: [
					{
						label: 'piece integrity/order rows',
					},
				],
			},
			{
				label: 'Trackers',
				items: [
					{
						label: 'tracker endpoint rows',
					},
				],
			},
			{
				label: 'Magnets',
				items: [
					{
						label: 'magnet links referencing this info hash',
					},
				],
			},
			{
				label: 'Swarm',
				items: [
					{
						label: 'tracker/DHT/client swarm observations',
					},
				],
			},
			{
				label: 'Local transfers',
				items: [
					{
						label: 'connected-client transfer observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'files',
			label: 'files',
			field: '$$files',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'file-tree-entries',
			label: 'file tree entries',
			field: '$$fileTreeEntries',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'pieces',
			label: 'pieces',
			field: '$$pieces',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'trackers',
			label: 'trackers',
			field: '$$trackers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'magnets',
			label: 'magnets',
			field: '$$magnets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'swarm-timestamps',
			label: 'swarm timestamps',
			field: '$$swarmTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'client-transfers',
			label: 'client transfers',
			field: '$$clientTransfers',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentMetainfo>
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
	entityType={EntityType.BitTorrentMetainfo}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
