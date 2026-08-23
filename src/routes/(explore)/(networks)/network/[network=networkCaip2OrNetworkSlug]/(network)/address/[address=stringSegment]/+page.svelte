<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


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
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.UtxoAddress, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.address || 'UTXO address')} • UTXO address • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'UTXO address'} • UTXO address • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.UtxoAddress, data.selector))}

		<UtxoAddressView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
