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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XrplLedger, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplLedgerView from '$/views/XrplLedgerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'XRPL ledger'} • XRPL ledger • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL ledger'} • XRPL ledger • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XrplLedgerView
		selection={pageSelection}
	/>
	{/if}
</Page>
