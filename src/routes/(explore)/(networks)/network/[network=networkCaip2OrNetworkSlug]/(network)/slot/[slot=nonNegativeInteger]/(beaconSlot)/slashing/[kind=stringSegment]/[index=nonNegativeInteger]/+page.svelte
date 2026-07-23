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
		$network: data.selector,
		slot: Number(params.slot),
		kind: params.kind,
		indexInSlot: Number(params.index),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (String(({
		$network: data.selector,
		slot: Number(params.slot),
		kind: params.kind,
		indexInSlot: Number(params.index),
	}.indexInSlot) ?? '') ? 'Slashing #' + String(({
		$network: data.selector,
		slot: Number(params.slot),
		kind: params.kind,
		indexInSlot: Number(params.index),
	}.indexInSlot) ?? '') : '') || 'beacon slashing' : (String((({ ...{
		$network: data.selector,
		slot: Number(params.slot),
		kind: params.kind,
		indexInSlot: Number(params.index),
	}, ...pageSelection.entity }).indexInSlot) ?? '') ? 'Slashing #' + String((({ ...{
		$network: data.selector,
		slot: Number(params.slot),
		kind: params.kind,
		indexInSlot: Number(params.index),
	}, ...pageSelection.entity }).indexInSlot) ?? '') : '') || 'beacon slashing'))} • beacon slashing • Blockhead</title>
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
