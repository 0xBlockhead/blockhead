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
		'nodeId',
		'$network',
		'nodeIp',
	],
	content: {
		dl: [
			[
				'nodeId',
				'$network',
				'nodeIp',
				{
					label: 'BLS public key/proof presence',
				},
				{
					label: 'latest network name',
				},
				{
					label: 'latest node version',
				},
				{
					label: 'latest peer/uptime summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'BlockheadAvalancheNodeState_Timestamp list',
					},
				],
			},
			{
				label: 'Node identity',
				items: [
					'nodeId',
					{
						label: 'POP public key/proof',
					},
					{
						label: 'IP',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'AvalancheSubnet/AvalancheValidator context when linked',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAvalancheNodeState>
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
	entityType={EntityType.BlockheadAvalancheNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
