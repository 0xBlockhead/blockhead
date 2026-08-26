<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TronTransactionReceipt, {
		$transaction: data.selector,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TronTransactionReceiptView from '$/views/TronTransactionReceiptView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tron transaction receipt'} • tron transaction receipt • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tron transaction receipt'} • tron transaction receipt • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TronTransactionReceiptView
		selection={pageSelection}
	/>
	{/if}
</Page>
