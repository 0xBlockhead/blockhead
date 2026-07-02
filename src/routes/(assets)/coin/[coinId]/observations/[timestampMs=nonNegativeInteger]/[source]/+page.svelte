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
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
</script>


<svelte:head>
	<title>coin timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Coin_TimestampView
		href={
			resolve('/(assets)/coin/[coinId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				coinId: params.coinId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.Coin_Timestamp, data.selector, {
				fields: {
					marketCap: true,
					marketCapUsd: true,
					change24hPercent: true,
					marketCapRank: true,
					totalSupply: true,
					transport: true,
					providerAssetId: true,
				},
			})
		}
	/>
</Page>
