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
			label: 'pool',
		},
		'blockNumber',
		{
			label: 'parent pool',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'pool',
				},
				'blockNumber',
				{
					label: 'parent pool',
				},
				{
					label: 'sqrt price',
				},
				{
					label: 'in-range liquidity',
				},
			],
			[
				'tick',
				{
					label: 'observation index/cardinality/cardinality next',
				},
				'feeProtocol',
				'unlocked',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parent pool',
				items: [
					'$parentLiquidityPool',
				],
			},
			{
				label: 'On-chain curve state',
				items: [
					{
						label: 'slot0/liquidity values',
					},
				],
			},
			{
				label: 'Block context',
				items: [
					{
						label: 'EVM block when the network block is resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool_Block>
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
	entityType={EntityType.LiquidityPool_Block}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
