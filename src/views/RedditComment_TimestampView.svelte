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
		'$comment',
		{
			label: 'observation time/source',
		},
		'score',
	],
	content: {
		dl: [
			[
				'$comment',
				{
					label: 'observation time/source',
				},
				'score',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Comment',
				items: [
					{
						label: 'RedditComment',
					},
				],
			},
			{
				label: 'Ranking',
				items: [
					'score',
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'RedditComment_Timestamp list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Reddit comment payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditComment_Timestamp>
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
	entityType={EntityType.RedditComment_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
