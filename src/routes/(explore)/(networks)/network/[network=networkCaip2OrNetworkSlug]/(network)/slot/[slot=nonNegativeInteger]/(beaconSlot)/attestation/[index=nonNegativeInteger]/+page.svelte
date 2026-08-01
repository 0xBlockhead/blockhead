<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconAttestationView from '$/views/BeaconAttestationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.indexInSlot ?? '') ? 'Attestation #' + String(pageSelection.entitySelector.indexInSlot ?? '') : '') || 'beacon attestation')} • beacon attestation • Blockhead</title>
</svelte:head>


<Page>
	<BeaconAttestationView
		selection={pageSelection}
	/>
</Page>
