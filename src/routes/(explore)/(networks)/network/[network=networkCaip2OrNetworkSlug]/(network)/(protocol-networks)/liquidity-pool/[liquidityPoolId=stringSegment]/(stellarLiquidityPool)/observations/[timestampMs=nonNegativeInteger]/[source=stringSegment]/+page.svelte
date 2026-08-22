<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StellarLiquidityPool_TimestampView from '$/views/StellarLiquidityPool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar liquidity pool timestamp'} • stellar liquidity pool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StellarLiquidityPool_TimestampView
		selection={
			select(EntityType.StellarLiquidityPool_Timestamp, {
				$liquidityPool: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
