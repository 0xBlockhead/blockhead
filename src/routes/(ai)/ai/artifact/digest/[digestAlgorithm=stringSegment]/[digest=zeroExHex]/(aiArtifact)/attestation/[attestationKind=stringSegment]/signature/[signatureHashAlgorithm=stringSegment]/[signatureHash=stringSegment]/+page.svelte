<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiArtifactAttestation, {
		$artifact: data.selector,
		attestationKind: params.attestationKind,
		signatureHashAlgorithm: params.signatureHashAlgorithm,
		signatureHash: params.signatureHash,
	}, {
		sources: [
			Source.Eip8004Scan_Rest,
			Source.Ipfs_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiArtifactAttestationView from '$/views/AiArtifactAttestationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.attestationKind || 'AI artifact attestation')} • AI artifact attestation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI artifact attestation'} • AI artifact attestation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AiArtifactAttestationView
		selection={pageSelection}
	/>
	{/if}
</Page>
