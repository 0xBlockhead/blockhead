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
				label: 'post',
			},
			{
				label: 'observation time',
			},
			{
				label: 'likes',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'post',
					},
					{
						label: 'observation time',
					},
					{
						label: 'likes',
					},
					{
						label: 'reposts',
					},
					{
						label: 'replies',
					},
					{
						label: 'quotes',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Post',
					items: [
						{
							label: 'parent post identity',
						},
					],
				},
				{
					label: 'Engagement',
					items: [
						{
							label: 'like/repost/reply/quote counts',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'X_Rest public_metrics',
						},
						{
							label: 'FxEmbed status counters',
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
			selection: EntityProxyResource<typeof schema, EntityType.XPost_Timestamp>
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
	entityType={EntityType.XPost_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
