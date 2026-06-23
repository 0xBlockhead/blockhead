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
				label: 'earner',
			},
			{
				label: 'reward context',
			},
			{
				label: 'reward token/amount',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'earner',
					},
					{
						label: 'reward context key',
					},
					{
						label: 'strategy',
					},
					{
						label: 'operator',
					},
					{
						label: 'AVS',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'reward token',
					},
				],
				[
					{
						label: 'reward amount',
					},
					{
						label: 'cumulative claimed',
					},
					{
						label: 'merkle root',
					},
					{
						label: 'claim proof availability',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Earner',
					items: [
						{
							label: 'earner EVM network account',
						},
					],
				},
				{
					label: 'Reward context',
					items: [
						{
							label: 'source-defined strategy/operator/AVS/distribution scope encoded by rewardContextKey',
						},
					],
				},
				{
					label: 'Operator',
					items: [
						{
							label: 'EigenLayer operator when present',
						},
					],
				},
				{
					label: 'AVS',
					items: [
						{
							label: 'EigenLayer AVS when present',
						},
					],
				},
				{
					label: 'Strategy',
					items: [
						{
							label: 'EigenLayer strategy when present',
						},
					],
				},
				{
					label: 'Claim proof',
					items: [
						{
							label: 'proof JSON when requested',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'RewardsCoordinator reads/events',
						},
						{
							label: 'distribution root payload',
						},
						{
							label: 'indexer freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerReward_Timestamp>
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
	entityType={EntityType.EigenLayerReward_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
