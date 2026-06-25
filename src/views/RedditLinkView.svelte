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
		'fullname',
		'title',
		'selftext',
	],
	content: {
		dl: [
			[
				'fullname',
				'title',
				'selftext',
				'url',
				'permalink',
			],
			[
				'author',
				'createdAt',
				'$subreddit',
				{
					label: 'latest score/comment-count snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Comments',
				items: [
					{
						label: 'comment tree rows',
					},
				],
			},
			{
				label: 'Subreddit',
				items: [
					'$subreddit',
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped score/comment-count observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditLink>
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
	entityType={EntityType.RedditLink}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
