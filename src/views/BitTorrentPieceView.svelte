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
				label: 'piece index',
			},
			'offset',
		],
		content: {
			dl: [
				[
					{
						label: 'torrent',
					},
					{
						label: 'piece index',
					},
					'offset',
					'length',
					{
						label: 'v1 piece hash',
					},
					{
						label: 'v2 piece root',
					},
					{
						label: 'piece-layer hash',
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
					label: 'Files',
					items: [
						{
							label: 'file rows covered by the piece span',
						},
					],
				},
				{
					label: 'Local transfers',
					items: [
						{
							label: 'connected-client transfer observations exposing verified/failed piece counts',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentPiece>
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
	entityType={EntityType.BitTorrentPiece}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
