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
				label: 'video id',
			},
			{
				label: 'comment id',
			},
			{
				label: 'latest text',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'video id',
					},
					{
						label: 'comment id',
					},
					{
						label: 'published date',
					},
					{
						label: 'video ref',
					},
					{
						label: 'parent comment ref',
					},
					{
						label: 'latest text',
					},
					{
						label: 'latest author',
					},
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
						{
							label: 'parent video',
						},
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
