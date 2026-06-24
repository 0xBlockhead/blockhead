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
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'stake total',
				},
				{
					label: 'reward balance',
				},
				{
					label: 'max rewarded stake',
				},
				{
					label: 'max reward rate',
				},
				{
					label: 'staking period',
				},
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
					{
						label: 'reward balance',
					},
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
