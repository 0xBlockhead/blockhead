<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_TimestampView from '$/views/LiquidityPool_TimestampView.svelte'
</script>


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
			select(EntityType.LiquidityPool_Timestamp, {
				$liquidityPool: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.chainId,
						},
					},
					id: decodeURIComponent(params.poolId),
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
			})
		}
	/>
</Page>
