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
	import IcpLedgerTransactionView from '$/views/IcpLedgerTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpLedgerTransaction, {
				$block: data.selector,
				transactionIndex: Number(params.transactionIndex),
			})}
		<title>{data?.title ?? 'ICP ledger transaction'} • ICP ledger transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP ledger transaction'} • ICP ledger transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpLedgerTransaction, {
				$block: data.selector,
				transactionIndex: Number(params.transactionIndex),
			})}

	<IcpLedgerTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
