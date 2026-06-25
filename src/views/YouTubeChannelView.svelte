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
		'channelId',
		'title',
		'description',
	],
	content: {
		dl: [
			[
				'channelId',
				{
					label: 'published date',
				},
				'title',
				'description',
				'customUrl',
				{
					label: 'latest icon media',
				},
				{
					label: 'latest subscriber/video/view snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest metadata',
				items: [
					{
						label: 'latest channel metadata observation',
					},
				],
			},
			{
				label: 'Videos',
				items: [
					{
						label: 'channel videos',
					},
				],
			},
			{
				label: 'Playlists',
				items: [
					{
						label: 'channel playlists',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'channel metric observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'videos',
			label: 'videos',
			field: '$$videos',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'playlists',
			label: 'playlists',
			field: '$$playlists',
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
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeChannel>
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
	entityType={EntityType.YouTubeChannel}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
