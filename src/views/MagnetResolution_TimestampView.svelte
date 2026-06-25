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
		'magnetUri',
		'source',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'magnetUri',
				'source',
				'timestampMs',
				'status',
				'resolvedInfoHash',
			],
			[
				'resolvedMetainfoHash',
				'trackerCount',
				'webSeedCount',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Magnet',
				items: [
					{
						label: 'parent magnet link',
					},
				],
			},
			{
				label: 'Torrent',
				items: [
					{
						label: 'linked metainfo row when resolved',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'parser/DHT/metadata-exchange/web-seed payload when retained',
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
			selection: EntityProxyResource<typeof schema, EntityType.MagnetResolution_Timestamp>
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
	entityType={EntityType.MagnetResolution_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
