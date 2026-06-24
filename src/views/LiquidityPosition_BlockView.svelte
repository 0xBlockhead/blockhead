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
			label: 'position',
		},
		{
			label: 'block number',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'position',
				},
				{
					label: 'block number',
				},
				'source',
				{
					label: 'owner',
				},
				'liquidity',
				{
					label: 'token0 owed',
				},
				{
					label: 'token1 owed',
				},
				{
					label: 'fee growth inside token0',
				},
				{
					label: 'fee growth inside token1',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Position',
				items: [
					{
						label: 'parent liquidity position',
					},
				],
			},
			{
				label: 'Pool',
				items: [
					{
						label: 'liquidity pool through parent position',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					{
						label: 'EVM account when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NonfungiblePositionManager positions() result',
					},
					{
						label: 'subgraph position snapshot',
					},
					{
						label: 'local wallet position state',
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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPosition_Block>
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
	entityType={EntityType.LiquidityPosition_Block}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
