<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


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
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiArtifactAttestation, {
					$artifact: data.selector,
					attestationKind: params.attestationKind,
					logEntryId: params.logEntryId,
				}, {
					sources: [
						Source.Eip8004Scan_Rest,
						Source.Ipfs_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.attestationKind || 'AI artifact attestation')} • AI artifact attestation • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'AI artifact attestation'} • AI artifact attestation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiArtifactAttestation, {
					$artifact: data.selector,
					attestationKind: params.attestationKind,
					logEntryId: params.logEntryId,
				}, {
					sources: [
						Source.Eip8004Scan_Rest,
						Source.Ipfs_Rest,
					],
				}))}

		<AiArtifactAttestationView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
