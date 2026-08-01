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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.UtxoAddress, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.address || 'UTXO address')} • UTXO address • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddressView
		selection={pageSelection}
	/>
</Page>
