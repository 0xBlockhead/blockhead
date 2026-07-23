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

	const pageSelection = $derived(select(EntityType.PolkadotExtrinsic, {
		$block: data.selector,
		indexInBlock: Number(params.extrinsicIndex),
	}, {
		fields: {
			callName: true,
			success: true,
			hash: true,
			$signer: true,
			$pallet: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (String(({
		$block: data.selector,
		indexInBlock: Number(params.extrinsicIndex),
	}.indexInBlock) ?? '') ? 'Extrinsic #' + String(({
		$block: data.selector,
		indexInBlock: Number(params.extrinsicIndex),
	}.indexInBlock) ?? '') : '') || 'Polkadot extrinsic' : (String((({ ...{
		$block: data.selector,
		indexInBlock: Number(params.extrinsicIndex),
	}, ...pageSelection.entity }).indexInBlock) ?? '') ? 'Extrinsic #' + String((({ ...{
		$block: data.selector,
		indexInBlock: Number(params.extrinsicIndex),
	}, ...pageSelection.entity }).indexInBlock) ?? '') : '') || 'Polkadot extrinsic'))} • Polkadot extrinsic • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotExtrinsicView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
				network: params.network,
				blockNumber: params.blockNumber,
				hash: params.hash,
				extrinsicIndex: params.extrinsicIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
