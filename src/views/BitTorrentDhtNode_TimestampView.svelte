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
			label: 'DHT node id',
		},
		'source',
		{
			label: 'timestamp',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'DHT node id',
				},
				'source',
				{
					label: 'timestamp',
				},
				'address',
				'port',
				{
					label: 'reachability',
				},
				{
					label: 'observed info hashes',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Lookups',
				items: [
					{
						label: 'BitTorrentDhtLookup_Timestamp list that returned or queried the node',
					},
				],
			},
			{
				label: 'Routing evidence',
				items: [
					{
						label: 'local routing-table/query payload when retained',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitTorrentDhtNode_Timestamp>
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
	entityType={EntityType.BitTorrentDhtNode_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
