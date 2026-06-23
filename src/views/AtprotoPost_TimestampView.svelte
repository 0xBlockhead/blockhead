<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		layout: 'Summary',
		defaultOpen: false,
		query: {
			sources: [
				'Atproto_Xrpc',
			],
			fields: [
				'$post',
				'timestampMs',
				'likeCount',
				'repostCount',
				'replyCount',
				'quoteCount',
			],
		},
		metrics: [
			{
				group: 'engagement',
				field: 'likeCount',
				label: 'Likes',
			},
			{
				group: 'engagement',
				field: 'replyCount',
				label: 'Replies',
			},
			{
				group: 'engagement',
				field: 'repostCount',
				label: 'Reposts',
			},
			{
				group: 'engagement',
				field: 'quoteCount',
				label: 'Quotes',
			},
		],
		panels: [
			{
				id: 'metrics',
				label: 'Metrics',
				kind: 'metricRows',
				slot: 'SocialMetricSnapshotRows',
			},
		],
		renderers: [
			{
				slot: 'SocialMetricSnapshotRows',
				component: 'SocialMetricSnapshotRows',
				label: 'social metric rows renderer',
				for: 'metricRows',
			},
		],
		closed: [
			'$post',
			'timestampMs',
			'likeCount',
		],
		content: {
			dl: [
				[
					'$post',
					'timestampMs',
					'likeCount',
					'repostCount',
					'replyCount',
					'quoteCount',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Post',
					items: [
						'$post',
					],
				},
				{
					label: 'Engagement',
					items: [
						'likeCount',
						'repostCount',
						'replyCount',
						'quoteCount',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'app.bsky.feed.getPostThread',
						},
						{
							label: 'app.bsky.feed.getPosts AppView stats',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		layout = view.layout === undefined ? undefined : EntityLayout[view.layout],
		open = $bindable(view.defaultOpen ?? true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoPost_Timestamp>
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.AtprotoPost_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
	{view}
/>
