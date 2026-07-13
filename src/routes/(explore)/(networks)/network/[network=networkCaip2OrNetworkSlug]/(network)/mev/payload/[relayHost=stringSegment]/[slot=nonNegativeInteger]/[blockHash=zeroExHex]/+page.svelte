<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MevRelay_ProposerPayloadDelivered, data.selector, {
		fields: {
			value: true,
			$builder: true,
			blockNumber: true,
			builderPubkey: true,
			$executionBlock: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [(String((pageSelection.entitySelector.slot) ?? '') ? 'Slot ' + String((pageSelection.entitySelector.slot) ?? '') : ''), (String((pageSelection.entitySelector.value) ?? '') ? String((pageSelection.entitySelector.value) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered' : [(String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).slot) ?? '') ? 'Slot ' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).slot) ?? '') : ''), (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).value) ?? '') ? String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).value) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered')))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • MEV relay proposer payload delivered • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_ProposerPayloadDeliveredView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', {
				network: params.network,
				relayHost: params.relayHost,
				slot: params.slot,
				blockHash: params.blockHash,
			})
		}
		selection={pageSelection}
	/>
</Page>
