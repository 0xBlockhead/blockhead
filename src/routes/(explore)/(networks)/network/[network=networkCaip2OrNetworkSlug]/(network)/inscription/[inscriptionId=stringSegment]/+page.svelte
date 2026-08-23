<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinOrdinalInscriptionView from '$/views/BitcoinOrdinalInscriptionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitcoinOrdinalInscription, data.selector, {
				sources: [
					Source.BitcoinCore_JsonRpc,
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
					Source.UniSat_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.inscriptionId || 'Bitcoin Ordinal inscription')} • Bitcoin Ordinal inscription • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Ordinal inscription'} • Bitcoin Ordinal inscription • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitcoinOrdinalInscription, data.selector, {
				sources: [
					Source.BitcoinCore_JsonRpc,
					Source.Esplora_Rest,
					Source.MempoolSpace_Rest,
					Source.UniSat_Rest,
				],
			})}

	<BitcoinOrdinalInscriptionView
		selection={pageSelection}
	/>
	{/if}
</Page>
