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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Coin_Timestamp, {
		$coin: {
			coinId: params.coinId,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$coin: {
				coinId: params.coinId,
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			marketCap: true,
			marketCapUsd: true,
			change24hPercent: true,
			marketCapRank: true,
			totalSupply: true,
			transport: true,
			providerAssetId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'coin timestamp' : 'coin timestamp')} • coin timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Coin_TimestampView
		href={
			resolve('/coin/[coinId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				coinId: params.coinId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
