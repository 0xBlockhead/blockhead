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
		'source',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$torrent',
				'source',
				'timestampMs',
				'peerCount',
				'seedCount',
				'completedCount',
				'availability',
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
				label: 'Announces',
				items: [
					{
						label: 'tracker announce observations',
					},
				],
			},
			{
				label: 'DHT lookups',
				items: [
					{
						label: 'DHT lookup observations',
					},
				],
			},
			{
				label: 'Peers',
				items: [
					{
						label: 'peer observations from tracker/DHT/client sources',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'same torrent observations sorted newest first',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentSwarmObservation_Timestamp>
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
	entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
