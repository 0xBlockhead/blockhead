<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	route: {
		href: '/youtube/video/[videoId]',
		dependsOn: [
			'videoId',
		],
	},
	query: {
		sources: [
			'Youtube_Rest',
			'Piped_Rest',
		],
		openFields: [
			'$author',
			'$$timestamps',
			'$$comments',
		],
		slot: 'YouTubeVideoQueryPolicy',
	},
	media: {
		thumbnail: 'thumbnailUrl',
		title: 'title',
		fallbackIcon: 'video',
		slot: 'YouTubeVideoThumbnail',
	},
	latest: [
		{
			field: '$$timestamps',
			sort: 'timestampMs',
			direction: 'desc',
			view: 'YouTubeVideo_TimestampView',
			slot: 'LatestYouTubeVideoMetrics',
		},
	],
	closed: [
		'videoId',
		'title',
		'description',
	],
	content: {
		dl: [
			[
				'videoId',
				{
					label: 'published date',
				},
				'durationSeconds',
				{
					label: 'author channel',
				},
				'title',
			],
			[
				'description',
				{
					label: 'latest live state',
				},
				{
					label: 'latest thumbnail',
				},
				{
					label: 'latest view/like/comment snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest metadata',
				items: [
					{
						label: 'latest video metadata observation',
					},
				],
			},
			{
				label: 'Comments',
				items: [
					{
						label: 'video comments',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author channel',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'video metric observations',
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
			id: 'comments',
			label: 'comments',
			field: '$$comments',
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
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeVideo>
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
	entityType={EntityType.YouTubeVideo}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
