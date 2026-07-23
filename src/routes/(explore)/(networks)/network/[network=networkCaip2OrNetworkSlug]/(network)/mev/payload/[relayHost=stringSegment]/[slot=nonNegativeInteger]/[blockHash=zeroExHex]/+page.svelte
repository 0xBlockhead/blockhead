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


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [(String((data.selector.slot) ?? '') ? 'Slot ' + String((data.selector.slot) ?? '') : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered' : [(String((({ ...data.selector, ...pageSelection.entity }).slot) ?? '') ? 'Slot ' + String((({ ...data.selector, ...pageSelection.entity }).slot) ?? '') : ''), (String((({ ...data.selector, ...pageSelection.entity }).value) ?? '') ? String((({ ...data.selector, ...pageSelection.entity }).value) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered'))} • MEV relay proposer payload delivered • Blockhead</title>
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
