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

	const pageSelection = $derived(select(EntityType.UtxoAddress, data.selector))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.address) ?? '')].filter(Boolean).join(' ') || 'UTXO address' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'UTXO address')))


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • UTXO address • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddressView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
				network: params.network,
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>
