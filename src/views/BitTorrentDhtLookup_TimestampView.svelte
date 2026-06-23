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
				label: 'observer',
			},
			{
				label: 'timestamp',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'info hash',
					},
					{
						label: 'observer',
					},
					{
						label: 'timestamp',
					},
					'status',
					{
						label: 'queried node count',
					},
					{
						label: 'responsive node count',
					},
					{
						label: 'peer count',
					},
					{
						label: 'closest node ids',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Closest nodes',
					items: [
						{
							label: 'BitTorrentDhtNode_Timestamp list',
						},
					],
				},
				{
					label: 'Swarm context',
					items: [
						{
							label: 'BitTorrentSwarmObservation_Timestamp list for the same info hash',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'get_peers query/response summary when retained',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentDhtLookup_Timestamp>
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
	entityType={EntityType.BitTorrentDhtLookup_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
