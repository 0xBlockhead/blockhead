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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EasAttestationView from '$/views/EasAttestationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EasAttestation, data.selector, {
				sources: [
					Source.EasScan_Graphql,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.uid || 'EAS attestation')} • EAS attestation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EAS attestation'} • EAS attestation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EasAttestation, data.selector, {
				sources: [
					Source.EasScan_Graphql,
				],
			})}

	<EasAttestationView
		selection={pageSelection}
	/>
	{/if}
</Page>
