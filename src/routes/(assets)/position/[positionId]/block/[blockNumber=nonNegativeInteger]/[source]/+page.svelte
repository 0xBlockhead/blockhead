<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPosition_BlockView from '$/views/LiquidityPosition_BlockView.svelte'
</script>


<svelte:head>
	<title>Liquidity position block • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPosition_BlockView
		href={
			resolve('/(assets)/position/[positionId]/block/[blockNumber=nonNegativeInteger]/[source]', {
				positionId: params.positionId,
				blockNumber: params.blockNumber,
				source: params.source,
			})
		}
		selection={
			select(EntityType.LiquidityPosition_Block, data.selector, {
				sources: [data.selector.source],
				fields: {
					liquidity: true,
					$owner: true,
					token0Owed: true,
					token1Owed: true,
					feeGrowthInside0LastX128: true,
					feeGrowthInside1LastX128: true,
				},
			})
		}
	/>
</Page>
