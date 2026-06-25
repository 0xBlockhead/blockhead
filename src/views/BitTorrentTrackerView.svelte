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
		'trackerUrl',
		'trackerKind',
		{
			label: 'latest status',
		},
	],
	content: {
		dl: [
			[
				'trackerUrl',
				'trackerKind',
				{
					label: 'latest status',
				},
				{
					label: 'latest known counts',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Announces',
				items: [
					{
						label: 'announce observations grouped by torrent',
					},
				],
			},
			{
				label: 'Scrapes',
				items: [
					{
						label: 'scrape observations',
					},
				],
			},
			{
				label: 'Torrents',
				items: [
					{
						label: 'metainfo rows that cite the tracker',
					},
				],
			},
			{
				label: 'Magnets',
				items: [
					{
						label: 'magnet links that cite the tracker',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'announces',
			label: 'announces',
			field: '$$announces',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'scrapes',
			label: 'scrapes',
			field: '$$scrapes',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentTracker>
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
	entityType={EntityType.BitTorrentTracker}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
