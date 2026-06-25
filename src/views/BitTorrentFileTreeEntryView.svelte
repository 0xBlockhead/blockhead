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
		'$torrent',
		'path',
		'pathSegments',
	],
	content: {
		dl: [
			[
				'$torrent',
				'path',
				'pathSegments',
				'entryKind',
				'length',
				'piecesRoot',
				'$file',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'File',
				items: [
					{
						label: 'flattened file row for this leaf path',
					},
				],
			},
			{
				label: 'Children',
				items: [
					{
						label: 'child tree entries for the path prefix',
					},
				],
			},
			{
				label: 'Torrent',
				items: [
					{
						label: 'parent metainfo',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentFileTreeEntry>
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
	entityType={EntityType.BitTorrentFileTreeEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
