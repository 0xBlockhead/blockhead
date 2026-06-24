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
			label: 'position id',
		},
		{
			label: 'network',
		},
		{
			label: 'pool',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'position id',
				},
				{
					label: 'network',
				},
				{
					label: 'pool',
				},
				{
					label: 'tick lower',
				},
				{
					label: 'tick upper',
				},
				{
					label: 'token id',
				},
				'origin',
				{
					label: 'created timestamp',
				},
				{
					label: 'latest owner/liquidity/owed-token block state',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Pool',
				items: [
					{
						label: 'parent liquidity pool',
					},
				],
			},
			{
				label: 'Block state',
				items: [
					{
						label: 'block-coordinate position state history',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'position manager positions(tokenId) call',
					},
					{
						label: 'subgraph position entity',
					},
					{
						label: 'local wallet-owned position list',
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
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPosition>
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
	entityType={EntityType.LiquidityPosition}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
