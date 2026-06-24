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
			label: 'validator',
		},
		{
			label: 'era index',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'validator',
				},
				{
					label: 'era index',
				},
				'source',
				{
					label: 'controller',
				},
				{
					label: 'commission',
				},
				{
					label: 'total/own/nominator stake',
				},
				{
					label: 'nominator count',
				},
				{
					label: 'reward points',
				},
				{
					label: 'active status',
				},
				{
					label: 'slashed status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Validator',
				items: [
					{
						label: 'parent Polkadot validator',
					},
				],
			},
			{
				label: 'Controller',
				items: [
					{
						label: 'controller Polkadot account',
					},
				],
			},
			{
				label: 'Exposure',
				items: [
					{
						label: 'nominators',
					},
					{
						label: 'stake breakdown',
					},
				],
			},
			{
				label: 'Rewards/slashes',
				items: [
					{
						label: 'era reward',
					},
					{
						label: 'slash evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Sidecar /pallets/staking/validators',
					},
					{
						label: 'runtime storage',
					},
					{
						label: 'or Subscan staking payload freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotValidator_Era>
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
	entityType={EntityType.PolkadotValidator_Era}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
