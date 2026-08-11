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

	const pageSelection = $derived(select(EntityType.EasAttestation, data.selector, {
		sources: [
			Source.EasScan_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EasAttestationView from '$/views/EasAttestationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.uid || 'EAS attestation')} • EAS attestation • Blockhead</title>
</svelte:head>


<Page>
	<EasAttestationView
		selection={pageSelection}
	/>
</Page>
