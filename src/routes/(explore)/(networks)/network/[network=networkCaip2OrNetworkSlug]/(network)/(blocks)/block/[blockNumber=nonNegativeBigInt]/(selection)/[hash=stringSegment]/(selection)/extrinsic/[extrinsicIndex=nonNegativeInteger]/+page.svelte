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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInBlock) ?? '') ? 'Extrinsic #' + String((pageSelection.entitySelector.indexInBlock) ?? '') : '') || 'Polkadot extrinsic' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInBlock) ?? '') ? 'Extrinsic #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInBlock) ?? '') : '') || 'Polkadot extrinsic')))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Polkadot extrinsic • Blockhead</title>
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
