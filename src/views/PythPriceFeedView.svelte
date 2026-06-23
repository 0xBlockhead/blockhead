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
				label: 'price feed id',
			},
			'symbol',
			{
				label: 'mapped market',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'price feed id',
					},
					'channel',
					'symbol',
					{
						label: 'asset class',
					},
					{
						label: 'base asset',
					},
					{
						label: 'quote asset',
					},
					{
						label: 'mapped market',
					},
					{
						label: 'latest price publish time',
					},
				],
				[
					{
						label: 'latest price/conf/exponent',
					},
					{
						label: 'latest EMA price/conf',
					},
					{
						label: 'source/provider coverage',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest price',
					items: [
						{
							label: 'latest price-feed observation by publishTimeMs',
						},
					],
				},
				{
					label: 'Price history',
					items: [
						{
							label: 'timestamped price observations from Hermes/Benchmarks/on-chain reads',
						},
					],
				},
				{
					label: 'Market mapping',
					items: [
						{
							label: 'mapped market when curated',
						},
					],
				},
				{
					label: 'Update payloads',
					items: [
						{
							label: 'Hermes binary price update payload hashes/VAAs when captured',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Hermes feed catalog',
						},
						{
							label: 'price service response',
						},
						{
							label: 'Pyth contract/program read context',
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
			selection: EntityProxyResource<typeof schema, EntityType.PythPriceFeed>
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
	entityType={EntityType.PythPriceFeed}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
