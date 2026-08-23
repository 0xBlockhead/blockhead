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


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconAttestationView from '$/views/BeaconAttestationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconAttestation, {
				$block: data.selector,
				indexInBlock: Number(params.indexInBlock),
			})}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInBlock ?? '') ? 'Attestation #' + String(pageSelection.entitySelector.indexInBlock ?? '') : '') || 'beacon attestation')} • beacon attestation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon attestation'} • beacon attestation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconAttestation, {
				$block: data.selector,
				indexInBlock: Number(params.indexInBlock),
			})}

	<BeaconAttestationView
		selection={pageSelection}
	/>
	{/if}
</Page>
