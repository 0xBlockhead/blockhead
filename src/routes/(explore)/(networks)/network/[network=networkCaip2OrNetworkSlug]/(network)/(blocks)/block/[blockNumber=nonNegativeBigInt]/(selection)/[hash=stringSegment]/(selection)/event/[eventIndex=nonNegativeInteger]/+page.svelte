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

	const pageSelection = $derived(select(EntityType.PolkadotEvent, {
		$block: data.selector,
		indexInBlock: Number(params.eventIndex),
	}, {
		fields: {
			eventName: true,
			$pallet: true,
			$extrinsic: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.eventName) ?? ''), (String((pageSelection.entitySelector.indexInBlock) ?? '') ? 'Event ' + String((pageSelection.entitySelector.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).eventName) ?? ''), (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInBlock) ?? '') ? 'Event ' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event')))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotEventView from '$/views/PolkadotEventView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Polkadot event • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotEventView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
				network: params.network,
				blockNumber: params.blockNumber,
				hash: params.hash,
				eventIndex: params.eventIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
