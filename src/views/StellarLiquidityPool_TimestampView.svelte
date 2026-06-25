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
		'$liquidityPool',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$liquidityPool',
				'timestampMs',
				'source',
				'ledgerSequence',
				{
					label: 'reserves',
				},
				'totalShares',
				'accounts',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Pool',
				items: [
					{
						label: 'parent Stellar liquidity pool',
					},
				],
			},
			{
				label: 'Ledger',
				items: [
					{
						label: 'Stellar ledger',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon/RPC/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarLiquidityPool_Timestamp>
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
	entityType={EntityType.StellarLiquidityPool_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
