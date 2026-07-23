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


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotEventView from '$/views/PolkadotEventView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [(String(({
		$block: data.selector,
		indexInBlock: Number(params.eventIndex),
	}.indexInBlock) ?? '') ? 'Event ' + String(({
		$block: data.selector,
		indexInBlock: Number(params.eventIndex),
	}.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event' : [String((({ ...{
		$block: data.selector,
		indexInBlock: Number(params.eventIndex),
	}, ...pageSelection.entity }).eventName) ?? ''), (String((({ ...{
		$block: data.selector,
		indexInBlock: Number(params.eventIndex),
	}, ...pageSelection.entity }).indexInBlock) ?? '') ? 'Event ' + String((({ ...{
		$block: data.selector,
		indexInBlock: Number(params.eventIndex),
	}, ...pageSelection.entity }).indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event'))} • Polkadot event • Blockhead</title>
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
