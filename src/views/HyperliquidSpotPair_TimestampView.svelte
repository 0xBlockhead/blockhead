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
		'$spotPair',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$spotPair',
				'timestampMs',
				'source',
				'name',
				'baseAssetId',
				'quoteAssetId',
				{
					label: 'canonical flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Spot pair',
				items: [
					'$spotPair',
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'base asset ref',
					},
					{
						label: 'quote asset ref',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw spotMeta.universe row',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidSpotPair_Timestamp>
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
	entityType={EntityType.HyperliquidSpotPair_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
