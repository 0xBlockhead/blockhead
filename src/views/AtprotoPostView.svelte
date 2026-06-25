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
			label: 'AT URI',
		},
		'$author',
		'text',
	],
	content: {
		dl: [
			[
				{
					label: 'AT URI',
				},
				'$author',
				'createdAt',
				{
					label: 'indexed time',
				},
				'text',
			],
			[
				{
					label: 'languages',
				},
				'selfLabelValues',
				'$parent',
				'$root',
				{
					label: 'latest engagement snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Content',
				items: [
					'text',
					{
						label: 'languages',
					},
					'selfLabelValues',
					{
						label: 'created/indexed times',
					},
				],
			},
			{
				label: 'Thread',
				items: [
					{
						label: 'parent/root/thread post relationships',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author AT Protocol actor',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped like/repost/reply/quote counts',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'app.bsky.feed.getPosts',
					},
					{
						label: 'app.bsky.feed.getPostThread',
					},
					{
						label: 'AppView post payload',
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
			id: 'thread',
			label: 'threadses',
			field: '$$thread',
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
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoPost>
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
	entityType={EntityType.AtprotoPost}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
