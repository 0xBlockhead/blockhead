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

	const pageSelection = $derived(select(EntityType.BeaconSlashing, {
		$network: data.selector.$network,
		slot: Number(params.slot),
		kind: params.kind,
		indexInSlot: Number(params.index),
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInSlot) ?? '') ? 'Slashing #' + String((pageSelection.entitySelector.indexInSlot) ?? '') : '') || 'beacon slashing' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') ? 'Slashing #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') : '') || 'beacon slashing')))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • beacon slashing • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlashingView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', {
				network: params.network,
				slot: params.slot,
				kind: params.kind,
				index: params.index,
			})
		}
		selection={pageSelection}
	/>
</Page>
