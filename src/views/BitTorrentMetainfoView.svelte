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
			label: 'info hash',
		},
		{
			label: 'hash version',
		},
		{
			label: 'v1/v2 hashes',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'info hash',
				},
				{
					label: 'hash version',
				},
				{
					label: 'v1/v2 hashes',
				},
				{
					label: 'metainfo hash',
				},
				{
					label: 'bencoded info hash',
				},
				'name',
				{
					label: 'piece length',
				},
				{
					label: 'total length',
				},
				{
					label: 'private flag',
				},
				{
					label: 'tracker count',
				},
				{
					label: 'file count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Files',
				items: [
					{
						label: 'flattened file layout rows',
					},
				],
			},
			{
				label: 'File tree',
				items: [
					{
						label: 'BEP-52 or path-tree entries',
					},
				],
			},
			{
				label: 'Pieces',
				items: [
					{
						label: 'piece integrity/order rows',
					},
				],
			},
			{
				label: 'Trackers',
				items: [
					{
						label: 'tracker endpoint rows',
					},
				],
			},
			{
				label: 'Magnets',
				items: [
					{
						label: 'magnet links referencing this info hash',
					},
				],
			},
			{
				label: 'Swarm',
				items: [
					{
						label: 'tracker/DHT/client swarm observations',
					},
				],
			},
			{
				label: 'Local transfers',
				items: [
					{
						label: 'connected-client transfer observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentMetainfo>
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
	entityType={EntityType.BitTorrentMetainfo}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
