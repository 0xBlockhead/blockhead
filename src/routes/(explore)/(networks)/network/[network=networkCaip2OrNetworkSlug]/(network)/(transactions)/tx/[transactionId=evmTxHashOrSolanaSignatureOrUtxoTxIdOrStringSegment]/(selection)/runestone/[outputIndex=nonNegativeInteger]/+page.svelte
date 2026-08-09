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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BitcoinRunestone, {
		$transaction: data.selector,
		outputIndex: Number(params.outputIndex),
	}, {
		sources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinRunestoneView from '$/views/BitcoinRunestoneView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.outputIndex) || 'Bitcoin runestone')} • Bitcoin runestone • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinRunestoneView
		selection={pageSelection}
	/>
</Page>
