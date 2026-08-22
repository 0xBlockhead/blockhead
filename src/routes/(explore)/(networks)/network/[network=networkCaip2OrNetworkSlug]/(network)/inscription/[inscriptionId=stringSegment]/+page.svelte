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

	const pageSelection = $derived(select(EntityType.BitcoinOrdinalInscription, data.selector, {
		sources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
			Source.UniSat_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinOrdinalInscriptionView from '$/views/BitcoinOrdinalInscriptionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.inscriptionId || 'Bitcoin Ordinal inscription')} • Bitcoin Ordinal inscription • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinOrdinalInscriptionView
		selection={pageSelection}
	/>
</Page>
