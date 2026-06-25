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
		'$network',
		'protocolName',
		{
			label: 'operator/AVS counts',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'protocolName',
				'$delegationManager',
				'$strategyManager',
				'$avsDirectory',
			],
			[
				'$allocationManager',
				'$rewardsCoordinator',
				'$slasher',
				'$$operators',
				'$$avss',
				{
					label: 'strategy count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operators',
				items: [
					{
						label: 'EigenLayer operator rows',
					},
				],
			},
			{
				label: 'AVSs',
				items: [
					{
						label: 'EigenLayer AVS rows',
					},
				],
			},
			{
				label: 'Strategies',
				items: [
					{
						label: 'EigenLayer strategy rows',
					},
				],
			},
			{
				label: 'Delegations',
				items: [
					{
						label: 'delegation observations',
					},
				],
			},
			{
				label: 'Allocations',
				items: [
					{
						label: 'allocation observations',
					},
				],
			},
			{
				label: 'Rewards',
				items: [
					{
						label: 'reward observations',
					},
				],
			},
			{
				label: 'Slashing',
				items: [
					'$$slashingEvents',
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'linked EVM contract rows for core deployments',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'operators',
			label: 'operators',
			field: '$$operators',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'avss',
			label: 'avss',
			field: '$$avss',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'strategies',
			label: 'strategies',
			field: '$$strategies',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'rewards',
			label: 'rewards',
			field: '$$rewards',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'slashing-events',
			label: 'slashing events',
			field: '$$slashingEvents',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerProtocol>
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
	entityType={EntityType.EigenLayerProtocol}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
