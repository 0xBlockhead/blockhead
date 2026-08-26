<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconAttestation, {
		$block: data.selector,
		indexInBlock: Number(params.indexInBlock),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconAttestationView from '$/views/BeaconAttestationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInBlock ?? '') ? 'Attestation #' + String(pageSelection.entitySelector.indexInBlock ?? '') : '') || 'beacon attestation')} • beacon attestation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon attestation'} • beacon attestation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconAttestationView
		selection={pageSelection}
	/>
	{/if}
</Page>
