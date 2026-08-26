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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpLedgerTransaction, {
		$block: data.selector,
		transactionIndex: Number(params.transactionIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpLedgerTransactionView from '$/views/IcpLedgerTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP ledger transaction'} • ICP ledger transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP ledger transaction'} • ICP ledger transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpLedgerTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
