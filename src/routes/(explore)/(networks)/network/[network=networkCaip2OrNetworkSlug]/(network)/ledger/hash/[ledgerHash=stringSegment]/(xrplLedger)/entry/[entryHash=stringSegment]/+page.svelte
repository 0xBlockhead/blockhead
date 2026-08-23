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
	import XrplLedgerEntryView from '$/views/XrplLedgerEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XrplLedgerEntry, {
				$ledger: data.selector,
				entryHash: params.entryHash,
			})}
		<title>{data?.title ?? 'XRPL ledger entry'} • XRPL ledger entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL ledger entry'} • XRPL ledger entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XrplLedgerEntry, {
				$ledger: data.selector,
				entryHash: params.entryHash,
			})}

	<XrplLedgerEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
