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
		'clientId',
		'clientName',
		'peerId',
	],
	content: {
		dl: [
			[
				'clientId',
				'clientName',
				'peerId',
				'dhtNodeId',
				{
					label: 'latest client version',
				},
			],
			[
				{
					label: 'latest listen address count',
				},
				{
					label: 'latest transfer rates',
				},
				{
					label: 'latest active torrent count',
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
						label: 'timestamped connected-client observations',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'local transfer snapshots',
					},
				],
			},
			{
				label: 'Network identity',
				items: [
					'peerId',
					'dhtNodeId',
				],
			},
			{
				label: 'Torrent catalog',
				items: [
					{
						label: 'metainfo rows exposed by the client',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'transfers',
			label: 'transfers',
			field: '$$transfers',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBitTorrentClientState>
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
	entityType={EntityType.BlockheadBitTorrentClientState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
