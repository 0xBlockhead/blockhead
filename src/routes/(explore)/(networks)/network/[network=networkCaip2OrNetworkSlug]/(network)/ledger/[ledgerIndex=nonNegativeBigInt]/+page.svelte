<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
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
	<title>{(data.title ?? (pageSelection.entity == null ? 'XRPL ledger' : 'XRPL ledger'))} • XRPL ledger • Blockhead</title>
</svelte:head>


<Page>
	<XrplLedgerView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
				network: params.network,
				ledgerIndex: params.ledgerIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
