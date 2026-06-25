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
		'scope',
		'$$timestamps',
		'$$sourceWindowSubreddits',
	],
	content: {
		dl: [
			[
				'scope',
				'$$timestamps',
			],
			[
				'$$sourceWindowSubreddits',
				'$$sourceWindowLinks',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source-window rows',
				items: [
					'$$sourceWindowSubreddits',
					'$$sourceWindowLinks',
				],
			},
			{
				label: 'Hub observations',
				items: [
					'$$timestamps',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SourceBinding.Constants_Internal',
					},
					{
						label: 'SourceBinding.Reddit_PublicJson',
					},
					{
						label: 'SourceBinding.Reddit_Rest',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'source-window-subreddits',
			label: 'source window subreddits',
			field: '$$sourceWindowSubreddits',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-links',
			label: 'source window links',
			field: '$$sourceWindowLinks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalRedditNetwork>
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
	entityType={EntityType._GlobalRedditNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
