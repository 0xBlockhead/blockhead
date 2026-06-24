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
			label: 'feed',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'feed',
				},
				{
					label: 'observation time',
				},
				'source',
				'decimals',
				'description',
				{
					label: 'proxy version',
				},
				{
					label: 'aggregator address',
				},
				{
					label: 'aggregator type/version',
				},
			],
			[
				{
					label: 'latest round id',
				},
				{
					label: 'latest updated time',
				},
				{
					label: 'config digest',
				},
				{
					label: 'config block number',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Feed',
				items: [
					{
						label: 'parent oracle feed',
					},
				],
			},
			{
				label: 'Aggregator',
				items: [
					{
						label: 'EVM contract when aggregatorAddress is present',
					},
				],
			},
			{
				label: 'Latest round',
				items: [
					{
						label: 'oracle round when latestRoundId resolves',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'AggregatorV3Interface decimals/description/version/latestRoundData',
					},
					{
						label: 'aggregator typeAndVersion/latestConfigDetails',
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
			selection: EntityProxyResource<typeof schema, EntityType.OracleFeed_Timestamp>
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
	entityType={EntityType.OracleFeed_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
