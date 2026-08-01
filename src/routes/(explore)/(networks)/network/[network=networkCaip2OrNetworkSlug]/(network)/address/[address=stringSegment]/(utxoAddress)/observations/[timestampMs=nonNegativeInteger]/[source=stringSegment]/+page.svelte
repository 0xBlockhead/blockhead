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


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoAddress_TimestampView from '$/views/UtxoAddress_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'UTXO address timestamp')} • UTXO address timestamp • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddress_TimestampView
		selection={pageSelection}
	/>
</Page>
