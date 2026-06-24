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
			label: 'torrent',
		},
		{
			label: 'tracker',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'torrent',
				},
				{
					label: 'tracker',
				},
				'source',
				{
					label: 'timestamp',
				},
				'status',
				'seeders',
				'leechers',
				{
					label: 'downloaded count',
				},
				{
					label: 'interval',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Tracker',
				items: [
					{
						label: 'parent tracker',
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
				label: 'Peer responses',
				items: [
					{
						label: 'peer observations from the announce',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'tracker response/error payload when retained',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentAnnounce_Timestamp>
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
	entityType={EntityType.BitTorrentAnnounce_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
