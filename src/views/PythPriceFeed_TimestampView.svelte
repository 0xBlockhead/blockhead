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
		'$feed',
		'publishTimeMs',
		'price',
	],
	content: {
		dl: [
			[
				'$feed',
				'publishTimeMs',
				'source',
				{
					label: 'observed time',
				},
				'price',
			],
			[
				{
					label: 'confidence',
				},
				{
					label: 'exponent',
				},
				{
					label: 'EMA price/confidence',
				},
			],
			[
				{
					label: 'VAA/update hash',
				},
				'slot',
				'sequence',
				{
					label: 'on-chain network/contract',
				},
				'stale',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Feed',
				items: [
					{
						label: 'parent Pyth price feed',
					},
				],
			},
			{
				label: 'Price payload',
				items: [
					{
						label: 'raw price/conf/expo and EMA fields',
					},
				],
			},
			{
				label: 'Update proof',
				items: [
					{
						label: 'VAA/update bytes hash',
					},
					{
						label: 'Hermes response metadata',
					},
				],
			},
			{
				label: 'On-chain state',
				items: [
					{
						label: 'contract/program read coordinates when source is on-chain',
					},
				],
			},
			{
				label: 'Benchmarks',
				items: [
					{
						label: 'historical benchmark source context',
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
			selection: EntityProxyResource<typeof schema, EntityType.PythPriceFeed_Timestamp>
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
	entityType={EntityType.PythPriceFeed_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
