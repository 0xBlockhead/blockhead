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

	const pageSelection = $derived(select(EntityType.XrplTransaction, data.selector, {
		fields: {
			transactionType: true,
			account: true,
			sequence: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplTransactionView from '$/views/XrplTransactionView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'XRPL transaction' : 'XRPL transaction'))} • XRPL transaction • Blockhead</title>
</svelte:head>


<Page>
	<XrplTransactionView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/transaction/[hash=stringSegment]', {
				network: params.network,
				hash: params.hash,
			})
		}
		selection={pageSelection}
	/>
</Page>
