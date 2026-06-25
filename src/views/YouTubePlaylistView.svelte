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
		'playlistId',
		'title',
		'description',
	],
	content: {
		dl: [
			[
				'playlistId',
				'$channel',
				{
					label: 'published date',
				},
				'title',
				'description',
				{
					label: 'latest item-count snapshot',
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
						label: 'latest playlist metadata observation',
					},
				],
			},
			{
				label: 'Videos',
				items: [
					{
						label: 'playlist videos',
					},
				],
			},
			{
				label: 'Channel',
				items: [
					{
						label: 'owning channel',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'playlist metric observations',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.YouTubePlaylist>
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
	entityType={EntityType.YouTubePlaylist}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
