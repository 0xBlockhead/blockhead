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
			label: 'operator address',
		},
		'name',
		{
			label: 'delegation count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'operator address',
				},
				'name',
				'website',
				{
					label: 'metadata URI',
				},
				{
					label: 'earnings receiver',
				},
				{
					label: 'delegation approver',
				},
			],
			[
				{
					label: 'staker opt-out window',
				},
				{
					label: 'latest delegated TVL/shares',
				},
				{
					label: 'AVS allocation count',
				},
				{
					label: 'slashing event count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Delegations',
				items: [
					{
						label: 'delegation observations grouped by staker/strategy',
					},
				],
			},
			{
				label: 'AVS allocations',
				items: [
					{
						label: 'allocation observations for this operator',
					},
				],
			},
			{
				label: 'Rewards',
				items: [
					{
						label: 'reward observations for this operator/earner context',
					},
				],
			},
			{
				label: 'Slashing',
				items: [
					{
						label: 'slashing events involving this operator',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'operator EVM network account',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'DelegationManager operator details',
					},
					{
						label: 'metadata payload',
					},
					{
						label: 'operator list/indexer freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerOperator>
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
	entityType={EntityType.EigenLayerOperator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
