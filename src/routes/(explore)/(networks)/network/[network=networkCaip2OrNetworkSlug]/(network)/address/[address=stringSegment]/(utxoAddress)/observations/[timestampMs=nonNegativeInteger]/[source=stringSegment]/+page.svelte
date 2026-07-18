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

	const pageSelection = $derived(select(EntityType.UtxoAddress_Timestamp, {
		$address: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$address: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
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
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO address timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO address timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoAddress_TimestampView from '$/views/UtxoAddress_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • UTXO address timestamp • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddress_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				address: params.address,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
