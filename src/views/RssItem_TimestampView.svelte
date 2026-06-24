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
			label: 'item',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'item',
				},
				{
					label: 'observation time',
				},
				'source',
				'title',
				'author',
				{
					label: 'published/updated time',
				},
			],
			[
				'link',
				'categories',
				{
					label: 'enclosure URL',
				},
				{
					label: 'comments URL',
				},
				{
					label: 'content/description presence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Item',
				items: [
					{
						label: 'parent RSS item identity',
					},
				],
			},
			{
				label: 'Content',
				items: [
					{
						label: 'description/content rendered as syndication HTML',
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
				label: 'Source evidence',
				items: [
					{
						label: 'direct XML item payload',
					},
					{
						label: 'Rss2Json item payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.RssItem_Timestamp>
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
	entityType={EntityType.RssItem_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
