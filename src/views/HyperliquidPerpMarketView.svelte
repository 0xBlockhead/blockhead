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
			label: 'network',
		},
		'coin',
		{
			label: 'latest max leverage',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'coin',
				{
					label: 'latest max leverage',
				},
				{
					label: 'latest isolated-only flag',
				},
				{
					label: 'timestamp count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest perp universe observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped perp universe observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hyperliquid network',
					},
				],
			},
			{
				label: 'Related market',
				items: [
					{
						label: 'generic market row only when a separate selector maps this coin to venue/base/quote identity',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidPerpMarket>
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
	entityType={EntityType.HyperliquidPerpMarket}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
