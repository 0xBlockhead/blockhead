<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AiArtifactAttestationView from '$/views/AiArtifactAttestationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiArtifactAttestation, {
				$artifact: data.selector,
				attestationKind: params.attestationKind,
				signatureHashAlgorithm: params.signatureHashAlgorithm,
				signatureHash: params.signatureHash,
			}, {
				sources: [
					Source.Eip8004Scan_Rest,
					Source.Ipfs_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.attestationKind || 'AI artifact attestation')} • AI artifact attestation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI artifact attestation'} • AI artifact attestation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiArtifactAttestation, {
				$artifact: data.selector,
				attestationKind: params.attestationKind,
				signatureHashAlgorithm: params.signatureHashAlgorithm,
				signatureHash: params.signatureHash,
			}, {
				sources: [
					Source.Eip8004Scan_Rest,
					Source.Ipfs_Rest,
				],
			})}

	<AiArtifactAttestationView
		selection={pageSelection}
	/>
	{/if}
</Page>
