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
			label: 'link',
		},
		{
			label: 'observation time/source',
		},
		'score',
	],
	content: {
		dl: [
			[
				{
					label: 'link',
				},
				{
					label: 'observation time/source',
				},
				'score',
				{
					label: 'comment count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Link',
				items: [
					{
						label: 'RedditLink',
					},
				],
			},
			{
				label: 'Ranking/thread counters',
				items: [
					'score',
					{
						label: 'comment count',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'RedditLink_Timestamp list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Reddit listing/submission payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditLink_Timestamp>
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
	entityType={EntityType.RedditLink_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
