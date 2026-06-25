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
		'$subreddit',
		{
			label: 'observation time/source',
		},
		'subscriberCount',
	],
	content: {
		dl: [
			[
				'$subreddit',
				{
					label: 'observation time/source',
				},
				'subscriberCount',
				'activeUserCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subreddit',
				items: [
					{
						label: 'RedditSubreddit',
					},
				],
			},
			{
				label: 'Audience counters',
				items: [
					'subscriberCount',
					'activeUserCount',
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'RedditSubreddit_Timestamp list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Reddit subreddit/about payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditSubreddit_Timestamp>
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
	entityType={EntityType.RedditSubreddit_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
