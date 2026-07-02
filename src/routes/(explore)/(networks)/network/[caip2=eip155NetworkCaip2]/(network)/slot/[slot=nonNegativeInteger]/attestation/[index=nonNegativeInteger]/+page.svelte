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


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconAttestationView from '$/views/BeaconAttestationView.svelte'
</script>


<svelte:head>
	<title>beacon attestation • Blockhead</title>
</svelte:head>


<Page>
	<BeaconAttestationView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
				caip2: params.caip2,
				slot: params.slot,
				index: params.index,
			})
		}
		selection={
			select(EntityType.BeaconAttestation, data.selector, {
				fields: {
					committeeIndex: true,
					aggregationBits: true,
				},
			})
		}
	/>
</Page>
