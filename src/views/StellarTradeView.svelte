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
		'tradeId',
		{
			label: 'asset pair',
		},
		{
			label: 'amounts',
		},
	],
	content: {
		dl: [
			[
				'tradeId',
				'source',
				'ledgerCloseTimeMs',
				{
					label: 'asset pair',
				},
				{
					label: 'base/counter amounts',
				},
				{
					label: 'price',
				},
			],
			[
				{
					label: 'base/counter accounts',
				},
				{
					label: 'base/counter offers',
				},
				{
					label: 'liquidity pool links',
				},
				{
					label: 'transaction/operation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Accounts',
				items: [
					{
						label: 'base/counter Stellar accounts',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'base/counter Stellar assets',
					},
				],
			},
			{
				label: 'Offers',
				items: [
					{
						label: 'base/counter Stellar offers',
					},
				],
			},
			{
				label: 'Liquidity pools',
				items: [
					{
						label: 'Stellar liquidity pool when pool-backed',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'Stellar transaction',
					},
					{
						label: 'Stellar operation',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon trade object',
					},
					{
						label: 'indexer enrichment',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarTrade>
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
	entityType={EntityType.StellarTrade}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
