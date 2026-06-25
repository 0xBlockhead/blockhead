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
		'timestampMs',
		'source',
		'perpMarketCount',
	],
	content: {
		dl: [
			[
				'timestampMs',
				'source',
				'perpMarketCount',
				'spotAssetCount',
				'spotPairCount',
			],
			[
				'validatorCount',
				'activeValidatorCount',
				'jailedValidatorCount',
				'totalStake',
				'borrowLendReserveCount',
			],
			[
				'vaultCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hyperliquid network',
					},
				],
			},
			{
				label: 'Validator summary',
				items: [
					{
						label: 'active/jailed/stake aggregate',
					},
				],
			},
			{
				label: 'Market universe',
				items: [
					{
						label: 'perp',
					},
					{
						label: 'spot universe counts',
					},
				],
			},
			{
				label: 'Borrow/lend reserves',
				items: [
					{
						label: 'all reserve-state payload summary',
					},
				],
			},
			{
				label: 'Vaults',
				items: [
					{
						label: 'vault count/source summary',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'meta',
					},
					{
						label: 'spotMeta',
					},
					{
						label: 'validatorSummaries',
					},
					{
						label: 'borrow/lend/vault list payload freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidNetwork_Timestamp>
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
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
