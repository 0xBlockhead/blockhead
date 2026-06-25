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
			label: 'pool id',
		},
		{
			label: 'base/quote token contracts',
		},
		{
			label: 'on-chain curve fields',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'pool id',
				},
				{
					label: 'base/quote token contracts',
				},
				'fee',
				'tickSpacing',
				'$hooks',
			],
			[
				'v4PoolId',
				{
					label: 'latest pair-indexer observation',
				},
				'$$blocks',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped pair-indexer observations',
					},
				],
			},
			{
				label: 'Block state',
				items: [
					{
						label: 'block-coordinate on-chain curve state',
					},
				],
			},
			{
				label: 'Base token',
				items: [
					'$baseToken',
				],
			},
			{
				label: 'Quote token',
				items: [
					'$quoteToken',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Dexscreener pair id mapping',
					},
					{
						label: 'execution RPC or pool indexer calls',
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
		{
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool>
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
	entityType={EntityType.LiquidityPool}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
