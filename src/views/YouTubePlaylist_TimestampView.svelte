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
		'$playlist',
		'timestampMs',
		'itemCount',
	],
	content: {
		dl: [
			[
				'$playlist',
				'timestampMs',
				'itemCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Playlist',
				items: [
					{
						label: 'parent playlist identity',
					},
				],
			},
			{
				label: 'Items',
				items: [
					{
						label: 'playlist video refs from source window',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'YouTube playlists.list contentDetails',
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
			selection: EntityProxyResource<typeof schema, EntityType.YouTubePlaylist_Timestamp>
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
	entityType={EntityType.YouTubePlaylist_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
