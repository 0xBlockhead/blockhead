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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XrplLedgerEntry, {
		$ledger: data.selector,
		entryHash: params.entryHash,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplLedgerEntryView from '$/views/XrplLedgerEntryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'XRPL ledger entry'} • XRPL ledger entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL ledger entry'} • XRPL ledger entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XrplLedgerEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
