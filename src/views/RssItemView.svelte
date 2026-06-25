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
		'feedUrl',
		'guid',
		'title',
	],
	content: {
		dl: [
			[
				'feedUrl',
				'guid',
				'$feed',
				'title',
				{
					label: 'published/updated time',
				},
				'author',
			],
			[
				'link',
				'categories',
				'enclosureUrl',
				'commentsUrl',
				{
					label: 'content/description presence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Content',
				items: [
					{
						label: 'description/content rendered as syndication HTML',
					},
				],
			},
			{
				label: 'Feed',
				items: [
					{
						label: 'parent RSS feed',
					},
				],
			},
			{
				label: 'Linked media',
				items: [
					{
						label: 'enclosure URL and comments URL',
					},
				],
			},
			{
				label: 'Content observations',
				items: [
					{
						label: 'RssItem_Timestamp target rows when implemented',
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
			selection: EntityProxyResource<typeof schema, EntityType.RssItem>
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
	entityType={EntityType.RssItem}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
