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
	<title>{data?.title ?? 'ICP ledger transaction'} • ICP ledger transaction • Blockhead</title>
</svelte:head>


<Page>
	<IcpLedgerTransactionView
		selection={
			select(EntityType.IcpLedgerTransaction, {
				$block: data.selector,
				transactionIndex: Number(params.transactionIndex),
			})
		}
	/>
</Page>
