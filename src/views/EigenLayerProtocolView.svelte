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
				label: 'network',
			},
			{
				label: 'protocol name',
			},
			{
				label: 'operator/AVS counts',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'protocol name',
					},
					{
						label: 'delegation manager',
					},
					{
						label: 'strategy manager',
					},
					{
						label: 'AVS directory',
					},
				],
				[
					{
						label: 'allocation manager',
					},
					{
						label: 'rewards coordinator',
					},
					{
						label: 'slasher',
					},
					{
						label: 'operator count',
					},
					{
						label: 'AVS count',
					},
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
						{
							label: 'slashing events',
						},
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
