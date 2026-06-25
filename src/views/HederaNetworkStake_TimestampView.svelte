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
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$network',
				'timestampMs',
				'source',
				'stakeTotalTinybar',
				'rewardBalanceTinybar',
			],
			[
				{
					label: 'max rewarded stake',
				},
				{
					label: 'max reward rate',
				},
				'stakingPeriod',
				{
					label: 'reward fee fractions',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hedera network',
					},
				],
			},
			{
				label: 'Reward economics',
				items: [
					'rewardBalanceTinybar',
					{
						label: 'reserved/unreserved rewards',
					},
					{
						label: 'max reward fields',
					},
				],
			},
			{
				label: 'Period',
				items: [
					{
						label: 'staking period and stored-period count',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'network stake payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetworkStake_Timestamp>
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
	entityType={EntityType.HederaNetworkStake_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
