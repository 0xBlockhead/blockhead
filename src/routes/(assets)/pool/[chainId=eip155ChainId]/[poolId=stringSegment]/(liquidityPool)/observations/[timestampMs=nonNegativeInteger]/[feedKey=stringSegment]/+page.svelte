<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
			Source.Dexscreener_OpenApi,
		],
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_TimestampView from '$/views/LiquidityPool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'liquidity pool timestamp' : [String((({ ...{
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
	}, ...pageSelection.entity }).baseTokenSymbol) ?? ''), String((({ ...{
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
	}, ...pageSelection.entity }).quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp')} • liquidity pool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPool_TimestampView
		href={
			resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
				chainId: params.chainId,
				poolId: params.poolId,
				timestampMs: params.timestampMs,
				feedKey: params.feedKey,
			})
		}
		selection={pageSelection}
	/>
</Page>
