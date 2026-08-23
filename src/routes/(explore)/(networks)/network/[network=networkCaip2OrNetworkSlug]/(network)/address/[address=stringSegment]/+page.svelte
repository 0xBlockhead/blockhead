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


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.UtxoAddress, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'UTXO address')} • UTXO address • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'UTXO address'} • UTXO address • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.UtxoAddress, data.selector)}

	<UtxoAddressView
		selection={pageSelection}
	/>
	{/if}
</Page>
