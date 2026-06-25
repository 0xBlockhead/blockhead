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
		'$feed',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$feed',
				'timestampMs',
				'source',
				'reachable',
				'fetchWindowKind',
			],
			[
				'title',
				'description',
				{
					label: 'link/site URL',
				},
				'language',
				'lastBuildDate',
				'imageUrl',
				'sourceWindowItemCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Feed',
				items: [
					{
						label: 'parent RSS feed',
					},
				],
			},
			{
				label: 'Document metadata',
				items: [
					{
						label: 'publisher-declared channel/feed fields',
					},
				],
			},
			{
				label: 'Item window',
				items: [
					{
						label: 'bounded item count from this fetch',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'direct XML fetch response',
					},
					{
						label: 'Rss2Json proxy response',
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
			selection: EntityProxyResource<typeof schema, EntityType.RssFeed_Timestamp>
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
	entityType={EntityType.RssFeed_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
