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

	const pageSelection = $derived(select(EntityType.BeaconAttestation, {
		$network: data.selector,
		slot: Number(params.slot),
		indexInSlot: Number(params.index),
	}, {
		fields: {
			committeeIndex: true,
			aggregationBits: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInSlot) ?? '') ? 'Attestation #' + String((pageSelection.entitySelector.indexInSlot) ?? '') : '') || 'beacon attestation' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') ? 'Attestation #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') : '') || 'beacon attestation')))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconAttestationView from '$/views/BeaconAttestationView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • beacon attestation • Blockhead</title>
</svelte:head>


<Page>
	<BeaconAttestationView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
				network: params.network,
				slot: params.slot,
				index: params.index,
			})
		}
		selection={pageSelection}
	/>
</Page>
