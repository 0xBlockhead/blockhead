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
		{
			label: 'video id',
		},
		{
			label: 'latest title',
		},
		{
			label: 'latest description',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'video id',
				},
				{
					label: 'published date',
				},
				{
					label: 'duration',
				},
				{
					label: 'author channel',
				},
				{
					label: 'latest title',
				},
				{
					label: 'latest description',
				},
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
