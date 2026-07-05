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
	import UtxoNetwork_TimestampView from '$/views/UtxoNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>UTXO network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<UtxoNetwork_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/observations/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.UtxoNetwork_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					bestBlockHeight: true,
					bestBlockHash: true,
					bestBlockTimeMs: true,
					blockCount: true,
					transactionCount: true,
					blocks24h: true,
					transactions24h: true,
					mempoolTransactionCount: true,
					mempoolSizeBytes: true,
					mempoolTps: true,
					averageTransactionFee24hSats: true,
					medianTransactionFee24hSats: true,
					suggestedTransactionFeePerByteSats: true,
					blockchainSizeBytes: true,
				},
			})
		}
	/>
</Page>
