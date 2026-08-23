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


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaAddressUtxo_TimestampView from '$/views/KaspaAddressUtxo_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.KaspaAddressUtxo_Timestamp, {
				$address: data.selector,
				outpointTransactionId: params.outpointTransactionId,
				outpointIndex: Number(params.outpointIndex),
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'kaspa address UTXO timestamp'} • kaspa address UTXO timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'kaspa address UTXO timestamp'} • kaspa address UTXO timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.KaspaAddressUtxo_Timestamp, {
				$address: data.selector,
				outpointTransactionId: params.outpointTransactionId,
				outpointIndex: Number(params.outpointIndex),
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<KaspaAddressUtxo_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
