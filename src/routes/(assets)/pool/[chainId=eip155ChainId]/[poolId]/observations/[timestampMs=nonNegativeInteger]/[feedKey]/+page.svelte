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
	import LiquidityPool_TimestampView from '$/views/LiquidityPool_TimestampView.svelte'
</script>


<svelte:head>
	<title>liquidity pool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPool_TimestampView
		href={
			resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]/observations/[timestampMs=nonNegativeInteger]/[feedKey]', {
				chainId: params.chainId,
				poolId: params.poolId,
				timestampMs: params.timestampMs,
				feedKey: params.feedKey,
			})
		}
		selection={
			select(EntityType.LiquidityPool_Timestamp, data.selector, {
				fields: {
					baseTokenSymbol: true,
					quoteTokenSymbol: true,
					priceUsd: true,
					liquidityUsd: true,
					transport: true,
					baseTokenDecimals: true,
					quoteTokenDecimals: true,
					pairCreatedAtMs: true,
					dexId: true,
					dexscreenerPairUrl: true,
					priceNative: true,
					volumeUsd24h: true,
					priceChangePercent24h: true,
					transactionBuys24h: true,
					transactionSells24h: true,
					marketCapUsd: true,
					fdvUsd: true,
					dexscreenerLabels: true,
					$parentLiquidityPool: true,
				},
			})
		}
	/>
</Page>
