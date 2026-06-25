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
		'liquidityPoolId',
		'poolType',
		{
			label: 'asset pair',
		},
	],
	content: {
		dl: [
			[
				'liquidityPoolId',
				'poolType',
				{
					label: 'asset pair',
				},
				'feeBps',
				{
					label: 'latest reserve/share observation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Snapshots',
				items: [
					{
						label: 'timestamped pool reserve/share observations',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'asset pair',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					{
						label: 'deposit/withdraw/trade operation effects',
					},
				],
			},
			{
				label: 'Trustlines',
				items: [
					{
						label: 'pool share trustlines when indexed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon liquidity-pool object',
					},
					{
						label: 'RPC ledger entry',
					},
					{
						label: 'indexer pool payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.StellarLiquidityPool>
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
	entityType={EntityType.StellarLiquidityPool}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
