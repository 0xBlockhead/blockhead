<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	layout: 'Summary',
	defaultOpen: false,
	query: {
		sources: [
			'Youtube_Rest',
		],
		fields: [
			'$video',
			'timestampMs',
			'viewCount',
			'likeCount',
			'commentCount',
		],
	},
	metrics: [
		{
			group: 'engagement',
			field: 'viewCount',
			label: 'Views',
		},
		{
			group: 'engagement',
			field: 'likeCount',
			label: 'Likes',
		},
		{
			group: 'engagement',
			field: 'commentCount',
			label: 'Comments',
		},
	],
	closed: [
		'$video',
		'timestampMs',
		'viewCount',
	],
	content: {
		dl: [
			[
				'$video',
				'timestampMs',
				'viewCount',
				'likeCount',
				'commentCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Video',
				items: [
					'$video',
				],
			},
			{
				label: 'Statistics',
				items: [
					'viewCount',
					'likeCount',
					'commentCount',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'YouTube Data API videos.list statistics payload',
					},
				],
			},
		],
	},
	summary: {
		value: '$video',
		title: '$video',
		after: [
			'timestampMs',
			'viewCount',
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeVideo_Timestamp>
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
	entityType={EntityType.YouTubeVideo_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
