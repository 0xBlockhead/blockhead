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
		'title',
		'$$items',
	],
	content: {
		dl: [
			[
				'feedUrl',
				'title',
				'description',
				{
					label: 'site/link URL',
				},
				'language',
				'lastBuildDate',
				'imageUrl',
			],
			[
				'$$items',
				{
					label: 'target latest metadata observation when timestamp rows exist',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Items',
				items: [
					{
						label: 'RSS items from this feed',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'publisher-declared title/description/link/site/language/image fields',
					},
				],
			},
			{
				label: 'Metadata observations',
				items: [
					{
						label: 'RssFeed_Timestamp target rows when implemented',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'configured feed URL',
					},
					{
						label: 'direct XML fetch',
					},
					{
						label: 'Rss2Json proxy payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'items',
			label: 'items',
			field: '$$items',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RssFeed>
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
	entityType={EntityType.RssFeed}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
