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
		'body',
		'author',
	],
	content: {
		dl: [
			[
				'fullname',
				'body',
				'author',
				{
					label: 'created time',
				},
				{
					label: 'parent comment',
				},
				{
					label: 'link',
				},
				{
					label: 'latest score snapshot',
				},
				{
					label: 'derived nesting depth',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Replies',
				items: [
					{
						label: 'reply comments returned by the tree traversal',
					},
				],
			},
			{
				label: 'Parent',
				items: [
					{
						label: 'parent Reddit comment',
					},
				],
			},
			{
				label: 'Submission',
				items: [
					{
						label: 'parent Reddit link',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped score observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditComment>
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
	entityType={EntityType.RedditComment}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
