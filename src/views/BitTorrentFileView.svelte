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
			label: 'torrent',
		},
		{
			label: 'file index',
		},
		'path',
	],
	content: {
		dl: [
			[
				{
					label: 'torrent',
				},
				{
					label: 'file index',
				},
				'path',
				'length',
				{
					label: 'pieces root',
				},
				{
					label: 'file hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Torrent',
				items: [
					{
						label: 'parent metainfo',
					},
				],
			},
			{
				label: 'Tree entry',
				items: [
					{
						label: 'file-tree entry for this path',
					},
				],
			},
			{
				label: 'Piece span',
				items: [
					{
						label: 'pieces covering this file',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentFile>
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
	entityType={EntityType.BitTorrentFile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
