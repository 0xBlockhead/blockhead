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
			'feedKey',
		],
		content: {
			dl: [
				[
					'timestampMs',
					'feedKey',
					'baseTokenSymbol',
					'quoteTokenSymbol',
					'baseTokenDecimals',
					'quoteTokenDecimals',
					'pairCreatedAtMs',
					'dexscreenerLabels',
					'dexId',
					'dexscreenerPairUrl',
					'priceUsd',
					'priceNative',
					'liquidityUsd',
					'volumeUsd24h',
					'priceChangePercent24h',
					'transactionBuys24h',
					'transactionSells24h',
					'marketCapUsd',
					'fdvUsd',
					'transport',
				],
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LiquidityPool_Timestamp>
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
	entityType={EntityType.LiquidityPool_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
