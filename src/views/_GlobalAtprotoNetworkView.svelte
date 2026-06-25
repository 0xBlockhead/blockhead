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
		'$$sourceWindowActors',
	],
	content: {
		dl: [
			[
				'scope',
				'$$timestamps',
			],
			[
				'$$sourceWindowActors',
				'$$sourceWindowPosts',
				'$$sourceWindowRepoCommits',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source-window rows',
				items: [
					'$$sourceWindowActors',
					'$$sourceWindowPosts',
					'$$sourceWindowRepoCommits',
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
						label: 'SourceBinding.Atproto_BskySocial_Xrpc',
					},
					{
						label: 'SourceBinding.Atproto_Xrpc',
					},
					{
						label: 'SourceBinding.AtprotoSync_Xrpc',
					},
					{
						label: 'SourceBinding.Constants_Internal',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'source-window-actors',
			label: 'source window actors',
			field: '$$sourceWindowActors',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-posts',
			label: 'source window posts',
			field: '$$sourceWindowPosts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-repo-commits',
			label: 'source window repo commits',
			field: '$$sourceWindowRepoCommits',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAtprotoNetwork>
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
	entityType={EntityType._GlobalAtprotoNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
