<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LiquidityPool_Timestamp, {
		$liquidityPool: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			id: params.poolId,
		},
		timestampMs: Number(params.timestampMs),
		feedKey: decodeURIComponent(params.feedKey),
	}, {
		sources: [
			Source.Dexscreener_Rest,
		],
		fields: {
			baseTokenSymbol: true,
			quoteTokenSymbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_TimestampView from '$/views/LiquidityPool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'liquidity pool timestamp' : [(pageSelection.entity.baseTokenSymbol ?? ''), (pageSelection.entity.quoteTokenSymbol ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp'} • liquidity pool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPool_TimestampView
		selection={pageSelection}
	/>
</Page>
