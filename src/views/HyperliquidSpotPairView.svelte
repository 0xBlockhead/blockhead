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
		{
			label: 'pair index',
		},
		{
			label: 'base asset',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'pair index',
				},
				{
					label: 'base asset',
				},
				{
					label: 'quote asset',
				},
				{
					label: 'latest pair name',
				},
				{
					label: 'latest canonical flag',
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
						label: 'latest spot-pair universe observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped spot-pair universe observations',
					},
				],
			},
			{
				label: 'Base asset',
				items: [
					{
						label: 'linked HyperCore base asset',
					},
				],
			},
			{
				label: 'Quote asset',
				items: [
					{
						label: 'linked HyperCore quote asset',
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
						label: 'generic market row only when a separate venue/base/quote selector maps this pair to market identity',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidSpotPair>
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
	entityType={EntityType.HyperliquidSpotPair}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
