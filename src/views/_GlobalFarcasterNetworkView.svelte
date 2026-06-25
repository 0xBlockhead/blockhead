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
		'$$sourceWindowUsers',
	],
	content: {
		dl: [
			[
				'scope',
				'$$timestamps',
			],
			[
				'$$sourceWindowUsers',
				'$$sourceWindowChannels',
				'$$sourceWindowCasts',
				'$$sourceWindowFeeds',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source-window rows',
				items: [
					'$$sourceWindowUsers',
					'$$sourceWindowChannels',
					'$$sourceWindowCasts',
					'$$sourceWindowFeeds',
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
						label: 'SourceBinding.Farcaster_Rest',
					},
					{
						label: 'SourceBinding.Neynar_Rest',
					},
					{
						label: 'SourceBinding.Snapchain_Rest',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'source-window-users',
			label: 'source window users',
			field: '$$sourceWindowUsers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-channels',
			label: 'source window channels',
			field: '$$sourceWindowChannels',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-casts',
			label: 'source window casts',
			field: '$$sourceWindowCasts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-feeds',
			label: 'source window feeds',
			field: '$$sourceWindowFeeds',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalFarcasterNetwork>
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
	entityType={EntityType._GlobalFarcasterNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
