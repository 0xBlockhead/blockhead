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
		'connectionId',
		'nodeId',
		'endpoint',
	],
	content: {
		dl: [
			[
				'connectionId',
				'nodeId',
				'endpoint',
				{
					label: 'latest health/capability observation',
				},
				'$$messageObservations',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Health history',
				items: [
					{
						label: 'timestamped Waku node observations',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'message observations grouped by content topic',
					},
				],
			},
			{
				label: 'Peer identity',
				items: [
					'nodeId',
					{
						label: 'ENR/multiaddrs from latest observation',
					},
				],
			},
			{
				label: 'Protocols',
				items: [
					{
						label: 'relay/store/filter/lightpush/RLN capability flags',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'connected Waku REST node',
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
			id: 'message-observations',
			label: 'message observations',
			field: '$$messageObservations',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWakuNodeState>
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
	entityType={EntityType.BlockheadWakuNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
