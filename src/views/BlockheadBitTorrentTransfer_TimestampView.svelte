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
		'$client',
		'$torrent',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$client',
				'$torrent',
				'timestampMs',
				'status',
				{
					label: 'selected file count',
				},
			],
			[
				{
					label: 'downloaded/uploaded bytes',
				},
				{
					label: 'download/upload rates',
				},
				{
					label: 'verified/failed pieces',
				},
				'connectedPeerCount',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Client',
				items: [
					{
						label: 'parent connected-client state',
					},
				],
			},
			{
				label: 'Torrent',
				items: [
					{
						label: 'parent metainfo',
					},
				],
			},
			{
				label: 'Files',
				items: [
					{
						label: 'selected file rows',
					},
				],
			},
			{
				label: 'Swarm context',
				items: [
					{
						label: 'public/client swarm observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'connected-client transfer payload with local paths redacted by default',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBitTorrentTransfer_Timestamp>
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
	entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
