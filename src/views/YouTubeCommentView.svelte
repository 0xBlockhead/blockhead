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
		'videoId',
		'commentId',
		'text',
	],
	content: {
		dl: [
			[
				'videoId',
				'commentId',
				{
					label: 'published date',
				},
				'$video',
				'$parentComment',
			],
			[
				'text',
				'$author',
				{
					label: 'latest like/reply snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest content',
				items: [
					{
						label: 'latest comment content observation',
					},
				],
			},
			{
				label: 'Replies',
				items: [
					{
						label: 'reply comments',
					},
				],
			},
			{
				label: 'Video',
				items: [
					'$video',
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author channel when resolved',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'comment metric observations',
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
			id: 'replies',
			label: 'replies',
			field: '$$replies',
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
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeComment>
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
	entityType={EntityType.YouTubeComment}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
