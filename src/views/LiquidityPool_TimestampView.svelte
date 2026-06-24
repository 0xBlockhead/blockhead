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
			label: 'observed timestamp',
		},
		{
			label: 'parent pool',
		},
		{
			label: 'price USD/native',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'observed timestamp',
				},
				{
					label: 'parent pool',
				},
				{
					label: 'price USD/native',
				},
				{
					label: 'liquidity USD',
				},
				{
					label: '24h volume',
				},
				{
					label: '24h price change',
				},
				{
					label: '24h buys/sells',
				},
				{
					label: 'market cap',
				},
				{
					label: 'FDV',
				},
				{
					label: 'feed key',
				},
				'transport',
			],
			[
				{
					label: 'token symbols/decimals',
				},
				{
					label: 'pair created time',
				},
				{
					label: 'labels',
				},
				{
					label: 'DEX id',
				},
				{
					label: 'Dexscreener URL',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parent pool',
				items: [
					{
						label: 'parent liquidity pool',
					},
				],
			},
			{
				label: 'Price/liquidity',
				items: [
					{
						label: 'price',
					},
					{
						label: 'TVL fields',
					},
				],
			},
			{
				label: 'Activity',
				items: [
					{
						label: 'volume',
					},
					{
						label: 'transaction counts',
					},
				],
			},
			{
				label: 'Display/discovery',
				items: [
					{
						label: 'token symbols/decimals',
					},
					{
						label: 'pair created time',
					},
					{
						label: 'labels',
					},
					{
						label: 'DEX id',
					},
					{
						label: 'pair URL',
					},
				],
			},
			{
				label: 'Feed context',
				items: [
					{
						label: 'feedKey/transport/source metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool_Timestamp>
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
	entityType={EntityType.LiquidityPool_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
