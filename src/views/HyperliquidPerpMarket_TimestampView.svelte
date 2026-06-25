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
		'$perpMarket',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$perpMarket',
				'timestampMs',
				'source',
				'maxLeverage',
				{
					label: 'isolated-only flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Perp market',
				items: [
					'$perpMarket',
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hyperliquid network through perp market',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw meta.universe row',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidPerpMarket_Timestamp>
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
	entityType={EntityType.HyperliquidPerpMarket_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
