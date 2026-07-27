<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.XrplLedger, data.selector, {
		fields: {
			ledgerHash: true,
			closeTimeMs: true,
			validated: true,
			totalCoinsDrops: true,
			parentHash: true,
			accountHash: true,
			transactionHash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplLedgerView from '$/views/XrplLedgerView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ('XRPL ledger'))} • XRPL ledger • Blockhead</title>
</svelte:head>


<Page>
	<XrplLedgerView
		selection={pageSelection}
	/>
</Page>
