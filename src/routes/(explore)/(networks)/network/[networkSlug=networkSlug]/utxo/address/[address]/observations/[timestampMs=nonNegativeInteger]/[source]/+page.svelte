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
	import UtxoAddress_TimestampView from '$/views/UtxoAddress_TimestampView.svelte'
</script>


<svelte:head>
	<title>UTXO address timestamp • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddress_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				address: params.address,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.UtxoAddress_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					balanceSats: true,
					transactionCount: true,
					fundedOutputCount: true,
					fundedValueSats: true,
					spentOutputCount: true,
					spentValueSats: true,
					unspentOutputCount: true,
					mempoolTransactionCount: true,
				},
			})
		}
	/>
</Page>
