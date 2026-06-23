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
				label: 'comment',
			},
			{
				label: 'observation time',
			},
			{
				label: 'like count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'comment',
					},
					{
						label: 'observation time',
					},
					{
						label: 'like count',
					},
					{
						label: 'reply count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Comment',
					items: [
						{
							label: 'parent comment identity',
						},
					],
				},
				{
					label: 'Engagement',
					items: [
						{
							label: 'like/reply counts',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'YouTube comments.list/commentThreads.list statistics',
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
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeComment_Timestamp>
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
	entityType={EntityType.YouTubeComment_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
