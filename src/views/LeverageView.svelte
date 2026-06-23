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
				label: 'network derived from pool',
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
						label: 'network derived from pool',
					},
					{
						label: 'pool',
					},
					{
						label: 'owner',
					},
					{
						label: 'tick lower',
					},
					{
						label: 'tick upper',
					},
					'liquidity',
					{
						label: 'token0 owed',
					},
					{
						label: 'token1 owed',
					},
					{
						label: 'token id',
					},
					'origin',
					{
						label: 'created timestamp',
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
					label: 'Owner',
					items: [
						{
							label: 'owner EVM account',
						},
					],
				},
				{
					label: 'Range/accounting',
					items: [
						{
							label: 'ticks',
						},
						'liquidity',
						{
							label: 'owed token amounts',
						},
					],
				},
				{
					label: 'Compatibility warning',
					items: [
						{
							label: 'not CEX margin',
						},
						{
							label: 'borrow APR',
						},
						{
							label: 'liquidation',
						},
						{
							label: 'or Dexscreener pool leverage',
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
			selection: EntityProxyResource<typeof schema, EntityType.Leverage>
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
	entityType={EntityType.Leverage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
